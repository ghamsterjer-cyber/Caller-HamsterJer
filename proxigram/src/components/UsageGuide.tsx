
"use client"

import * as React from "react"
import { Copy, Check, Zap, AlertCircle, CheckCircle2, Rocket, FileCode, FolderSearch, MoreVertical } from "lucide-react"
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
    toast({ title: "Скопировано", description: "Код готов к вставке в Hugging Face." });
    setTimeout(() => setCopied(null), 2000);
  };

  const isHF = appUrl?.includes("hf.space");
  const finalProxyUrl = appUrl ? (isHF ? `${appUrl.replace(/\/$/, '')}/` : `${appUrl.replace(/\/$/, '')}/api/proxy/`) : "";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Rocket className="h-4 w-4 text-blue-600" /> 
          Как найти ссылку на прокси:
        </h3>

        <Alert className="bg-blue-50 border-blue-200">
          <MoreVertical className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold uppercase text-[10px]">Шаги для получения Direct URL:</AlertTitle>
          <AlertDescription className="text-blue-700 text-[10px] leading-tight space-y-2 mt-1">
            <p>1. Нажмите на <b>три точки (⋮)</b> в самом верху страницы Hugging Face (справа от статуса Running).</p>
            <p>2. Выберите пункт <b>"Embed this Space"</b>.</p>
            <p>3. Скопируйте ссылку из поля <b>"Direct URL"</b>.</p>
            <p>4. Вставьте её в поле <b>"Ссылка на прокси"</b> выше на этой странице.</p>
          </AlertDescription>
        </Alert>

        <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-primary/20">
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            Судя по вашему скриншоту, ваша ссылка должна быть: <br/>
            <code className="bg-white px-1 rounded text-primary font-bold">https://hamsterjer-proxigram.hf.space/</code>
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-500" /> 
          Ваш Endpoint для бота
        </h3>
        
        <div className="relative group">
          <div className={`text-[11px] font-mono p-4 pr-12 border rounded-xl break-all leading-relaxed shadow-inner transition-colors ${
            isHF 
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
        <p className="text-[9px] text-muted-foreground italic">
          Эту ссылку вставьте в настройки вашего бота. Она пропустит файлы до 100 МБ быстро и надежно через Hugging Face.
        </p>
      </div>
    </div>
  )
}
