'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Search, X, MapPin, Phone } from 'lucide-react';
import { THEMES, buildCustomTheme, type ThemeName, type ThemePreset } from '@/lib/themes';

interface IRestaurant {
  id: string; name: string; slug: string;
  logoUrl?: string; coverUrl?: string;
  address?: string; phone?: string;
  theme?: string; primaryColor?: string;
}
interface IMenuItem {
  id: string; name: string; description?: string;
  price: number; imageUrl?: string; isAvailable: boolean;
  isFeatured?: boolean; category?: { id: string; name: string };
}
interface ICategory { id: string; name: string; menuItems: IMenuItem[]; icon?: string; }

export default function PublicMenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<IMenuItem | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/public/${slug}/menu`).then(res => {
      setRestaurant(res.data.data.restaurant);
      setCategories(res.data.data.categories);
      setLoading(false);
    });
    const s = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, [slug]);

  // Theme
  const theme = useMemo<ThemePreset>(() => {
    if (!restaurant) return THEMES.light;
    const name = (restaurant.theme || 'light') as ThemeName;
    if (name === 'custom') return buildCustomTheme(restaurant.primaryColor || '#059669');
    const preset = THEMES[name];
    if (restaurant.primaryColor && restaurant.primaryColor !== preset.accent) {
      return { ...preset, accent: restaurant.primaryColor, accentHover: restaurant.primaryColor };
    }
    return preset;
  }, [restaurant]);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    menuItems: cat.menuItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter(cat => cat.menuItems.length > 0);

  const featuredItems = categories.flatMap(c => c.menuItems).filter(i => (i as any).isFeatured || i.imageUrl).slice(0, 5);

  const getCatIcon = (name: string): string => {
    const map: Record<string, string> = { 'цай':'☕','кофе':'☕','уух':'🥤','ундаа':'🥤','унда':'🥤','хоол':'🍽️','шөл':'🍜','салат':'🥗','зууш':'🍟','амттан':'🍰','бялуу':'🧁','зайрмаг':'🍦','өглөө':'🥐','өглөөний':'🥐','пицца':'🍕','бургер':'🍔','мах':'🥩','шарсан':'🍗','далайн':'🦐','архи':'🍷','коктейль':'🍸','шар айраг':'🍺' };
    const lower = name.toLowerCase();
    for (const [k,v] of Object.entries(map)) if (lower.includes(k)) return v;
    return '📋';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: theme.bg }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: theme.accent, borderTopColor: 'transparent' }} />
    </div>
  );
  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <p className="text-sm" style={{ color: theme.textSecondary }}>Цэс олдсонгүй</p>
    </div>
  );

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* HERO */}
      <section>
        <div className="relative h-44 sm:h-52 overflow-hidden rounded-b-[2rem]">
          {restaurant.coverUrl ? (
            <>
              <img src={restaurant.coverUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30" />
            </>
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent}44)` }} />
          )}
        </div>
        <div className="relative -mt-16 px-6 pb-4 text-center">
          <div className="inline-flex items-center justify-center">
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-[150px] h-[150px] rounded-2xl object-cover border-[3px] shadow-xl" style={{ borderColor: theme.surface }} />
            ) : (
              <div className="w-[150px] h-[150px] rounded-2xl border-[3px] shadow-xl flex items-center justify-center text-4xl" style={{ background: `linear-gradient(135deg, ${theme.accent}44, ${theme.accent}66)`, borderColor: theme.surface }}>
                🍽️
              </div>
            )}
          </div>
          <h1 className="text-xl font-extrabold mt-3 tracking-tight" style={{ color: theme.text }}>{restaurant.name}</h1>
          <div className="flex justify-center gap-4 mt-2 text-xs" style={{ color: theme.textSecondary }}>
            {restaurant.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.address}</span>}
            {restaurant.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{restaurant.phone}</span>}
          </div>
        </div>
      </section>

      {/* STICKY BAR */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`} style={{ background: scrolled ? theme.surface + 'f2' : theme.bg, backdropFilter: scrolled ? 'blur(16px)' : 'none' }}>
        <div className="px-4 pt-4 pb-2">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.textSecondary }} />
            <input
              type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Цэснээс хайх..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all border"
              style={{ background: theme.surface, color: theme.text, borderColor: theme.border }}
            />
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveCategory('')} className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${!activeCategory ? 'shadow-sm' : 'border'}`}
              style={!activeCategory ? { background: theme.accent, color: '#fff' } : { background: theme.surface, color: theme.textSecondary, borderColor: theme.border }}>
              🔥 Бүгд
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${activeCategory === cat.id ? 'shadow-sm' : 'border'}`}
                style={activeCategory === cat.id ? { background: theme.accent, color: '#fff' } : { background: theme.surface, color: theme.textSecondary, borderColor: theme.border }}>
                <span className="text-base">{cat.icon || getCatIcon(cat.name)}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED */}
      {featuredItems.length > 0 && !search && !activeCategory && (
        <div className="px-4 pt-2 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-5 rounded-full" style={{ background: theme.accent }} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: theme.textSecondary }}>Онцлох</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {featuredItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 snap-start w-[85vw] max-w-[400px] h-52 rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => setLightbox(item)}>
                {item.imageUrl ? (
                  <>
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ transform: 'translateY(-5%) scale(1.05)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.accent}11, ${theme.accent}22)` }}>
                    <span className="text-4xl">{getCatIcon(item.category?.name || '')}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm truncate">{item.name}</p>
                  <p className="text-white/90 font-semibold text-xs mt-0.5">{new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MENU */}
      <div className="px-4 pt-1 pb-24 space-y-8">
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
            <p style={{ color: theme.textSecondary }}>Хоол олдсонгүй</p>
          </div>
        )}
        {(activeCategory ? filteredCategories.filter(c => c.id === activeCategory) : filteredCategories).map(category => (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon || getCatIcon(category.name)}</span>
                <h2 className="text-lg font-extrabold" style={{ color: theme.text }}>{category.name}</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: theme.border, color: theme.textSecondary }}>{category.menuItems.length}</span>
              </div>
            </div>
            <div className="space-y-3">
              {category.menuItems.map(item => (
                <div key={item.id} className="rounded-2xl p-3 flex gap-4 border transition-all duration-300 group"
                  style={{ background: theme.surface, borderColor: theme.border, boxShadow: `0 2px 12px rgba(0,0,0,0.03)` }}>
                  {item.imageUrl ? (
                    <div className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setLightbox(item)}>
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-[140px] h-[140px] rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl"
                      style={{ background: `linear-gradient(135deg, ${theme.accent}11, ${theme.accent}22)` }}>
                      {category.icon || getCatIcon(item.category?.name || '')}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[15px] leading-snug" style={{ color: theme.text }}>{item.name}</h3>
                        {item.description && <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: theme.textSecondary }}>{item.description}</p>}
                      </div>
                      <span className="font-extrabold whitespace-nowrap text-sm mt-0.5" style={{ color: theme.accent }}>
                        {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition" onClick={() => setLightbox(null)}><X className="w-6 h-6" /></button>
          <div className="max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {lightbox.imageUrl && (
              <img src={lightbox.imageUrl} alt={lightbox.name} className="w-full h-64 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="text-xl font-extrabold text-gray-900">{lightbox.name}</h3>
                <span className="text-xl font-extrabold text-emerald-600 whitespace-nowrap">{new Intl.NumberFormat('mn-MN').format(Number(lightbox.price))}₮</span>
              </div>
              {lightbox.description && (
                <p className="text-sm text-gray-500 leading-relaxed">{lightbox.description}</p>
              )}
              {lightbox.category && (
                <span className="inline-block mt-4 text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{lightbox.category.name}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
