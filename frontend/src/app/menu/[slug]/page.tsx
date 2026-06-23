'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Search, X, Clock, MapPin, Phone, Heart, Share2, ChevronRight } from 'lucide-react';

// ─── category → icon mapping ───
const CAT_ICONS: Record<string, string> = {};

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/public/${slug}/menu`).then(res => {
      setRestaurant(res.data.data.restaurant);
      setCategories(res.data.data.categories);
      setLoading(false);
    });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  const filteredCategories = categories
    .map(cat => ({
      ...cat,
      menuItems: cat.menuItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter(cat => cat.menuItems.length > 0);

  const featuredItems = categories.flatMap(c => c.menuItems).filter(i => (i as any).isFeatured || i.imageUrl).slice(0, 3);

  const getCatIcon = (name: string): string => {
    const map: Record<string, string> = {
      'цай': '☕', 'кофе': '☕', 'уух': '🥤', 'ундаа': '🥤', 'унда': '🥤',
      'хоол': '🍽️', 'шөл': '🍜', 'салат': '🥗', 'зууш': '🍟',
      'амттан': '🍰', 'бялуу': '🧁', 'зайрмаг': '🍦',
      'өглөө': '🥐', 'өглөөний': '🥐', 'пицца': '🍕', 'бургер': '🍔',
      'мах': '🥩', 'шарсан': '🍗', 'далайн': '🦐',
      'архи': '🍷', 'коктейль': '🍸', 'шар айраг': '🍺',
    };
    const lower = name.toLowerCase();
    for (const [k, v] of Object.entries(map)) if (lower.includes(k)) return v;
    return '📋';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <p className="text-gray-400 text-sm">Цэс олдсонгүй</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans selection:bg-emerald-100">
      {/* ======== HERO BANNER ======== */}
      <section className="relative bg-white overflow-hidden">
        <div className="relative h-[280px] sm:h-[340px]">
          {restaurant.coverUrl ? (
            <>
              <img src={restaurant.coverUrl} alt="" className="w-full h-full object-cover scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600" />
          )}
          {/* Decorative blobs */}
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-white/5 blur-xl" />

          {/* Restaurant info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-4">
              {restaurant.logoUrl ? (
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-white/20 rounded-2xl blur" />
                  <img src={restaurant.logoUrl} alt="" className="relative w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-xl" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl border border-white/20">🍽️</div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">{restaurant.name}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-white/75">
                  {restaurant.address && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 opacity-70" />{restaurant.address}</span>}
                  {restaurant.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 opacity-70" />{restaurant.phone}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== GLASS CATEGORY NAV ======== */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-white'}`}>
        <div className="px-4 pt-4 pb-2">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Цэснээс хайх..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Category pills with icons */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('')}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                !activeCategory
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <span className="text-base">🔥</span> Бүгд
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm'
                    : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <span className="text-base">{getCatIcon(cat.name)}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======== FEATURED BANNER ======== */}
      {featuredItems.length > 0 && !search && !activeCategory && (
        <div className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Онцлох</span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {featuredItems.map((item, i) => (
              <div
                key={item.id}
                className={`flex-shrink-0 snap-start rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 ${i === 0 ? 'w-[85vw] max-w-[380px] h-44' : 'w-40 h-44'}`}
                onClick={() => item.imageUrl && setLightbox(item.imageUrl)}
              >
                {item.imageUrl ? (
                  <>
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-50" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm drop-shadow-md truncate">{item.name}</p>
                  <p className="text-white/90 font-semibold text-xs mt-0.5">
                    {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======== MENU CARD LIST ======== */}
      <div className="px-4 pt-1 pb-24 space-y-8">
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Хоол олдсонгүй</p>
            <p className="text-gray-300 text-xs mt-1">Өөр түлхүүр үгээр хайна уу</p>
          </div>
        )}

        {(activeCategory ? filteredCategories.filter(c => c.id === activeCategory) : filteredCategories).map(category => (
          <section key={category.id}>
            {/* Category header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCatIcon(category.name)}</span>
                <h2 className="text-lg font-extrabold text-gray-800">{category.name}</h2>
                <span className="text-xs font-medium text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">{category.menuItems.length}</span>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {category.menuItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-50 flex gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-gray-100 transition-all duration-300 group"
                >
                  {/* Image */}
                  {item.imageUrl ? (
                    <div
                      className="relative w-[110px] h-[110px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer shadow-sm"
                      onClick={() => setLightbox(item.imageUrl!)}
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                    </div>
                  ) : (
                    <div className="w-[110px] h-[110px] rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 flex-shrink-0 flex items-center justify-center text-3xl">
                      {getCatIcon(item.category?.name || '')}
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 text-[15px] leading-snug tracking-tight">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <span className="font-extrabold text-emerald-600 whitespace-nowrap text-sm tracking-tight mt-0.5">
                        {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                      </span>
                    </div>
                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Бэлэн
                      </span>
                      {(item as any).isPopular && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">🔥 Түгээмэл</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ======== FLOATING BOTTOM BAR ======== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
        <div className="max-w-sm mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border border-white/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="text-emerald-600 text-sm font-bold">{new Date().getFullYear()}</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-600">QR Цэс</p>
              <p className="text-[10px] text-gray-400">{restaurant.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition">
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ======== LIGHTBOX ======== */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition" onClick={() => setLightbox(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
