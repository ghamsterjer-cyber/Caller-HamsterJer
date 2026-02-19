
"use client"

import * as React from "react"
import { Copy, Check, ExternalLink, Zap, Server, Shield, Layers, HelpCircle, AlertCircle, MousePointer2, Network, CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { toast } from "../hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

interface UsageGuideProps {
  appUrl?: string;
}

export function UsageGuide({ appUrl }: UsageGuideProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: "Скопировано", description: "Адрес прокси готов к использованию." });
    setTimeout(() => setCopied(null), 2000);
  };

  const isRailway = appUrl?.includes("railway.app");
  const finalProxyUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/api/proxy/` : "";
  
  // Пример кода для бота
  const exampleCode = `// Пример использования в вашем коде:
const PROXY = "${finalProxyUrl}";
const TOKEN = "ВАШ_ТОКЕН_БОТА";
const url = \`\${PROXY}bot\${TOKEN}/sendAudio\`;`;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Zap className={`h-4 w-4 ${isRailway ? 'text-blue-500' : 'text-primary'}`} /> 
            Основной Endpoint для бота
          </h3>
          {isRailway && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
              UNLIMITED 100MB+
            </span>
          )}
        </div>
        
        <div className="relative group">
          <div className={`text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner transition-colors ${
            isRailway 
            ? 'bg-blue-50/80 text-blue-700 border-blue-200 ring-2 ring-blue-100' 
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
        
        <p className="text-[10px] text-muted-foreground leading-relaxed px-1 italic">
          {isRailway 
            ? "✓ Используйте эту ссылку. Railway пропустит файлы до 100МБ." 
            : "⚠ Эта ссылка ограничена 4.5МБ (Vercel). Для видео нужен домен Railway."}
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-2 left-4 text-[9px] font-bold text-muted-foreground uppercase">Код для вставки в бота:</div>
        <pre className="p-4 pt-8 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
          {exampleCode}
        </pre>
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-white"
          onClick={() => copyToClipboard(exampleCode, 'code')}
        >
          {copied === 'code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>

      {!isRailway && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 text-xs font-bold uppercase">Внимание: Лимит 4.5МБ</AlertTitle>
          <AlertDescription className="text-amber-700 text-[10px] leading-tight mt-1">
            Вы используете прокси через Vercel. Тяжелые файлы будут выдавать ошибку 413 или 404. 
            <strong> Подключите Railway</strong> во вкладке сверху для снятия лимитов.
          </AlertDescription>
        </Alert>
      )}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="help" className="border-none bg-muted/30 px-4 rounded-xl">
          <AccordionTrigger className="text-muted-foreground hover:no-underline py-3 text-xs">
            Как это работает?
          </AccordionTrigger>
          <AccordionContent className="text-[10px] text-muted-foreground space-y-2 pb-4 leading-relaxed">
            <p>1. <strong>Vercel (UI)</strong>: Красивая оболочка, которую вы видите сейчас.</p>
            <p>2. <strong>Railway (Engine)</strong>: Мощный сервер, который пересылает данные без ограничений.</p>
            <p>Когда вы вставляете ссылку Railway в своего бота, данные идут напрямую через мощный сервер, минуя ограничения Vercel.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
