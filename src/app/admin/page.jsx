import { Users, Calendar, Heart, Star } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Idol</p>
              <p className="text-2xl font-bold text-gray-800">156</p>
            </div>
            <Users style={{width: '2rem', height: '2rem', color: '#4f46e5'}} />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Event Aktif</p>
              <p className="text-2xl font-bold text-gray-800">23</p>
            </div>
            <Calendar style={{width: '2rem', height: '2rem', color: '#10b981'}} />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Followers</p>
              <p className="text-2xl font-bold text-gray-800">2.4M</p>
            </div>
            <Heart style={{width: '2rem', height: '2rem', color: '#ef4444'}} />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rating</p>
              <p className="text-2xl font-bold text-gray-800">4.8</p>
            </div>
            <Star style={{width: '2rem', height: '2rem', color: '#f59e0b'}} />
          </div>
        </div>
      </div>
      
      {/* Welcome Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Selamat Datang di Muchitsujo Admin
        </h3>
        <p className="text-gray-600">
          Kelola idol dan event Anda dengan mudah melalui dashboard ini. 
          Gunakan menu sidebar untuk navigasi ke berbagai fitur yang tersedia.
        </p>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between" style={{paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6'}}>
            <div className="flex items-center">
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '0.75rem'}}></div>
              <span className="text-gray-700">Idol baru "Sakura Miyuki" ditambahkan</span>
            </div>
            <span className="text-sm text-gray-600">2 jam lalu</span>
          </div>
          <div className="flex items-center justify-between" style={{paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6'}}>
            <div className="flex items-center">
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem'}}></div>
              <span className="text-gray-700">Event "Summer Festival 2025" diupdate</span>
            </div>
            <span className="text-sm text-gray-600">5 jam lalu</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div style={{width: '0.5rem', height: '0.5rem', backgroundColor: '#8b5cf6', borderRadius: '50%', marginRight: '0.75rem'}}></div>
              <span className="text-gray-700">3 event baru telah dijadwalkan</span>
            </div>
            <span className="text-sm text-gray-600">1 hari lalu</span>
          </div>
        </div>
      </div>
    </div>
  );
}