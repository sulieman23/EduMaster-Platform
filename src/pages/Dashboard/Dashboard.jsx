import { NavLink, Outlet, Route, Routes } from 'react-router-dom'

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white">
        <div className="h-16 border-b px-4 flex items-center text-lg font-semibold">EduPress</div>
        <nav className="p-3 space-y-1">
          <NavLink to="." end className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-700 hover:bg-neutral-50'}`}>Overview</NavLink>
          <NavLink to="courses" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-700 hover:bg-neutral-50'}`}>My Courses</NavLink>
          <NavLink to="profile" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-neutral-700 hover:bg-neutral-50'}`}>Profile</NavLink>
        </nav>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="h-16 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline text-neutral-600">Hello, Learner</span>
              <button className="rounded-md border px-3 py-1.5 hover:bg-neutral-50">Logout</button>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function DashboardOverview() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Overview</h2>
      <p className="mt-2 text-neutral-600">Quick stats and recent activity.</p>
    </div>
  )
}

function DashboardCourses() {
  return (
    <div>
      <h2 className="text-xl font-semibold">My Courses</h2>
      <p className="mt-2 text-neutral-600">Enrolled courses appear here.</p>
    </div>
  )
}

function DashboardProfile() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Profile</h2>
      <p className="mt-2 text-neutral-600">Manage your account details.</p>
    </div>
  )
}

function Dashboard() {
  return (
    <Routes>
      <Route
        element={
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="courses" element={<DashboardCourses />} />
        <Route path="profile" element={<DashboardProfile />} />
      </Route>
    </Routes>
  )
}

export default Dashboard




