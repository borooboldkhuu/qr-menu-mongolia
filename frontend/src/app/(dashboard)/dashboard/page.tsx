'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { UtensilsCrossed, Grid3X3, QrCode, BarChart3, Eye, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalScans: number;
  todayScans: number;
  totalQrCodes: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [slug, setSlug] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [rName, setRName] = useState('');
  const [rSlug, setRSlug] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get('/restaurants').then((res) => {
      const restaurants = res.data.data;
      if (restaurants.length > 0) {
        setSlug(restaurants[0].slug);
      }
    });
  }, []);

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/restaurants', { name: rName, slug: rSlug, phone: rPhone });
      setSlug(rSlug);
      setShowForm(false);
      // Start trial
      await api.post(`/restaurants/${rSlug}/subscription`);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Үүсгэхэд алдаа гарлаа');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (slug) {
      api.get(`/restaurants/${slug}/analytics`).then((res) => setStats(res.data.data));
    }
  }, [slug]);

  if (!slug) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 max-w-md">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-semibold">Ресторан үүсгэх</h2>
          <p className="text-gray-500">Эхлээд ресторанаа бүртгүүлнэ үү</p>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium">
              Ресторан үүсгэх
            </button>
          ) : (
            <form onSubmit={handleCreateRestaurant} className="bg-white p-6 rounded-xl border text-left space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Рестораны нэр</label>
                <input value={rName} onChange={(e) => setRName(e.target.value)} className="w-full border rounded-lg px-4 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (хаяганд харагдах нэр)</label>
                <input value={rSlug} onChange={(e) => setRSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full border rounded-lg px-4 py-2" placeholder="my-restaurant" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Утас (заавал биш)</label>
                <input value={rPhone} onChange={(e) => setRPhone(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
              </div>
              <button type="submit" disabled={creating} className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium">
                {creating ? 'Үүсгэж байна...' : 'Ресторан үүсгэх'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    { label: 'Нийт хоол', value: stats.totalItems, icon: UtensilsCrossed, color: 'bg-blue-50 text-blue-600' },
    { label: 'Нийт ангилал', value: stats.totalCategories, icon: Grid3X3, color: 'bg-green-50 text-green-600' },
    { label: 'QR код', value: stats.totalQrCodes, icon: QrCode, color: 'bg-purple-50 text-purple-600' },
    { label: 'Өнөөдрийн хандалт', value: stats.todayScans, icon: Eye, color: 'bg-orange-50 text-orange-600' },
    { label: 'Нийт хандалт', value: stats.totalScans, icon: TrendingUp, color: 'bg-pink-50 text-pink-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Хянах самбар</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Түргэн холбоос</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Хоол нэмэх', href: '/menu' },
            { label: 'Ангилал нэмэх', href: '/categories' },
            { label: 'QR код үүсгэх', href: '/qr-codes' },
            { label: 'Тохиргоо', href: '/settings' },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-center p-4 rounded-lg border hover:bg-gray-50 transition font-medium text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
