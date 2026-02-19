
"use client"

import * as React from "react"
import { Code2, Copy, Check, AlertTriangle, Info, ExternalLink, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface UsageGuideProps {
  appUrl?: string;
}

export function UsageGuide({ appUrl }: UsageGuideProps) {
  const [copied, setCopied] = React.useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Скопировано", description: "Код для Vercel прокси скопирован." });
    setTimeout(() => setCopied(false), 2000);
  };

  const vercelProxyCode = `// 1. Создайте в Vercel новый проект из вашего GitHub
// 2. В папке /proxigram/src/app/api/proxy/route.ts уже лежит этот код.
// 3. Vercel сам запустит его как Serverless Function.

// Если вы хотите создать отдельный мини-прокси, используйте этот JS:
export default async function handler(req, res) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path;
  const searchParams = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
  const telegramUrl = \`https://api.telegram.org/\${pathString}\${searchParams}\`;

  try {
    const response = await fetch(telegramUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : null,
    });

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}`;

  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive font-bold">Ограничение тарифа Spark</AlertTitle>
        <AlertDescription className="text-xs">
          На бесплатном тарифе Firebase нельзя запускать серверный код. Мы используем <strong>Vercel</strong> (он работает в РФ и бесплатен) для связи с Telegram API.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Шаг 1: Деплой на Vercel
        </h3>
        <p className="text-xs text-muted-foreground">
          Вы уже связали GitHub! Теперь просто импортируйте репозиторий в Vercel, выберите папку <code>proxigram</code> как корневую и нажмите Deploy.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" /> Шаг 2: Код прокси
        </h3>
        <p className="text-xs text-muted-foreground">
          Если вы создаете прокси отдельно, используйте этот код в файле <code>api/proxy.js</code>:
        </p>
        <div className="relative group">
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 text-[10px] font-mono overflow-x-auto leading-relaxed">
            {vercelProxyCode}
          </pre>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 text-white hover:bg-white/10"
            onClick={() => copyToClipboard(vercelProxyCode)}
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-primary/5 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> Шаг 3: Ваш URL
        </h3>
        <p className="text-xs">
          После деплоя ваш адрес для запросов будет:
        </p>
        <div className="text-[10px] font-mono bg-white p-2 border rounded break-all">
          https://ВАШ-ПРОЕКТ.vercel.app/api/proxy?path=botTOKEN/getMe
        </div>
      </div>

      <a 
        href="https://vercel.com/new" 
        target="_blank" 
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-black text-white text-sm hover:bg-zinc-800 transition-colors"
      >
        Открыть Vercel Dashboard <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}
