'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Camera } from 'lucide-react';

export default function SettingsPage() {
  const [slug, setSlug] = useState('');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', facebookUrl: '', instagramUrl: '', theme: 'light', primaryColor: '#059669' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/restaurants').then((res) => {
      if (res.data.data.length > 0) {
        const r = res.data.data[0];
        setSlug(r.slug);
        localStorage.setItem('restaurantSlug', r.slug);
        setRestaurant(r);
        setForm({ name: r.name || '', address: r.address || '', phone: r.phone || '', facebookUrl: r.facebookUrl || '', instagramUrl: r.instagramUrl || '', theme: r.theme || 'light', primaryColor: r.primaryColor || '#059669' });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/restaurants/${slug}`, { name: form.name, address: form.address, phone: form.phone, facebookUrl: form.facebookUrl, instagramUrl: form.instagramUrl, theme: form.theme, primaryColor: form.primaryColor });
      alert('Амжилттай хадгалагдлаа! ✅');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Хадгалахад алдаа гарлаа. Та дахин оролдоно уу.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2000000) { alert('Зураг 2MB-с бага байх ёстой'); return; }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.patch(`/restaurants/${slug}/logo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const res = await api.get('/restaurants');
      setRestaurant(res.data.data[0]);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Зураг оруулж чадсангүй. Cloudinary тохируулаагүй байж болзошгүй.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Тохиргоо</h2>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-brand-600 animate-spin" />
          Ачаалж байна... (Render сервер сэрэх үед 30-60 сек)
        </div>
      )}

      {!loading && !restaurant && (
        <p className="text-gray-400">Ресторан олдсонгүй. Эхлээд ресторан үүсгэнэ үү.</p>
      )}

      {restaurant && (
        <div className="max-w-2xl space-y-6">
          {/* Logo / Cover */}
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold mb-4">Зураг</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                  {restaurant.logoUrl ? (
                    <img src={restaurant.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <label className="text-xs text-brand-600 cursor-pointer hover:underline">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  Лого солих
                </label>
              </div>
              <div>
                <label className="text-xs text-brand-600 cursor-pointer hover:underline">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('file', file);
                    try {
                      await api.patch(`/restaurants/${slug}/cover`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                      const res = await api.get('/restaurants');
                      setRestaurant(res.data.data[0]);
                    } catch (err: any) {
                      alert(err?.response?.data?.message || 'Зураг оруулж чадсангүй');
                    }
                  }} className="hidden" />
                  Ковер зураг солих
                </label>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold mb-4">Рестораны мэдээлэл</h3>

            <div>
              <label className="block text-sm font-medium mb-1">Нэр</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Хаяг</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Утас</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} className="w-full border rounded-lg px-4 py-2" placeholder="https://fb.com/..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} className="w-full border rounded-lg px-4 py-2" placeholder="https://instagram.com/..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input value={slug} disabled className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500" />
              <p className="text-xs text-gray-400 mt-1">Таны нийтийн цэсний хаяг: qrmenu.mn/menu/{slug}</p>
            </div>

            {/* ─── Theme ─── */}
            <div className="border-t pt-5">
              <h3 className="font-semibold mb-4">🎨 Дизайн тохиргоо</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { t:'light', l:'Цагаан', p:'#f8f9fa' },
                  { t:'dark', l:'Хар', p:'#0a0a0f' },
                  { t:'luxury', l:'Алтан', p:'#0c0a09' },
                  { t:'blue', l:'Цэнхэр', p:'#eff6ff' },
                  { t:'green', l:'Ногоон', p:'#f0fdf4' },
                  { t:'brown', l:'Кофе', p:'#faf7f2' },
                ].map(({t,l,p}) => (
                  <button key={t} type="button" onClick={() => setForm({...form, theme: t})}
                    className="p-3 rounded-xl border-2 text-center text-xs font-semibold transition-all"
                    style={{ background: p, borderColor: form.theme === t ? form.primaryColor || '#059669' : 'transparent', boxShadow: form.theme === t ? `0 0 0 2px ${form.primaryColor || '#059669'}40` : 'none' }}>
                    <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: form.theme === t && t === 'dark' ? '#fff' : t === 'luxury' ? '#d97706' : t === 'blue' ? '#2563eb' : t === 'green' ? '#16a34a' : t === 'brown' ? '#a16207' : '#059669' }} />
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Өргөлт өнгө:</label>
                <input type="color" value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value, theme: 'custom'})} className="w-10 h-10 rounded-lg border cursor-pointer" />
                <span className="text-xs text-gray-400">{form.primaryColor}</span>
              </div>
            </div>

            <button type="submit" disabled={saving} className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition">
              {saving ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
