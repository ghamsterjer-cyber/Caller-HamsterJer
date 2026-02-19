
"use client"

import * as React from "react"
import { Copy, Check, Zap, Rocket, Globe, ShieldCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UsageGuideProps {
  appUrl?: string;
}

export function UsageGuide({ appUrl }: UsageGuideProps) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: "Скопировано", description: "Код готов для Render.com" });
    setTimeout(() => setCopied(null), 2000);
  };

  const isRender = appUrl?.includes("onrender.com");
  const finalProxyUrl = appUrl ? (isRender ? `${appUrl.replace(/\/$/, '')}/` : `${appUrl.replace(/\/$/, '')}/api/proxy/`) : "";

  const serverJsCode = `const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Потоковый прокси для тяжелых файлов (видео/аудио)
app.use('/', createProxyMiddleware({
    target: 'https://api.telegram.org',
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\\//, ''),
    buffer: false, // Отключаем буферизацию для скорости
    onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log('High-Speed Engine Active on port ' + port);
});`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Globe className="h-4 w-4 text-indigo-600" /> 
          Шаг 1: Создание сервера во Франкфурте (Render)
        </h3>

        <Alert className="bg-indigo-50 border-indigo-200">
          <Rocket className="h-4 w-4 text-indigo-600" />
          <AlertTitle className="text-indigo-800 font-bold uppercase text-[10px]">Инструкция для макс. скорости:</AlertTitle>
          <AlertDescription className="text-indigo-700 text-[10px] leading-tight space-y-2 mt-1">
            <p>1. Зайдите на <b>dashboard.render.com</b> и нажмите <b>New +</b> -> <b>Web Service</b>.</p>
            <p>2. Подключите ваш GitHub репозиторий <b>Caller-HamsterJer</b>.</p>
            <p>3. <b>КРИТИЧНО:</b> В поле Region выберите <b>Frankfurt (EU Central)</b>. Это даст скорость как у Vercel.</p>
            <p>4. В поле <b>Start Command</b> впишите: <code className="bg-indigo-100 px-1 rounded">node proxigram/server.js</code></p>
          </AlertDescription>
        </Alert>

        <div className="relative">
          <div className="absolute top-2 left-4 text-[9px] font-bold text-muted-foreground uppercase">Код для server.js (в папке proxigram):</div>
          <pre className="p-4 pt-8 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
            {serverJsCode}
          </pre>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-white"
            onClick={() => copyToClipboard(serverJsCode, 'serverjs')}
          >
            {copied === 'serverjs' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-600">
          <ShieldCheck className="h-4 w-4" /> 
          Ваш новый Endpoint
        </h3>
        
        <div className="relative group">
          <div className={`text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner transition-colors ${
            isRender 
            ? 'bg-indigo-50/80 text-indigo-700 border-indigo-200 ring-2 ring-indigo-100' 
            : 'bg-white text-muted-foreground border-primary/20'
          }`}>
            {finalProxyUrl || "Ожидание настройки Render..."}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 hover:bg-white shadow-sm border"
            disabled={!finalProxyUrl}
            onClick={() => copyToClipboard(finalProxyUrl, 'current')}
          >
            {copied === 'current' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <Alert variant="destructive" className="py-2 border-none bg-amber-50 text-amber-800">
          <AlertTriangle className="h-3 w-3 text-amber-600" />
          <AlertDescription className="text-[9px]">
            Используйте только <b>Frankfurt</b> на Render. Другие регионы (США/Сингапур) будут тормозить из-за блокировок в РФ.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
