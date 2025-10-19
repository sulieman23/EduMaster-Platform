import React from 'react'
import MainLayout from '../../layouts/MainLayout.jsx'

export default function About(){
  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">About EduPress</h1>
            <p className="mt-3 text-base text-gray-600 max-w-2xl">
              منصة تعليمية حديثة تُقدّم محتوى منظم وامتحانات تفاعلية وتجربة سلسة للطالب والمدرّس، مع دعم كامل للأدوار والصلاحيات.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">رؤية المنصّة</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                تسهيل الوصول إلى الدروس والاختبارات عبر تجربة استخدام بسيطة ومتوافقة مع مختلف الأجهزة.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لماذا EduPress؟</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                تنظيم المحتوى، إدارة الامتحانات، تتبّع تقدّم الطلاب، ودعم خطط الدفع للدروس المدفوعة.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">قيمنا</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                البساطة، الأمان، المرونة، والأداء. نبني خصيصًا لتجربة تعليمية موثوقة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">ماذا نقدّم؟</h3>
              <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                <li>مكتبة دروس منظّمة حسب المرحلة الدراسية.</li>
                <li>امتحانات تقييميّة بواجهة تفاعلية مع مؤقّت وتصحيح تلقائي.</li>
                <li>لوحة تحكّم للإدمن لإدارة الدروس والأسئلة والامتحانات والمستخدمين.</li>
                <li>تكامل للدفع لشراء الدروس المدفوعة.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">منهجيتنا التعليمية</h3>
              <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                <li>تعلّم تدريجي يبدأ بالمفاهيم الأساسية ثم ينتقل للتطبيق العملي.</li>
                <li>تمارين قصيرة بعد كل درس مع تغذية راجعة فورية.</li>
                <li>امتحانات ختامية تقيس الفهم وتُبرز نقاط التحسين.</li>
                <li>لوحة أداء شخصية لمتابعة تقدّمك أسبوعيًا.</li>
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <div className="text-2xl font-extrabold text-gray-900">+95%</div>
                  <div className="text-xs text-gray-500">رضا المتعلمين</div>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <div className="text-2xl font-extrabold text-gray-900">+300</div>
                  <div className="text-xs text-gray-500">سؤال تفاعلي</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">ابدأ رحلتك التعليمية الآن</h3>
              <p className="text-sm text-blue-100">تصفّح الكورسات وابدأ التعلّم بخطوات بسيطة.</p>
            </div>
            <a href="/courses" className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 font-semibold px-5 py-3 shadow hover:bg-blue-50">
              تصفّح الكورسات
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
