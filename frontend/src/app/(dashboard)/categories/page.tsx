'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Pencil, X, GripVertical } from 'lucide-react';
import type { Category } from '@/types';

const EMOJIS = ['☕','🍵','🥤','🍽️','🍕','🍔','🥩','🍜','🥗','🍰','🧁','🍦','🍷','🍸','🍺','🥐','🍟','🦐','🔥','⭐'];

export default function CategoriesPage() {
  const [slug, setSlug] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/restaurants').then(res => {
      if (res.data.data.length > 0) setSlug(res.data.data[0].slug);
    });
  }, []);

  useEffect(() => { if (slug) loadCategories(); }, [slug]);

  const loadCategories = () => {
    api.get(`/restaurants/${slug}/categories`).then(res => setCategories(res.data.data));
  };

  const resetForm = () => { setEditId(null); setName(''); setDescription(''); setIcon(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editId) {
        await api.patch(`/restaurants/${slug}/categories/${editId}`, { name, description, icon });
      } else {
        await api.post(`/restaurants/${slug}/categories`, { name, description, icon, sortOrder: categories.length });
      }
      resetForm(); loadCategories();
    } catch (err: any) { alert(err?.response?.data?.message || 'Алдаа'); }
    finally { setLoading(false); }
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id); setName(cat.name); setDescription(cat.description || ''); setIcon((cat as any).icon || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ангилал устгах уу?')) return;
    await api.delete(`/restaurants/${slug}/categories/${id}`);
    loadCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ангилал</h2>
        <button onClick={resetForm} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Ангилал нэмэх
        </button>
      </div>

      {(editId !== null || !categories.length) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editId ? 'Ангилал засах' : 'Шинэ ангилал'}</h3>
            <button type="button" onClick={resetForm}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="Ангилалын нэр" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="Тайлбар (заавал биш)" rows={2} />
          <div>
            <label className="block text-sm mb-1">Эможи</label>
            <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-2xl" placeholder="☕🍕🍰" maxLength={4} />
            <div className="flex gap-1 mt-2 flex-wrap">
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => setIcon(e)} className={`w-8 h-8 text-lg rounded-lg hover:bg-gray-100 ${icon === e ? 'bg-emerald-100 ring-1 ring-emerald-300' : ''}`}>{e}</button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-brand-600 text-white px-6 py-2 rounded-lg">
            {editId ? 'Хадгалах' : 'Нэмэх'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-gray-300" />
              {(cat as any).icon && <span className="text-xl">{(cat as any).icon}</span>}
              <div>
                <p className="font-medium">{cat.name}</p>
                {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{cat._count?.menuItems || 0} хоол</span>
              <button onClick={() => handleEdit(cat)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-center text-gray-400 py-8">Ангилал байхгүй</p>}
      </div>
    </div>
  );
}
