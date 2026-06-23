'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, ToggleLeft, ToggleRight, Camera, X, Star, Pencil } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { MenuItem, Category } from '@/types';

export default function MenuPage() {
  const [slug, setSlug] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCat, setFilterCat] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', categoryId: '', price: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    api.get('/restaurants').then(res => {
      if (res.data.data.length > 0) {
        setSlug(res.data.data[0].slug);
        api.get(`/restaurants/${res.data.data[0].slug}/categories`).then(r => setCategories(r.data.data));
      }
    });
  }, []);
  useEffect(() => { if (slug) loadItems(); }, [slug, filterCat]);

  const loadItems = () => {
    const params = filterCat ? `?categoryId=${filterCat}` : '';
    api.get(`/restaurants/${slug}/items${params}`).then(res => setItems(res.data.data));
  };

  const resetForm = () => { setEditId(null); setForm({ name: '', categoryId: '', price: '', description: '' }); setImageFile(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let itemId = editId;
      if (editId) {
        await api.patch(`/restaurants/${slug}/items/${editId}`, { ...form, price: parseFloat(form.price) || 0 });
      } else {
        const res = await api.post(`/restaurants/${slug}/items`, { ...form, price: parseFloat(form.price) || 0 });
        itemId = res.data.data.id;
      }
      if (imageFile && itemId) {
        setUploadingImage(true);
        const fd = new FormData(); fd.append('file', imageFile);
        await api.patch(`/restaurants/${slug}/items/${itemId}/image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setUploadingImage(false);
      }
      resetForm(); loadItems();
    } catch (err: any) { alert(err?.response?.data?.message || 'Алдаа'); }
    finally { setLoading(false); }
  };

  const handleEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({ name: item.name, categoryId: item.categoryId, price: String(item.price), description: item.description || '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Хоол устгах уу?')) return;
    await api.delete(`/restaurants/${slug}/items/${id}`);
    loadItems();
  };

  const handleToggle = async (id: string) => {
    await api.patch(`/restaurants/${slug}/items/${id}/toggle`);
    loadItems();
  };

  const handleFeature = async (id: string, featured: boolean) => {
    await api.patch(`/restaurants/${slug}/items/${id}`, { isFeatured: !featured });
    loadItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Цэс</h2>
        <button onClick={resetForm} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Хоол нэмэх
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilterCat('')} className={`px-3 py-1.5 rounded-full text-sm ${!filterCat ? 'bg-brand-600 text-white' : 'bg-white border'}`}>Бүгд</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={`px-3 py-1.5 rounded-full text-sm ${filterCat === cat.id ? 'bg-brand-600 text-white' : 'bg-white border'}`}>{cat.name}</button>
        ))}
      </div>

      {(editId !== null || !items.length) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{editId ? 'Хоол засах' : 'Шинэ хоол'}</h3>
            <button type="button" onClick={resetForm}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Нэр</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Үнэ</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Ангилал</label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full border rounded-lg px-4 py-2" required>
                <option value="">Сонгох...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Тайлбар</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Зураг</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
            </div>
          </div>
          <button type="submit" disabled={loading || uploadingImage} className="bg-brand-600 text-white px-6 py-2 rounded-lg">
            {uploadingImage ? 'Зураг...' : loading ? 'Хадгалж...' : editId ? 'Хадгалах' : 'Нэмэх'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-300" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="font-medium">{item.name}</p>
                {item.category && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{item.category.name}</span>}
              </div>
              {item.description && <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>}
            </div>
            <p className="font-bold text-brand-600">{formatPrice(Number(item.price))}</p>
            <button onClick={() => handleToggle(item.id)}>{item.isAvailable ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}</button>
            <button onClick={() => handleFeature(item.id, (item as any).isFeatured)}>
              <Star className={`w-5 h-5 ${(item as any).isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`} />
            </button>
            <button onClick={() => handleEdit(item)}><Pencil className="w-4 h-4 text-gray-400 hover:text-brand-600" /></button>
            <button onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-8">Хоол байхгүй</p>}
      </div>
    </div>
  );
}
