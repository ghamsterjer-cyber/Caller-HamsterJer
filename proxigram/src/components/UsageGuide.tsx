"use client"

import * as React from "react"
import { Copy, Check, Zap, Rocket, ShieldCheck, Globe, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UsageGuideProps {
  appUrl?: string;
}

export function UsageGuide({ appUrl }: UsageGuideProps) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const { toast } = useToast();

  const finalProxyUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/api/proxy/` : "";

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: "Скопировано", description: "Ссылка готова для бота." });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600" /> 
          Встроенный Edge Прокси (Бессрочный)
        </h3>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold uppercase text-[10px]">Преимущества этого метода:</AlertTitle>
          <AlertDescription className="text-blue-700 text-[10px] leading-tight space-y-2 mt-1">
            <p>1. <b>Бессрочно</b>: Работает пока жив ваш проект на Vercel.</p>
            <p>2. <b>Скорость</b>: Использует Edge-узлы по всему миру (летает в РФ).</p>
            <p>3. <b>Лимит 32МБ</b>: Мы увеличили стандартный лимит Vercel в 8 раз.</p>
          </AlertDescription>
        </Alert>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-bold uppercase text-[10px]">Важное ограничение Telegram:</AlertTitle>
          <AlertDescription className="text-amber-700 text-[10px] leading-tight mt-1">
            Сам Telegram запрещает загружать файлы больше <b>50 МБ</b> через ботов. Файл 76 МБ не примет ни один прокси.
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold flex items-center gap-2 text-blue-600">
          <Zap className="h-4 w-4" /> 
          Ваш постоянный Endpoint
        </h3>
        
        <div className="relative group">
          <div className="text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner bg-blue-50/50 text-blue-800 border-blue-200">
            {finalProxyUrl || "Ожидание ссылки..."}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 hover:bg-white shadow-sm border"
            disabled={!finalProxyUrl}
            onClick={() => copyToClipboard(finalProxyUrl, 'current')}
          >
            {copied === 'current' ? <Check className="h-4 w-4 text-green-500" /> : <Globe className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground italic">
          Используйте эту ссылку в вашем приложении. Она вшита навсегда и не требует внешних сервисов.
        </p>
      </div>
    </div>
  )
}
