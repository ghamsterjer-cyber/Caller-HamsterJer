
"use client"

import * as React from "react"
import { Code2, Copy, Check, Cloud, Info } from "lucide-react"
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
    toast({ title: "Скопировано", description: "Пример кода скопирован." });
    setTimeout(() => setCopied(false), 2000);
  };

  // Формируем правильный URL прокси с учетом basePath
  const proxyBaseUrl = `${appUrl}/proxigram/api/proxy`;

  const fetchCode = `// Используйте этот URL вместо api.telegram.org
const PROXY_URL = "${proxyBaseUrl}";
const BOT_TOKEN = "ВАШ_ТОКЕН_БОТА";

// Запрос через Proxigram:
const apiUrl = \`\${PROXY_URL}/bot\${BOT_TOKEN}/getMe\`;

fetch(apiUrl)
  .then(res => res.json())
  .then(data => console.log("Работает через прокси!", data));`;

  const isPreview = appUrl?.includes('cloudworkstations.dev');

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <Cloud className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-bold">Cloud Proxy Active</AlertTitle>
        <AlertDescription className="text-xs">
          Ваш прокси доступен по пути <code className="bg-white px-1 rounded">/proxigram/api/proxy</code>.
        </AlertDescription>
      </Alert>

      {isPreview && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
          <Info className="h-4 w-4 text-amber-800" />
          <AlertTitle className="font-bold">Preview Mode</AlertTitle>
          <AlertDescription className="text-[10px]">
            Вы используете временную ссылку для разработки. Внешние POST-запросы могут блокироваться Google. 
            После <strong>Deploy</strong> и получения домена <code>.web.app</code> всё заработает для бота.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative group">
        <div className="absolute top-2 left-4 text-[10px] text-muted-foreground font-bold uppercase z-10">
          Integration Guide (JS)
        </div>
        <pre className="p-4 pt-10 rounded-lg bg-slate-950 text-slate-50 text-[10px] font-mono overflow-x-auto leading-relaxed">
          {fetchCode}
        </pre>
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 text-white hover:bg-white/10"
          onClick={() => copyToClipboard(fetchCode)}
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="text-[10px] text-muted-foreground p-3 border rounded-lg bg-muted/30">
        <p className="font-bold mb-2">Как это работает?</p>
        <p>Этот сервис принимает запросы и пересылает их в Telegram, обходя блокировки или скрывая ваш реальный IP. Все переданные файлы логируются во вкладке чата для отладки.</p>
      </div>
    </div>
  )
}
