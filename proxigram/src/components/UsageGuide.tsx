
"use client"

import * as React from "react"
import { Copy, Check, ExternalLink, Zap, AlertCircle, CheckCircle2, Cloud } from "lucide-react"
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

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
    toast({ title: "Скопировано", description: "Текст готов к использованию." });
    setTimeout(() => setCopied(null), 2000);
  };

  const isHighLoad = appUrl?.includes("workers.dev") || appUrl?.includes("railway.app");
  
  // Если настроен воркер, используем его адрес напрямую как базу
  const finalProxyUrl = appUrl ? (isHighLoad ? `${appUrl.replace(/\/$/, '')}/` : `${appUrl.replace(/\/$/, '')}/api/proxy/`) : "";
  
  const cfWorkerCode = `export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Удаляем первый слеш из пути, чтобы получить путь для Telegram API
    const path = url.pathname.replace(/^\\//, "");
    if (!path) return new Response("Proxigram Proxy Active", { status: 200 });
    
    const targetUrl = \`https://api.telegram.org/\${path}\${url.search}\`;

    // Копируем заголовки и выставляем Host
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "api.telegram.org");

    return fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: "follow",
    });
  }
};`;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Cloud className="h-4 w-4 text-emerald-500" /> 
          Бесплатный Прокси 100MB (Cloudflare)
        </h3>
        
        <Alert className="bg-emerald-50 border-emerald-200">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-800 text-xs font-bold uppercase">Как настроить (по вашему скриншоту):</AlertTitle>
          <AlertDescription className="text-emerald-700 text-[10px] leading-tight mt-1 space-y-2">
            <p>1. В Cloudflare выберите <b>"Start with Hello World!"</b>.</p>
            <p>2. Нажмите синюю кнопку <b>Deploy</b> внизу экрана.</p>
            <p>3. Нажмите появившуюся кнопку <b>Edit Code</b>.</p>
            <p>4. Удалите весь текст в редакторе и вставьте код из черного блока ниже.</p>
            <p>5. Нажмите <b>Save and Deploy</b> и скопируйте адрес (он заканчивается на .workers.dev).</p>
          </AlertDescription>
        </Alert>
      </div>

      <div className="relative">
        <div className="absolute top-2 left-4 text-[9px] font-bold text-muted-foreground uppercase">Код для Cloudflare (вставить в Edit Code):</div>
        <pre className="p-4 pt-8 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
          {cfWorkerCode}
        </pre>
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-white"
          onClick={() => copyToClipboard(cfWorkerCode, 'cfcode')}
        >
          {copied === 'cfcode' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className={`h-4 w-4 ${isHighLoad ? 'text-emerald-500' : 'text-primary'}`} /> 
          Ваш Endpoint для бота
        </h3>
        
        <div className="relative group">
          <div className={`text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner transition-colors ${
            isHighLoad 
            ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200 ring-2 ring-emerald-100' 
            : 'bg-white text-muted-foreground border-primary/20'
          }`}>
            {finalProxyUrl || "Ожидание настройки..."}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 hover:bg-white shadow-sm border"
            disabled={!finalProxyUrl}
            onClick={() => copyToClipboard(finalProxyUrl, 'current')}
          >
            {copied === 'current' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground italic">
          Эту ссылку вставьте в настройки вашего Telegram бота. Она пропустит файлы до 100 МБ.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="help" className="border-none bg-muted/30 px-4 rounded-xl">
          <AccordionTrigger className="text-muted-foreground hover:no-underline py-3 text-xs">
            Зачем это нужно?
          </AccordionTrigger>
          <AccordionContent className="text-[10px] text-muted-foreground space-y-2 pb-4 leading-relaxed">
            <p>Cloudflare Workers — это самый надежный способ передавать большие файлы (до 100МБ) абсолютно бесплатно. У Vercel лимит 4.5МБ, что не позволяет передавать видео или тяжелые треки. Воркеры решают эту проблему.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
