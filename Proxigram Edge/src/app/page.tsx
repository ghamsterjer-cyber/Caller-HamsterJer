"use client"

import React, { useEffect, useState } from 'react';
import { Rocket, ShieldCheck, Zap, Info, Copy, Check, Globe } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin + '/api/proxy/');
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Rocket className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Proxigram Edge Engine</h1>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Высокоскоростной прокси-сервер на базе Vercel Edge. 
            Бессрочно, бесплатно и максимально быстро.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
              <Zap className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase">Скорость</p>
                <p className="text-[10px] text-emerald-700 font-medium">Edge Optimized (Low Latency)</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-800 uppercase">Лимит файла</p>
                <p className="text-[10px] text-blue-700 font-medium">32 МБ (Максимум Vercel Edge)</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Globe className="h-3 w-3" /> Ваш постоянный Endpoint
            </label>
            <div className="relative group">
              <div className="p-4 bg-slate-900 text-indigo-300 font-mono text-[11px] rounded-xl break-all border border-slate-800 shadow-inner min-h-[50px] pr-12">
                {url || 'Генерация ссылки...'}
              </div>
              <button 
                onClick={copyToClipboard}
                className="absolute right-2 top-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic flex items-center gap-1">
              <Info className="h-3 w-3" /> Используйте этот URL вместо api.telegram.org в настройках вашего бота.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Лимиты и особенности:</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="text-[11px] text-slate-600 flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><b>До 32 МБ:</b> Файлы передаются моментально.</span>
              </div>
              <div className="text-[11px] text-slate-600 flex gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><b>От 32 до 50 МБ:</b> Может возникнуть ошибка лимита Vercel Edge.</span>
              </div>
              <div className="text-[11px] text-slate-600 flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><b>Бессрочно:</b> Не требует оплаты, карт или обновлений.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 text-center text-[9px] text-slate-400 uppercase tracking-widest border-t border-slate-100">
          Powered by Vercel Edge Runtime & Proxigram
        </div>
      </div>
    </div>
  );
}
