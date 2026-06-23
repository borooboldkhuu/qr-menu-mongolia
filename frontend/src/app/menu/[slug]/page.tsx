'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, Phone, Search, Sparkles, Clock, ArrowUpRight } from 'lucide-react';

interface IRestaurant {
  id: string; name: string; slug: string;
  logoUrl?: string; coverUrl?: string;
  address?: string; phone?: string;
  facebookUrl?: string; instagramUrl?: string;
}
interface IMenuItem {
  id: string; name: string; description?: string;
  price: number; imageUrl?: string; isAvailable: boolean;
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

  const featuredItems = categories.flatMap(c => c.menuItems).filter(i => i.imageUrl).slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-[#0a0a0f]" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">Цэс олдсонгүй</p>
          <p className="text-white/40 text-sm">QR кодыг дахин уншуулна уу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* HERO — 2026 glass + gradient */}
      <div className="relative overflow-hidden">
        {/* Animated gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-[#0a0a0f] to-cyan-900/40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Cover image overlay */}
        {restaurant.coverUrl && (
          <div className="relative h-64 sm:h-80 opacity-40">
            <img src={restaurant.coverUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/60 to-[#0a0a0f]" />
          </div>
        )}

        {/* Restaurant info - floating glass card */}
        <div className={`relative ${restaurant.coverUrl ? '-mt-20' : 'pt-12'} px-4 pb-8 max-w-3xl mx-auto`}>
          {/* Glass card */}
          <div className="bg-white/[0.06] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
            <div className="flex items-center gap-5">
              {restaurant.logoUrl ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-violet-500 to-cyan-400 rounded-2xl blur opacity-50" />
                  <img src={restaurant.logoUrl} alt={restaurant.name} className="relative w-18 h-18 rounded-2xl object-cover shadow-xl" style={{width:72,height:72}} />
                </div>
              ) : (
                <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 flex items-center justify-center text-2xl border border-white/[0.06]">
                  🍽️
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{restaurant.name}</h1>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/50">
                  {restaurant.address && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-violet-400" />{restaurant.address}</span>}
                  {restaurant.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-cyan-400" />{restaurant.phone}</span>}
                </div>
                <div className="flex gap-3 mt-3">
                  {restaurant.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" className="text-white/30 hover:text-violet-400 transition"><ArrowUpRight className="w-4 h-4" /></a>}
                  {restaurant.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" className="text-white/30 hover:text-cyan-400 transition"><ArrowUpRight className="w-4 h-4" /></a>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED — Bento Grid 2026 */}
      {featuredItems.length > 0 && !search && (
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Онцлох</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredItems.map((item, i) => (
              <div key={item.id} className={`group relative overflow-hidden rounded-3xl bg-white/[0.04] border border-white/[0.06] ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                {item.imageUrl && (
                  <div className={i === 0 ? 'h-48' : 'h-32'}>
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent" />
                  </div>
                )}
                <div className={`absolute bottom-0 left-0 right-0 p-4 ${!item.imageUrl ? 'static p-4' : ''}`}>
                  <h3 className="font-bold text-white/90 text-sm">{item.name}</h3>
                  <p className="text-base font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mt-1">
                    {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH + CATEGORIES — Glass sticky bar */}
      <div className="sticky top-0 z-20 px-4 py-3 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          {/* Glass search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Хоол хайх..."
              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] backdrop-blur border border-white/[0.08] rounded-2xl text-sm text-white placeholder-white/20 focus:ring-2 focus:ring-violet-500/50 focus:border-transparent outline-none transition"
            />
          </div>
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setActiveCategory('')} className={`px-5 py-2.5 rounded-2xl text-sm whitespace-nowrap font-medium transition-all ${!activeCategory ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70'}`}>
              Бүгд
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-2xl text-sm whitespace-nowrap font-medium transition-all ${activeCategory === cat.id ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MENU ITEMS — Glass cards 2026 */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-white/30 text-sm">Хоол олдсонгүй</p>
          </div>
        )}

        {(activeCategory ? filteredCategories.filter(c => c.id === activeCategory) : filteredCategories).map((category) => (
          <section key={category.id}>
            {/* Category header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="h-10 w-1 rounded-full bg-gradient-to-b from-violet-500 to-cyan-400" />
              <h2 className="text-xl font-bold text-white/90">{category.name}</h2>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/20 font-mono">{category.menuItems.length}</span>
            </div>

            <div className="space-y-3">
              {category.menuItems.map((item) => (
                <div key={item.id} className="group bg-white/[0.03] backdrop-blur border border-white/[0.06] rounded-2xl p-3 flex gap-4 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                  {/* Image */}
                  {item.imageUrl ? (
                    <div className="relative w-[104px] h-[104px] rounded-2xl overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-400/10 z-10" />
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-[104px] h-[104px] rounded-2xl bg-gradient-to-br from-violet-500/[0.08] to-cyan-400/[0.08] flex-shrink-0 flex items-center justify-center text-3xl border border-white/[0.04]">
                      <span className="opacity-30">{item.category?.name === 'Уух зүйл' ? '🥤' : '🍽️'}</span>
                    </div>
                  )}
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-semibold text-white/85 text-[15px] leading-tight">{item.name}</h3>
                      <span className="font-bold text-base whitespace-nowrap bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-white/35 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Floating bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] rounded-full px-5 py-2.5 text-xs text-white/30 flex items-center gap-2 shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 animate-pulse" />
          QR Menu Mongolia ⚡ {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
