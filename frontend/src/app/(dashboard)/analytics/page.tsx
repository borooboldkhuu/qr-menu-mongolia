'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TrendingUp, Eye, Calendar, Clock, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [slug, setSlug] = useState(localStorage.getItem('restaurantSlug') || '');
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    if (!slug) {
      api.get('/restaurants').then(res => {
        if (res.data.data.length > 0) {
          const s = res.data.data[0].slug;
          setSlug(s);
          localStorage.setItem('restaurantSlug', s);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (slug) {
      const params = period === 'week' ? '?days=7' : period === 'month' ? '?days=30' : '';
      api.get(`/restaurants/${slug}/analytics${params}`).then(res => setStats(res.data.data)).catch(() => {});
    }
  }, [slug, period]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Статистик</h2>
      <p className="text-sm text-gray-400 mb-6">QR уншуулалт, хандалтын дэлгэрэнгүй мэдээлэл</p>

      <div className="flex gap-2 mb-6">
        {[
          { k: 'today', l: 'Өнөөдөр' },
          { k: 'week', l: '7 хоног' },
          { k: 'month', l: '30 хоног' },
        ].map(p => (
          <button
            key={p.k}
            onClick={() => setPeriod(p.k as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${period === p.k ? 'bg-brand-600 text-white' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}
          >
            {p.l}
          </button>
        ))}
      </div>

      {!stats && (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-brand-600 animate-spin" />
          Ачаалж байна...
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border">
              <Eye className="w-5 h-5 text-blue-500 mb-3" />
              <p className="text-2xl font-bold">{(stats.totalScans || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Нийт хандалт</p>
            </div>
            <div className="bg-white p-5 rounded-xl border">
              <Activity className="w-5 h-5 text-green-500 mb-3" />
              <p className="text-2xl font-bold">{(stats.todayScans || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">{period === 'today' ? 'Өнөөдөр' : period === 'week' ? '7 хоног' : '30 хоног'}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border">
              <TrendingUp className="w-5 h-5 text-purple-500 mb-3" />
              <p className="text-2xl font-bold">{(stats.totalQrCodes || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">QR кодууд</p>
            </div>
            <div className="bg-white p-5 rounded-xl border">
              <Calendar className="w-5 h-5 text-orange-500 mb-3" />
              <p className="text-2xl font-bold">{(stats.totalItems || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Нийт хоол</p>
            </div>
          </div>

          {stats.dailyBreakdown && stats.dailyBreakdown.length > 0 && (
            <div className="bg-white rounded-xl border overflow-hidden mb-6">
              <h3 className="font-semibold p-4 pb-0">📊 Өдрөөр хандалт</h3>
              <div className="p-4 space-y-2">
                {stats.dailyBreakdown.slice(0, 7).map((d: any) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-gray-500">{new Date(d.date).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all" style={{ width: `${Math.min(100, ((d.scans || 0) / Math.max(1, stats.todayScans || 1)) * 100)}%` }} />
                    </div>
                    <span className="w-10 text-right text-sm font-medium">{d.scans || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">🔍 Хандалтын түүх</h3>
            {stats.history && stats.history.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {stats.history.map((h: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span className="text-gray-600">{new Date(h.scannedAt).toLocaleString('mn-MN')}</span>
                    </div>
                    <span className="text-xs text-gray-400">{h.qrCode?.name || 'QR код'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Хандалт бүртгэгдээгүй байна</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
