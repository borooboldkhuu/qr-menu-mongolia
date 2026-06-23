'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BarChart3, Eye, TrendingUp, Smartphone } from 'lucide-react';

interface ScanData {
  date: string;
  count: number;
}

interface DeviceData {
  device: string;
  count: number;
}

export default function AnalyticsPage() {
  const [slug, setSlug] = useState('');
  const [dailyScans, setDailyScans] = useState<ScanData[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<DeviceData[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/restaurants').then((res) => {
      if (res.data.data.length > 0) setSlug(res.data.data[0].slug);
    });
  }, []);

  useEffect(() => {
    if (slug) {
      api.get(`/restaurants/${slug}/analytics`).then((res) => setStats(res.data.data));
      api.get(`/restaurants/${slug}/analytics/scans/daily?days=30`).then((res) => setDailyScans(res.data.data));
      api.get(`/restaurants/${slug}/analytics/devices`).then((res) => setDeviceBreakdown(res.data.data));
    }
  }, [slug]);

  const maxScan = Math.max(...dailyScans.map((d) => d.count), 1);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Статистик</h2>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border">
            <p className="text-sm text-gray-500">Нийт хандалт</p>
            <p className="text-3xl font-bold">{stats.totalScans.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border">
            <p className="text-sm text-gray-500">Өнөөдөр</p>
            <p className="text-3xl font-bold">{stats.todayScans.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border">
            <p className="text-sm text-gray-500">Нийт хоол</p>
            <p className="text-3xl font-bold">{stats.totalItems.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" /> Хандалт (30 хоног)
          </h3>
          <div className="flex items-end gap-1 h-40">
            {dailyScans.length === 0 && <p className="text-gray-400 text-sm">Хандалт байхгүй</p>}
            {dailyScans.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-brand-200 rounded-t"
                  style={{ height: `${(d.count / maxScan) * 140}px`, minHeight: d.count > 0 ? '4px' : '0' }}
                />
                <span className="text-xs text-gray-400 rotate-45 origin-left">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-600" /> Төхөөрөмжөөр
          </h3>
          {deviceBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm">Өгөгдөл байхгүй</p>
          ) : (
            <div className="space-y-3">
              {deviceBreakdown.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm w-20 text-gray-600">{d.device === 'mobile' ? '📱 Утас' : d.device === 'desktop' ? '🖥️ Компьютер' : d.device === 'tablet' ? '📋 Таблет' : '❓ Бусад'}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4">
                    <div className="bg-brand-500 h-4 rounded-full" style={{ width: `${(d.count / Math.max(...deviceBreakdown.map((x) => x.count))) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
