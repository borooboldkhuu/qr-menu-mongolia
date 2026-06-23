'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UtensilsCrossed, Grid3X3, QrCode, Eye, TrendingUp, Pencil, Trash2, Plus, X } from 'lucide-react';

interface DashboardStats {
  totalItems: number; totalCategories: number; totalScans: number;
  todayScans: number; totalQrCodes: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [slug, setSlug] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [rName, setRName] = useState('');
  const [rSlug, setRSlug] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rAddress, setRAddress] = useState('');
  const [creating, setCreating] = useState(false);

  const loadRestaurants = () => {
    api.get('/restaurants').then(res => {
      const list = res.data.data;
      setRestaurants(list);
      if (list.length > 0) setSlug(list[0].slug);
    });
  };

  useEffect(() => { loadRestaurants(); }, []);

  useEffect(() => {
    if (slug) api.get(`/restaurants/${slug}/analytics`).then(r => setStats(r.data.data));
  }, [slug]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true);
    try {
      await api.post('/restaurants', { name: rName, slug: rSlug, phone: rPhone, address: rAddress });
      await api.post(`/restaurants/${rSlug}/subscription`);
      resetForm(); loadRestaurants(); setSlug(rSlug);
    } catch (err: any) { alert(err?.response?.data?.message || 'Алдаа'); }
    finally { setCreating(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true);
    try {
      const s = restaurants.find(r => r.id === editId)?.slug;
      await api.patch(`/restaurants/${s}`, { name: rName, phone: rPhone, address: rAddress });
      resetForm(); loadRestaurants();
    } catch (err: any) { alert(err?.response?.data?.message || 'Алдаа'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (s: string) => {
    if (!confirm('Устгах уу? Бүх цэс, ангилал устах болно.')) return;
    await api.delete(`/restaurants/${s}`);
    loadRestaurants();
  };

  const startEdit = (r: any) => {
    setEditId(r.id); setShowForm(true);
    setRName(r.name); setRSlug(r.slug); setRPhone(r.phone || ''); setRAddress(r.address || '');
  };

  const resetForm = () => {
    setShowForm(false); setEditId(null);
    setRName(''); setRSlug(''); setRPhone(''); setRAddress('');
  };

  if (restaurants.length === 0 && !showForm) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 max-w-md">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-semibold">Ресторан үүсгэх</h2>
          <p className="text-gray-500">Эхлээд ресторанаа бүртгүүлнэ үү</p>
          <button onClick={() => setShowForm(true)} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium">
            Ресторан үүсгэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Хянах самбар</h2>
        <div className="flex gap-2">
          {!showForm && (
            <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700">
              <Plus className="w-4 h-4" /> Ресторан
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Нийт хоол', value: stats.totalItems, icon: UtensilsCrossed, c: 'bg-blue-50 text-blue-600' },
            { label: 'Нийт ангилал', value: stats.totalCategories, icon: Grid3X3, c: 'bg-green-50 text-green-600' },
            { label: 'QR код', value: stats.totalQrCodes, icon: QrCode, c: 'bg-purple-50 text-purple-600' },
            { label: 'Өнөөдөр', value: stats.todayScans, icon: Eye, c: 'bg-orange-50 text-orange-600' },
            { label: 'Нийт хандалт', value: stats.totalScans, icon: TrendingUp, c: 'bg-pink-50 text-pink-600' },
          ].map((card, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border">
              <div className={`w-10 h-10 rounded-lg ${card.c} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* RESTAURANT LIST */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="font-semibold mb-4">Миний ресторанууд</h3>
        <div className="space-y-2">
          {restaurants.map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-gray-400">{r.slug} · {r.subscriptionTier} · {r.address || '—'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(r)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-600"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(r.slug)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4" onClick={resetForm}>
          <form onSubmit={editId ? handleEdit : handleCreate} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{editId ? 'Ресторан засах' : 'Шинэ ресторан'}</h3>
              <button type="button" onClick={resetForm}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div>
              <label className="block text-sm mb-1">Нэр</label>
              <input value={rName} onChange={e => setRName(e.target.value)} className="w-full border rounded-lg px-4 py-2" required />
            </div>
            {!editId && (
              <div>
                <label className="block text-sm mb-1">Slug</label>
                <input value={rSlug} onChange={e => setRSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full border rounded-lg px-4 py-2" placeholder="my-cafe" required />
              </div>
            )}
            <div>
              <label className="block text-sm mb-1">Утас</label>
              <input value={rPhone} onChange={e => setRPhone(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Хаяг</label>
              <input value={rAddress} onChange={e => setRAddress(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="Улаанбаатар, ..." />
            </div>
            <button type="submit" disabled={creating} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium">
              {creating ? 'Хадгалж байна...' : editId ? 'Хадгалах' : 'Ресторан үүсгэх'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
