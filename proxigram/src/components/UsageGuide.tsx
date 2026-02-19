
"use client"

import * as React from "react"
import { Copy, Check, Zap, Rocket, Globe, ShieldCheck, AlertTriangle, Terminal, Server } from "lucide-react"
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

  const isHighSpeed = appUrl?.includes("onrender.com");
  const finalProxyUrl = appUrl ? (isHighSpeed ? `${appUrl.replace(/\/$/, '')}/` : `${appUrl.replace(/\/$/, '')}/api/proxy/`) : "";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Globe className="h-4 w-4 text-indigo-600" /> 
          Шаг 1: Настройка в Render.com
        </h3>

        <Alert className="bg-indigo-50 border-indigo-200">
          <Server className="h-4 w-4 text-indigo-600" />
          <AlertTitle className="text-indigo-800 font-bold uppercase text-[10px]">Важные параметры (Configure):</AlertTitle>
          <AlertDescription className="text-indigo-700 text-[10px] leading-tight space-y-2 mt-1">
            <p>1. <b>REGION:</b> Обязательно выберите <b>Frankfurt (EU Central)</b>. Это обеспечит скорость как у Vercel.</p>
            <p>2. <b>ROOT DIRECTORY:</b> Укажите <code className="bg-indigo-100 px-1 rounded">proxigram</code>.</p>
            <p>3. <b>START COMMAND:</b> <code className="bg-indigo-100 px-1 rounded">node server.js</code>.</p>
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-600">
          <ShieldCheck className="h-4 w-4" /> 
          Шаг 2: Ваша новая ссылка для бота
        </h3>
        
        <div className="relative group">
          <div className={`text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner transition-colors ${
            isHighSpeed 
            ? 'bg-indigo-50/80 text-indigo-700 border-indigo-200 ring-2 ring-indigo-100' 
            : 'bg-white text-muted-foreground border-primary/20'
          }`}>
            {finalProxyUrl || "Ожидание ссылки от Render..."}
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
          Эту ссылку вставьте в настройки вашего Telegram бота. Она поддерживает файлы до 100 МБ через узел во Франкфурте.
        </p>
      </div>
    </div>
  )
}
