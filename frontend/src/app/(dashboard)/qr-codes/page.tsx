'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Download, Trash2, Eye } from 'lucide-react';
import type { QrCode } from '@/types';

export default function QrCodesPage() {
  const [slug, setSlug] = useState('');
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/restaurants').then((res) => {
      if (res.data.data.length > 0) setSlug(res.data.data[0].slug);
    });
  }, []);

  useEffect(() => { if (slug) loadQrCodes(); }, [slug]);

  const loadQrCodes = () => {
    api.get(`/restaurants/${slug}/qr-codes`).then((res) => setQrCodes(res.data.data));
  };

  const handleCreate = async () => {
    setLoading(true);
    await api.post(`/restaurants/${slug}/qr-codes`);
    loadQrCodes();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/restaurants/${slug}/qr-codes/${id}`);
    loadQrCodes();
  };

  const handleDownloadPng = (id: string) => {
    window.open(`${api.defaults.baseURL}/restaurants/${slug}/qr-codes/${id}/png`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">QR кодууд</h2>
        <button onClick={handleCreate} disabled={loading} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
          <Plus className="w-4 h-4" /> QR код үүсгэх
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="bg-white p-4 rounded-xl border text-center">
            {qr.qrImageUrl && (
              <img src={qr.qrImageUrl} alt="QR" className="w-40 h-40 mx-auto mb-3" />
            )}
            <p className="text-sm text-gray-500 mb-1">{qr.slug}</p>
            <p className="text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
              <Eye className="w-3 h-3" /> {qr._count?.qrAnalytics || 0} уншуулалт
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => handleDownloadPng(qr.id)} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <Download className="w-3 h-3" /> PNG
              </button>
              <button onClick={() => handleDelete(qr.id)} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Устгах
              </button>
            </div>
          </div>
        ))}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>QR код хараахан үүсгээгүй байна</p>
        </div>
      )}
    </div>
  );
}
