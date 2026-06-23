'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, Phone, Search, X, ChevronRight } from 'lucide-react';

interface IRestaurant {
  id: string; name: string; slug: string;
  logoUrl?: string; coverUrl?: string;
  address?: string; phone?: string;
  facebookUrl?: string; instagramUrl?: string;
}
interface IMenuItem {
  id: string; name: string; description?: string;
  price: number; imageUrl?: string; isAvailable: boolean;
  isFeatured?: boolean;
  category?: { id: string; name: string };
}
interface ICategory { id: string; name: string; menuItems: IMenuItem[]; }

export default function PublicMenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/public/${slug}/menu`).then((res) => {
      setRestaurant(res.data.data.restaurant);
      setCategories(res.data.data.categories);
      setLoading(false);
    });
  }, [slug]);

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    menuItems: cat.menuItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((cat) => cat.menuItems.length > 0);

  const featuredItems = categories.flatMap(c => c.menuItems).filter(i => i.imageUrl).slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">Цэс олдсонгүй</p>
          <p className="text-gray-400 text-sm">QR кодыг дахин уншуулна уу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO ===== */}
      <div className="relative bg-white">
        {/* Cover image */}
        {restaurant.coverUrl ? (
          <div className="relative h-52 sm:h-64 overflow-hidden">
            <img src={restaurant.coverUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          </div>
        ) : (
          <div className="h-4" />
        )}

        {/* Restaurant card */}
        <div className={`relative ${restaurant.coverUrl ? '-mt-14' : 'mt-4'} max-w-xl mx-auto px-4 pb-4`}>
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-5 flex items-center gap-4">
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-2xl">🍽️</div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-extrabold text-gray-900 truncate">{restaurant.name}</h1>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                {restaurant.address && <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.address}</span>}
                {restaurant.phone && <span className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{restaurant.phone}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURED ===== */}
      {featuredItems.length > 0 && !search && !activeCategory && (
        <div className="max-w-xl mx-auto px-4 pb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">Онцлох</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {featuredItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-40 snap-start group cursor-pointer" onClick={() => item.imageUrl && setLightbox(item.imageUrl)}>
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-md">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs font-bold text-white/80">{new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== STICKY: Search + Categories ===== */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Хоол хайх..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-violet-400 focus:bg-white outline-none transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setActiveCategory('')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-semibold transition-all ${!activeCategory ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              Бүгд
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-semibold transition-all ${activeCategory === cat.id ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MENU ITEMS ===== */}
      <div className="max-w-xl mx-auto px-4 py-5 space-y-8">
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 text-gray-300">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Хоол олдсонгүй</p>
          </div>
        )}

        {(activeCategory ? filteredCategories.filter(c => c.id === activeCategory) : filteredCategories).map((category) => (
          <section key={category.id}>
            <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-3">
              {category.name}
              <span className="text-xs font-normal text-gray-300">({category.menuItems.length})</span>
            </h2>
            <div className="space-y-4">
              {category.menuItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Big image */}
                  {item.imageUrl ? (
                    <div
                      className="w-[130px] h-[130px] rounded-2xl overflow-hidden flex-shrink-0 shadow-sm cursor-pointer relative"
                      onClick={() => setLightbox(item.imageUrl!)}
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs bg-black/40 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Томруулах</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-[130px] h-[130px] rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                  )}
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{item.name}</h3>
                    <p className="text-xs font-semibold text-violet-600 mt-1">
                      {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition" onClick={() => setLightbox(null)}>
            <X className="w-5 h-5" />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-200">QR Menu Mongolia ⚡</p>
      </div>
    </div>
  );
}
