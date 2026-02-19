"use client"

import * as React from "react"
import { Copy, Check, Info, ExternalLink, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

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
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Setup Vercel Proxy
        </h3>
        <p className="text-xs text-muted-foreground">
          Ваш прокси-сервер будет работать на Vercel. Убедитесь, что папка <code>proxigram</code> выбрана как Root в настройках проекта Vercel.
        </p>
      </div>

      <div className="p-4 border rounded-xl bg-primary/5 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> Proxy URL
        </h3>
        <p className="text-xs">
          Ваш адрес для запросов к Telegram API будет выглядеть так:
        </p>
        <div className="relative">
          <div className="text-[10px] font-mono bg-white p-3 pr-10 border rounded break-all">
            https://caller-hamster-jer.vercel.app/proxigram/api/proxy/botTOKEN/getMe
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-1 right-1 h-7 w-7"
            onClick={() => copyToClipboard("https://caller-hamster-jer.vercel.app/proxigram/api/proxy/")}
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      <a 
        href="https://vercel.com/dashboard" 
        target="_blank" 
        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-black text-white text-sm hover:bg-zinc-800 transition-colors"
      >
        Vercel Dashboard <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}
