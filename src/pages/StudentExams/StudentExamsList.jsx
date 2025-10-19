import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/client.js";

if (!window.__studentExamsLoadStarted) {
  window.__studentExamsLoadStarted = false;
}

export default function StudentExamsList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const triedRef = useRef(false);

  const role = localStorage.getItem("userRole");
  const isAdmin = role === "admin";

  const [testEp, setTestEp] = useState("/exams");
  const [testResult, setTestResult] = useState("");

  const endpoints = isAdmin
    ? [
        "/exam", 
        "/api/v1/exams/", 
    "/api/v1/exams",
      ]
    : [
        "/studentExam/exams", 
        "/api/v1/studentExams/exams", 
  ];

  useEffect(() => {
    if (!isAdmin) return; 
    if (triedRef.current || window.__studentExamsLoadStarted) return;
    triedRef.current = true;
    window.__studentExamsLoadStarted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      let found = false;
      let lastError = null;

      for (const ep of endpoints) {
        try {
          console.log("[StudentExamsList] trying", ep);
          const res = await apiClient.get(ep);

          const contentType = res?.headers?.["content-type"] || "";
          if (contentType.includes("text/html")) {
            lastError = `HTML response from ${ep} (probably 404 page)`;
            console.warn("[StudentExamsList] skipping HTML response", ep);
            continue;
          }

          const data = res?.data;

          let list = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.exams)
            ? data.exams
            : Array.isArray(data?.data?.exams)
            ? data.data.exams
            : Array.isArray(data)
            ? data
            : null;

          if (!list && ep === "/courses" && data) {
            const arr = Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
              ? data.data
              : null;
            if (Array.isArray(arr)) {
              list = arr.map((c) => ({
                id: c.id ?? c._id,
                title: c.title ?? c.name ?? c.courseName ?? "Untitled",
                duration:
                  c.duration ??
                  (Array.isArray(c.lessons) ? c.lessons.length * 5 : undefined), 
              }));
            }
          }

          if (Array.isArray(list)) {
            setExams(list);
            found = true;
            break;
          }

          lastError = `Unexpected shape from ${ep}: ${JSON.stringify(
            data
          ).slice(0, 300)}`;
          console.warn("[StudentExamsList] unexpected shape", ep, data);
        } catch (err) {
          lastError = err;
          const status = err?.response?.status;
          const body = err?.response?.data;
          if (status === 401 || status === 403) {
            console.warn(
              `[StudentExamsList] ${ep} -> ${status} unauthorized/forbidden. Check token/role or API permissions.`
            );
            break;
          }
          console.log(
            `[StudentExamsList] ${ep} -> ${status || err.message}`,
            body || ""
          );
          if (status === 404) {
            continue;
          }
          break;
        }
      }

      if (!found) {
        const msg =
          typeof lastError === "string"
            ? lastError
            : lastError?.response?.data
            ? typeof lastError.response.data === "string"
              ? lastError.response.data
              : JSON.stringify(lastError.response.data).slice(0, 400)
            : lastError?.message ||
              "لم أجد endpoint صالح لعرض الامتحانات. استخدم مربع Test لتجربة مسارات أخرى أو راجع backend.";
        setError(msg);
        setExams([]);
      }

      setLoading(false);
    };

    load();
  }, [isAdmin]);

  const runTest = async () => {
    setTestResult("Running...");
    try {
      const res = await apiClient.get(testEp);
      setTestResult(JSON.stringify(res.data, null, 2));
    } catch (e) {
      const status = e?.response?.status;
      const body = e?.response?.data ?? e?.message;
      setTestResult(
        `${status || ""} ${
          typeof body === "object" ? JSON.stringify(body, null, 2) : body
        }`
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">امتحانات الطلاب</h1>

      {/* Student quick start (non-admin) */}
      {!isAdmin && (
        <StudentQuickStart />
      )}

      {/* Admin debug/test tools */}
      {isAdmin && (
        <>
      <div className="mb-4 flex gap-2">
        <input
          value={testEp}
          onChange={(e) => setTestEp(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={runTest}
          className="px-3 py-2 bg-gray-800 text-white rounded"
        >
          Test
        </button>
      </div>
      {testResult && (
        <pre className="bg-black/5 p-3 rounded text-xs whitespace-pre-wrap mb-4">
          {testResult}
        </pre>
          )}
        </>
      )}

      {isAdmin && loading && (
        <div className="text-gray-600 mb-4">جاري التحميل...</div>
      )}

      {isAdmin && error && (
        <div className="text-red-600 mb-4">
          <div>خطأ في جلب الامتحانات:</div>
          <pre className="whitespace-pre-wrap text-xs">{String(error)}</pre>
          <div className="text-xs text-gray-500 mt-2">
            مقترح: جرّب مسار مختلف في مربع Test أو اطلب من مطوّر الـ backend
            مسار API الصحيح لقائمة الامتحانات.
          </div>
        </div>
      )}

      {isAdmin && !loading && exams.length === 0 && !error && (
        <div className="text-gray-600">لا توجد امتحانات متاحة.</div>
      )}

      {isAdmin && (
      <ul className="space-y-3">
        {exams.map((ex) => {
          const id = ex._id ?? ex.id;
          return (
            <li
              key={id}
              className="p-4 border rounded flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">
                  {ex.title ?? ex.name ?? "Untitled exam"}
                </div>
                <div className="text-sm text-gray-500">
                  {ex.duration ? `${ex.duration} دقيقة` : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/student-exam/${id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Start / Open
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}
// Simple sub-component: student quick start by examId
function StudentQuickStart() {
  const [examId, setExamId] = useState("");
  return (
    <div className="mb-6 p-4 border rounded">
      <div className="font-semibold mb-2">ابدأ امتحان برقم الامتحان</div>
      <div className="flex gap-2">
        <input
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          placeholder="Exam ID"
          className="flex-1 border rounded px-3 py-2"
        />
        <Link
          to={examId ? `/student-exam/${examId}` : "#"}
          className={`px-3 py-2 rounded text-white ${examId ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={(e) => {
            if (!examId) e.preventDefault();
          }}
        >
          فتح الامتحان
        </Link>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        أدخل معرف الامتحان الذي وصلك من المعلم لبدء الامتحان.
      </div>
    </div>
  );
}
// ...existing code...
