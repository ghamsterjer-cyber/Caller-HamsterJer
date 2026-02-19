"use client"

import * as React from "react"
import { Copy, Check, Info, ExternalLink, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface UsageGuideProps {
  appUrl?: string;
}

export function UsageGuide({ appUrl }: UsageGuideProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Скопировано", description: "Адрес прокси скопирован." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Setup Vercel Proxy</h3>
            <p className="text-sm text-blue-800 mt-1">
              Ваш прокси-сервер будет работать на Vercel. Убедитесь, что папка proxigram выбрана как Root в настройках проекта Vercel.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold">Proxy URL</h4>
        <p className="text-sm text-gray-600">
          Ваш адрес для запросов к Telegram API будет выглядеть так:
        </p>
        <div className="relative">
          <code className="block bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
            https://caller-hamster-jer.vercel.app/proxigram/api/proxy/botTOKEN/getMe
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard("https://caller-hamster-jer.vercel.app/proxigram/api/proxy/")}
            className="absolute top-2 right-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <a
        href="https://vercel.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        Vercel Dashboard
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}
