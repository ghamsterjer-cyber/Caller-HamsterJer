
"use client"

import * as React from "react"
import { Copy, Check, Zap, Rocket, Globe, ShieldCheck, Server, Cloud, ExternalLink, Shield } from "lucide-react"
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
    toast({ title: "Скопировано", description: "Текст готов к использованию." });
    setTimeout(() => setCopied(null), 2000);
  };

  const isDeno = appUrl?.includes("deno.dev");
  const finalProxyUrl = appUrl ? (isDeno ? `${appUrl.replace(/\/$/, '')}/` : `${appUrl.replace(/\/$/, '')}/api/proxy/`) : "";

  const denoCode = `Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\\//, "");
  if (!path) return new Response("Proxigram Deno Engine Active", { status: 200 });

  const targetUrl = \`https://api.telegram.org/\${path}\${url.search}\`;

  const headers = new Headers(req.headers);
  headers.set("host", "api.telegram.org");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      // @ts-ignore
      duplex: "half",
    });
    return response;
  } catch (e) {
    return new Response("Proxy Error: " + e.message, { status: 500 });
  }
});`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" /> 
            Шаг 1: Настройка в Deno Deploy (Без карты)
          </h3>
          <a href="https://dash.deno.com/new" target="_blank" className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline">
            Открыть Deno Dash <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <Alert className="bg-emerald-50 border-emerald-200">
          <Server className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-800 font-bold uppercase text-[10px]">Как запустить во Франкфурте:</AlertTitle>
          <AlertDescription className="text-emerald-700 text-[10px] leading-tight space-y-2 mt-1">
            <p>1. Нажмите <b>"Playground"</b> (пустой проект).</p>
            <p>2. Удалите весь код в редакторе и вставьте код из черного блока ниже.</p>
            <p>3. Нажмите <b>Save & Deploy</b>.</p>
            <p>4. В настройках проекта (Settings) выберите регион <b>Frankfurt</b>.</p>
            <p>5. Скопируйте адрес (он заканчивается на <b>.deno.dev</b>).</p>
          </AlertDescription>
        </Alert>
      </div>

      <div className="relative">
        <div className="absolute top-2 left-4 text-[9px] font-bold text-muted-foreground uppercase">Код для Deno Playground:</div>
        <pre className="p-4 pt-8 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
          {denoCode}
        </pre>
        <button 
          className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white"
          onClick={() => copyToClipboard(denoCode, 'denocode')}
        >
          {copied === 'denocode' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-600">
          <Zap className="h-4 w-4" /> 
          Шаг 2: Ваша ссылка для бота
        </h3>
        
        <div className="relative group">
          <div className={`text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner transition-colors ${
            isDeno 
            ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200 ring-2 ring-emerald-100' 
            : 'bg-white text-muted-foreground border-primary/20'
          }`}>
            {finalProxyUrl || "Ожидание ссылки..."}
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
        
        <p className="text-[9px] text-muted-foreground italic">
          Эту ссылку вставьте в настройки вашего Telegram бота. Она поддерживает файлы до 100 МБ и работает на максимальной скорости через Франкфурт.
        </p>
      </div>
    </div>
  )
}
