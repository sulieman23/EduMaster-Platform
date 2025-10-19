// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client.js";

export default function StudentExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null); // full exam after start
  const [preview, setPreview] = useState(null); // metadata from GET /exams/:id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(null);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const timerRef = useRef(null);
  const triedRef = useRef(false);

  const fmt = (s) => {
    if (s == null) return "—";
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.max(0, s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };
  // ...existing code...

  const startTimer = (initialSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRemaining(initialSeconds);
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = (prev ?? 0) - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          if (!submitted) {
            handleSubmit(true);
          }
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  // fetch exam metadata: prefer admin exam endpoint and normalize response
  useEffect(() => {
    const loadMeta = async () => {
      try {
        // Prefer: GET /exam/get/:id
        let res;
        try {
          res = await apiClient.get(`/exam/get/${examId}`, { requiresAuth: true });
        } catch (e) {
          // fallback to prefixed variant used elsewhere
          res = await apiClient.get(`/api/v1/exams/${examId}`, { requiresAuth: true });
        }
        const d = res?.data;
        const list = Array.isArray(d?.data) ? d.data : undefined;
        const meta = list?.[0] ?? d?.data ?? d;
        setPreview(meta || null);
      } catch (e) {
        // ignore — start endpoint will return full exam when appropriate
        console.warn("preview fetch failed", e?.response?.status || e.message);
      }
    };
    loadMeta();
  }, [examId]);

  const startExam = async () => {
    setLoading(true);
    setError("");
    try {
      // prefer singular endpoint per docs, keep plural as fallback
      let res;
      try {
        res = await apiClient.post(`/studentExam/start/${examId}`, undefined, { requiresAuth: true });
      } catch (e) {
        res = await apiClient.post(`/studentExams/start/${examId}`, undefined, { requiresAuth: true });
      }
      const data = res.data?.data ?? res.data;
      setExam(data);
      setStarted(true);

      // compute remaining from returned end time, fallback to duration (minutes)
      const endStr = data.endAt || data.end || data.endAtDate || data.endTime;
      let secs = null;
      if (endStr) {
        const end = new Date(endStr).getTime();
        const now = Date.now();
        secs = Math.max(0, Math.floor((end - now) / 1000));
      }
      if (secs == null || Number.isNaN(secs) || secs === 0) {
        const durMin = data.duration ?? preview?.duration;
        if (durMin != null) secs = Math.max(0, Math.floor(Number(durMin) * 60));
      }
      if (secs == null) secs = 0;
      setRemaining(secs);
      startTimer(secs);

      // If start API didn't include questions, fetch detailed exam (populated questions)
      const hasQuestions = Array.isArray(data?.questions) && data.questions.length > 0;
      if (!hasQuestions) {
        try {
          let dres;
          try {
            dres = await apiClient.get(`/exam/get/${examId}`, { requiresAuth: true });
          } catch (e) {
            dres = await apiClient.get(`/api/v1/exams/${examId}`, { requiresAuth: true });
          }
          const det = dres?.data?.data ?? dres?.data;
          if (det) {
            const detail = Array.isArray(det?.data) ? det.data?.[0] : det;
            if (detail?.questions) {
              setExam((prev) => ({ ...(prev || {}), questions: detail.questions }));
            }
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "فشل في بدء الامتحان"
      );
      if (
        err?.response?.status === 409 ||
        (err?.response?.data?.message || "").toLowerCase().includes("submitted")
      ) {
        fetchScore();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (auto = false) => {
    if (submitted) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId: questionId,
          selectedAnswer: value,
        })),
      };

      console.debug("[StudentExam] submit payload", JSON.stringify(payload));
      let res;
      try {
        res = await apiClient.post(`/studentExam/submit/${examId}`, payload, { requiresAuth: true });
      } catch (e) {
        res = await apiClient.post(`/studentExams/submit/${examId}`, payload, { requiresAuth: true });
      }
      const d = res.data?.data ?? res.data;
      setSubmitted(true);
      setScore(d?.score ?? d);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "فشل في تسليم الامتحان"
      );
      if (err?.response?.status === 410 || err?.response?.status === 409) {
        fetchScore();
      }
    } finally {
      setLoading(false);
      clearInterval(timerRef.current);
    }
  };

  const fetchRemainingTime = async () => {
    try {
      // Use documented remaining-time endpoint
      let res;
      try {
        res = await apiClient.get(`/studentExam/exams/remaining-time/${examId}`, { requiresAuth: true });
      } catch (e) {
        // fallback to prefixed variant if exists
        res = await apiClient.get(`/studentExams/remaining-time/${examId}`, { requiresAuth: true });
      }
      const remainingSecs =
        res.data?.remainingSeconds ??
        res.data?.remaining ??
        res.data?.data?.remaining ??
        null;
      if (remainingSecs != null) {
        setRemaining(remainingSecs);
        if (!started) startTimer(remainingSecs);
      }
    } catch (err) {
      // ignore
    }
  };

  const fetchScore = async () => {
    try {
      // Use documented score endpoint for current student
      let res;
      try {
        res = await apiClient.get(`/studentExam/exams/score/${examId}`, { requiresAuth: true });
      } catch (e) {
        res = await apiClient.get(`/studentExams/exams/score/${examId}`, { requiresAuth: true });
      }
      const d = res.data?.data ?? res.data;
      setScore(d?.score ?? d);
      setSubmitted(true);
    } catch (err) {
      // ignore
    }
  };

  // ...existing code...
  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;
    fetchRemainingTime();
    return () => clearInterval(timerRef.current);
  }, []);

  const onAnswer = (questionId, value) =>
    setAnswers((s) => ({ ...s, [questionId]: value }));

  // ...existing render code unchanged ...
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {preview?.title ?? "Student Exam"}
      </h1>

      {error && <div className="mb-4 text-red-600">{String(error)}</div>}

      {!started && !submitted && (
        <div className="mb-6">
          <p className="mb-2">امتحان: {preview?.title ?? "—"}</p>
          <p className="mb-2">
            مدة الامتحان:{" "}
            {preview?.duration ? `${preview.duration} دقيقة` : "—"}
          </p>
          <button
            onClick={startExam}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "جاري التنفيذ..." : "Start Exam"}
          </button>
        </div>
      )}

      {started && !submitted && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              Remaining: <strong>{fmt(remaining)}</strong>
            </div>
            <button
              onClick={() => handleSubmit(false)}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          </div>

          <div className="space-y-6">
            {(exam?.questions ?? []).map((q, idx) => {
              const qid = q._id ?? q.id ?? String(idx);
              return (
              <div key={qid} className="p-4 border rounded">
                <div className="font-medium mb-2">
                  {idx + 1}. {q.text ?? q.question}
                </div>

                {(q.options ?? []).length > 0 ? (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`q-${qid}`}
                          value={opt}
                          checked={answers[qid] === opt}
                          onChange={() => onAnswer(qid, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={answers[qid] ?? ""}
                    onChange={(e) => onAnswer(qid, e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="أدخل إجابتك..."
                  />
                )}
              </div>
            );})}
          </div>
        </div>
      )}

      {submitted && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Result</h2>
          <div>Score: {score != null ? JSON.stringify(score) : "—"}</div>
          <div className="mt-3">
            <button
              onClick={() => navigate("/student-exams")}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Back to exams
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...
