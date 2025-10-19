// ...existing code...
import React from "react";
import { Link } from "react-router-dom";

function CourseCard({
  courseId,
  title,
  author,
  image,
  lessons,
  rating,
  price,
  originalPrice,
  courses = null,
}) {
 
  if (Array.isArray(courses)) {
    const noVideo = courses.filter((c) => !(c.video || c.videoUrl));
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h4 className="text-sm font-semibold mb-3">Courses (no video)</h4>
        {noVideo.length === 0 ? (
          <div className="text-xs text-gray-500">
            لا توجد كورسات بدون فيديو.
          </div>
        ) : (
          <ul className="space-y-2">
            {noVideo.map((c) => {
              const id = c.id ?? c._id;
              const t = c.title ?? c.name ?? "بدون عنوان";
              return (
                <li key={id}>
                  <Link
                    to={`/courses/${id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title ? `${title} cover` : "Course cover"}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">by {author}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <svg
              className="h-4 w-4 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.801 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.801-2.034a1 1 0 00-1.176 0l-2.801 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">{lessons} lessons</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">${price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>

        <Link
          to={courseId ? `/courses/${courseId}` : "#"}
          className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
        >
          Enroll Now
        </Link>
      </div>
    </article>
  );
}

CourseCard.defaultProps = {
  author: "Unknown",
  image: "",
  lessons: 0,
  rating: null,
  price: null,
  originalPrice: null,
  courses: null,
};

export default CourseCard;
// ...existing code...
