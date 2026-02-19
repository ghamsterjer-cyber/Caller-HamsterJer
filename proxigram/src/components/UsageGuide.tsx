
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

  const finalProxyUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/api/proxy/` : "";
  const isRailway = appUrl?.includes("railway.app");

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className={`h-4 w-4 ${isRailway ? 'text-blue-500' : 'text-primary'}`} /> 
          {isRailway ? 'Ваш High-Load Proxy Endpoint' : 'Ваш стандартный Endpoint'}
        </h3>
        <div className="relative">
          <div className={`text-[10px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner ${isRailway ? 'bg-blue-50/50 text-blue-700 border-blue-200 font-bold' : 'bg-white text-muted-foreground border-primary/20'}`}>
            {finalProxyUrl || "Ожидание настройки..."}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 hover:bg-white"
            disabled={!finalProxyUrl}
            onClick={() => copyToClipboard(finalProxyUrl, 'current')}
          >
            {copied === 'current' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Layers className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
          {isRailway 
            ? "Используйте этот URL в ваших ботах. Railway пропустит файлы до 100МБ." 
            : "Этот URL имеет лимит 4.5МБ. Для видео используйте домен Railway."}
        </p>
      </div>

      {isRailway ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800 text-xs font-bold">Railway Подключен!</AlertTitle>
          <AlertDescription className="text-green-700 text-[10px]">
            Система работает в безлимитном режиме. Ваши аудио и видео теперь будут передаваться без ошибок 404.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-blue-700 flex items-center gap-2">
            <Network className="h-4 w-4" /> Лимит 4.5МБ Активен
          </h4>
          <p className="text-[10px] text-blue-600 leading-tight">
            Чтобы отправлять файлы > 4.5МБ, вставьте полученный домен от Railway в поле сверху.
          </p>
        </div>
      )}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="railway-steps" className="border-primary/20 bg-muted/20 px-4 rounded-xl">
          <AccordionTrigger className="text-primary hover:no-underline py-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase">
              <HelpCircle className="h-4 w-4" /> 
              Как обновить Railway?
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
              <p>Если прокси перестал работать:</p>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px]">1</div>
                <p>Проверьте вкладку <strong>Variables</strong> в Railway. Там должно быть: <code>RAILWAY_ROOT_DIRECTORY = proxigram</code></p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px]">2</div>
                <p>Проверьте <strong>Networking</strong>. Port должен быть <code>3000</code>.</p>
              </div>
            </div>
            
            <Button 
              asChild 
              variant="outline"
              className="w-full h-8 text-[10px] font-bold uppercase"
            >
              <a href="https://railway.app" target="_blank">
                Railway Dashboard <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
