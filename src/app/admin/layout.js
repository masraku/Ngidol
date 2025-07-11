import 'bootstrap/dist/css/bootstrap.min.css';
import '@/style/globals.css';
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header-Admin'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/user/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Muchitsujo Admin Dashboard',
  description: 'Admin dashboard untuk manajemen idol dan event',
}

export default function AdminLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="layout d-flex">
            <Sidebar />
            <div className="content-wrapper flex-grow-1 d-flex flex-column">
              <Header />
              <main className="main-content flex-grow-1 p-3">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
