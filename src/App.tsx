import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import type { RouteRecord } from 'vite-react-ssg'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function PageFallback() {
  return <div className="container py-20 text-center text-slate-400">טוען…</div>
}

// Top-level shell: auth context wraps every route.
function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

// Public marketing layout (navbar + footer) around the page outlet.
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'))

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, Component: React.lazy(() => import('./pages/Home')) },
          { path: 'products', Component: React.lazy(() => import('./pages/Products')) },
          { path: 'products/:slug', Component: React.lazy(() => import('./pages/ProductDetail')) },
          { path: 'solutions', Component: React.lazy(() => import('./pages/Solutions')) },
          { path: 'about', Component: React.lazy(() => import('./pages/About')) },
          { path: 'news', Component: React.lazy(() => import('./pages/News')) },
          { path: 'contact', Component: React.lazy(() => import('./pages/Contact')) },
          { path: 'quote', Component: React.lazy(() => import('./pages/Quote')) },
          { path: '*', Component: React.lazy(() => import('./pages/NotFound')) },
        ],
      },
      // Admin (not prerendered — see includedRoutes in main.tsx)
      { path: 'admin/login', Component: React.lazy(() => import('./pages/admin/Login')) },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]

export default routes
