
"use client"

import * as React from "react"
import { Copy, Check, ExternalLink, Zap, Server, Shield, Layers, HelpCircle, AlertCircle, MousePointer2, Network } from "lucide-react"
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
    toast({ title: "Скопировано", description: "Адрес прокси скопирован." });
    setTimeout(() => setCopied(null), 2000);
  };

  const finalProxyUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/api/proxy/` : "";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Ваш Railway Proxy Endpoint
        </h3>
        <div className="relative">
          <div className={`text-[10px] font-mono p-3 pr-10 border rounded break-all leading-relaxed ${finalProxyUrl ? 'bg-white text-muted-foreground font-bold border-primary/50' : 'bg-muted/50 text-muted-foreground/50'}`}>
            {finalProxyUrl || "https://ВАШ-ПРОЕКТ.up.railway.app/api/proxy/"}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-1 right-1 h-7 w-7"
            disabled={!finalProxyUrl}
            onClick={() => copyToClipboard(finalProxyUrl, 'current')}
          >
            {copied === 'current' ? <Check className="h-3 w-3 text-green-500" /> : <Layers className="h-3 w-3" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Вставьте этот URL в настройки бота. Это ваш "безлимитный мост" для файлов до 100 МБ.
        </p>
      </div>

      <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-blue-700 flex items-center gap-2">
          <Network className="h-4 w-4" /> Настройка Порта (Port)
        </h4>
        <p className="text-[11px] text-blue-600 leading-tight">
          Если Railway просит ввести <strong>Port</strong> в разделе Networking — введите <strong>3000</strong>.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="railway-steps" className="border-primary bg-primary/5 px-4 rounded-xl mb-4">
          <AccordionTrigger className="text-primary hover:no-underline py-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase">
              <Server className="h-4 w-4" /> 
              Инструкция по шагам (Railway)
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">1</div>
                <p>Нажмите на блок <strong>"Caller-HamsterJer"</strong> в центре экрана Railway.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">2</div>
                <p>В панели справа выберите вкладку <strong>Variables</strong> и добавьте <code>RAILWAY_ROOT_DIRECTORY = proxigram</code>.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">3</div>
                <p>Перейдите во вкладку <strong>Settings -> Networking</strong>.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">4</div>
                <p>В поле <strong>Port</strong> введите <code>3000</code> и нажмите Save.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">5</div>
                <p>Нажмите <strong>Generate Domain</strong> и скопируйте полученный адрес сюда.</p>
              </div>
            </div>
            
            <Button 
              asChild 
              className="w-full h-8 text-[10px] font-bold uppercase shadow-md"
            >
              <a href="https://railway.app/new" target="_blank">
                Открыть Railway Console <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-700 text-xs font-bold">Важно!</AlertTitle>
        <AlertDescription className="text-amber-600 text-[10px]">
          Если Railway пишет <strong>"Trial expired"</strong>, деплой не начнется. В этом случае нужно создать новый аккаунт или привязать карту для продления бесплатного лимита.
        </AlertDescription>
      </Alert>
    </div>
  )
}
