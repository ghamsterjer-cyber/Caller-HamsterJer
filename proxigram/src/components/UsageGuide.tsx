
"use client"

import * as React from "react"
import { Code2, Copy, Check, AlertTriangle, Info, ExternalLink, Globe, Zap } from "lucide-center"
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
    toast({ title: "Скопировано", description: "Адрес прокси скопирован." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive font-bold">Ограничение тарифа Spark</AlertTitle>
        <AlertDescription className="text-xs">
          Firebase Hosting (Spark) не поддерживает серверные функции. Ваш прокси будет работать через <strong>Vercel</strong>.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Шаг 1: Деплой на Vercel
        </h3>
        <p className="text-xs text-muted-foreground">
          Вы уже связали GitHub! В Vercel выберите папку <code>proxigram</code> как корневую и нажмите Deploy. 
          Vercel автоматически создаст сервер для файла <code>api/proxy</code>.
        </p>
      </div>

      <div className="p-4 border rounded-xl bg-primary/5 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> Шаг 2: Ваш URL
        </h3>
        <p className="text-xs">
          После деплоя ваш адрес для запросов к боту будет выглядеть так:
        </p>
        <div className="relative">
          <div className="text-[10px] font-mono bg-white p-3 pr-10 border rounded break-all">
            https://ВАШ-ПРОЕКТ.vercel.app/proxigram/api/proxy/botTOKEN/getMe
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-1 right-1 h-7 w-7"
            onClick={() => copyToClipboard("https://ВАШ-ПРОЕКТ.vercel.app/proxigram/api/proxy/")}
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
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
