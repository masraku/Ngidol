import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header-Admin'

export const metadata = {
  title: 'Muchitsujo Admin Dashboard',
  description: 'Admin dashboard untuk manajemen idol dan event',
}

export default function AdminLayout({ children }) {
  return (
    <div className="layout admin-shell d-flex">
      <Sidebar />
      <div className="content-wrapper flex-grow-1 d-flex flex-column">
        <Header />
        <main className="main-content flex-grow-1 p-3">
          {children}
        </main>
      </div>
    </div>
  )
}
