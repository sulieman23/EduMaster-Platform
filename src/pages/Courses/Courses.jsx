// ...existing code...
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEntitlements } from "../../context/EntitlementsContext.jsx";
import { payLesson } from "../../api/lesson.js";
import MainLayout from "../../layouts/MainLayout.jsx";

export default function Courses() {
  const auth = useAuth() || {};
  const token = auth?.token || localStorage.getItem("token") || null;
  const navigate = useNavigate();
  const { hasPurchasedLesson } = useEntitlements() || { hasPurchasedLesson: () => false };
  const isAdmin = (auth?.role || localStorage.getItem('userRole')) === 'admin';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalize = (item) => ({
    id: item.id ?? item._id,
    title: item.title || item.name || "بدون عنوان",
    description: item.description || item.summary || "",
    image: item.image || item.thumbnail || "",
    videoUrl: item.video || item.videoUrl || "",
    classLevel: item.classLevel || "",
    price: typeof item.price !== "undefined" ? item.price : null,
    isPaid: !!item.isPaid,
    scheduledDate: item.scheduledDate ? new Date(item.scheduledDate) : null,
    createdBy: item.createdBy || item.author || null,
  });

  const loadAllCourses = async () => {
    console.debug("[Courses] loadAllCourses token=", !!token);
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get("/lesson/", {
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      });

      const payload = res.data;
      let list = Array.isArray(payload)
        ? payload
        : payload?.data && Array.isArray(payload.data)
        ? payload.data
        : Object.values(payload || {}).find((v) => Array.isArray(v)) || [];

      const normalized = list.map(normalize);
      setCourses(normalized);
    } catch (err) {
      console.error("[Courses] Failed to fetch all:", err);
      const status = err?.response?.status;
      if (status === 401) {
        // For guests, don't force login prompt; just show list as empty without error
        setError("");
      } else {
        setError("فشل في تحميل الكورسات. افتح Console للمزيد من التفاصيل.");
      }
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const canWatch = (course) => {
    // Admins can always watch. For users: allow if free OR purchased.
    if (isAdmin) return true;
    if (!course?.isPaid) return !!course?.videoUrl; // free content
    return hasPurchasedLesson(course.id) && !!course?.videoUrl;
  };

  const onPay = async (course) => {
    // Block protected call for guests
    const hasToken = !!(auth?.token || localStorage.getItem('token'))
    if (!hasToken) {
      console.info('[Courses] guest user attempted pay; redirecting to login')
      navigate('/login')
      return
    }
    try {
      const res = await payLesson(course.id);
      const url = res?.paymentUrl || res?.url || res?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        alert('Payment link is unavailable at the moment.');
      }
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Payment failed');
    }
  };

  useEffect(() => {
    loadAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
        d
      );
    } catch {
      return d.toISOString();
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">الكورسات</h1>
          <p className="text-sm text-gray-500">
            استعرض كل الدروس المتاحة — الآن بشكل أجمل.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white shadow-sm overflow-hidden animate-pulse"
              >
                <div className="w-full h-44 bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
                  <div className="h-9 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : courses.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            لا توجد كورسات لعرضها.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <article
                key={c.id}
                className="relative rounded-lg bg-white shadow-md overflow-hidden transform transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* price / paid ribbon */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.isPaid
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.isPaid ? "Paid" : "Free"}
                  </span>
                  {c.isPaid && c.price !== null && (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                      {c.price} EGP
                    </span>
                  )}
                </div>

                {/* image */}
                <Link to={`/courses/${c.id}`} className="block">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-50 flex items-center justify-center text-gray-300">
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {c.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {c.classLevel && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {c.classLevel}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        Scheduled: {formatDate(c.scheduledDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {canWatch(c) ? (
                        c.videoUrl && (
                          <a
                            href={c.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Watch
                          </a>
                        )
                      ) : (
                        c.isPaid && (
                          <button onClick={() => onPay(c)} className="text-xs text-blue-600 font-medium">
                            Pay
                          </button>
                        )
                      )}
                      <Link to={`/courses/${c.id}`} className="text-xs text-blue-600 font-medium">View</Link>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link to={`/courses/${c.id}`} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">Open</Link>
                    {canWatch(c) ? (
                      <button
                        onClick={() => { if (c.videoUrl) window.open(c.videoUrl, "_blank", "noopener"); else navigate(`/courses/${c.id}`); }}
                        className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        Quick
                      </button>
                    ) : (
                      c.isPaid && (
                        <button onClick={() => onPay(c)} className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">
                          Pay
                        </button>
                      )
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
// ...existing code...


