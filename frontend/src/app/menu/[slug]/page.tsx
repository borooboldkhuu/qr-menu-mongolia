'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, Phone, Search, X, Clock, Star, Heart } from 'lucide-react';

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
    api.get(`/public/${slug}/menu`).then((res) => {
      setRestaurant(res.data.data.restaurant);
      setCategories(res.data.data.categories);
      setLoading(false);
    });
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    menuItems: cat.menuItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((cat) => cat.menuItems.length > 0);

  const featuredItems = categories.flatMap(c => c.menuItems).filter(i => i.isFeatured || i.imageUrl).slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center"><p className="text-lg font-semibold text-gray-700">Цэс олдсонгүй</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ========== HERO COVER ========== */}
      <div className="relative">
        {restaurant.coverUrl ? (
          <>
            <div className="h-64 sm:h-72 overflow-hidden">
              <img src={restaurant.coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/70" />
          </>
        ) : (
          <div className="h-64 sm:h-72 bg-gradient-to-br from-rose-400 via-pink-400 to-orange-300" />
        )}

        {/* Restaurant info on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-end gap-4">
            {restaurant.logoUrl && (
              <img src={restaurant.logoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-lg flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-lg">{restaurant.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-white/80">
                {restaurant.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{restaurant.address}</span>}
                {restaurant.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{restaurant.phone}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== STICKY BAR ========== */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
        <div className="px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Хоол хайх..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveCategory('')} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${!activeCategory ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              Бүгд
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========== FEATURED STRIP ========== */}
      {featuredItems.length > 0 && !search && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Онцлох</span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {featuredItems.map(item => (
              <div key={item.id} className="flex-shrink-0 w-36 cursor-pointer" onClick={() => item.imageUrl && setLightbox(item.imageUrl)}>
                <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-md">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl">🍽️</div>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-2 truncate">{item.name}</p>
                <p className="text-sm font-bold text-rose-500">{new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== MENU SECTIONS ========== */}
      <div className="px-4 pt-2 pb-20 space-y-10">
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-200" />
            </div>
            <p className="text-gray-400 text-sm">Хоол олдсонгүй</p>
          </div>
        )}

        {(activeCategory
          ? filteredCategories.filter(c => c.id === activeCategory)
          : filteredCategories
        ).map(category => (
          <section key={category.id}>
            {/* Category title */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 rounded-full bg-rose-400" />
              <h2 className="text-xl font-extrabold text-gray-900">{category.name}</h2>
              <span className="text-xs text-gray-300 font-medium">({category.menuItems.length})</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Items */}
            <div className="space-y-4">
              {category.menuItems.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Image */}
                  {item.imageUrl ? (
                    <div
                      className="w-[120px] h-[120px] rounded-2xl overflow-hidden flex-shrink-0 shadow-sm cursor-pointer relative"
                      onClick={() => setLightbox(item.imageUrl!)}
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] bg-black/50 px-3 py-1.5 rounded-full">Томруулах</span>
                      </div>
                      {item.isFeatured && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-gray-900 leading-snug">{item.name}</h3>
                      <span className="font-bold text-rose-500 whitespace-nowrap text-sm">
                        {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ========== LIGHTBOX ========== */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition" onClick={() => setLightbox(null)}>
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[85vh] rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-50">
        <p className="text-[11px] text-gray-300 tracking-wide">QR Menu Mongolia 2026</p>
      </div>
    </div>
  );
}
