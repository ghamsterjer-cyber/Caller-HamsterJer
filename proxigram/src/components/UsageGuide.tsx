
"use client"

import * as React from "react"
import { Copy, Check, Zap, AlertCircle, CheckCircle2, Rocket, FileCode, FolderSearch } from "lucide-react"
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

  const hfDockerCode = `FROM node:18
WORKDIR /app
RUN npm install express http-proxy-middleware
COPY server.js .
EXPOSE 7860
CMD ["node", "server.js"]`;

  const hfServerCode = `const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/', createProxyMiddleware({
    target: 'https://api.telegram.org',
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\\//, ''),
    onError: (err, req, res) => {
        res.status(500).send('Proxy Error');
    }
}));

const port = process.env.PORT || 7860;
app.listen(port, '0.0.0.0', () => {
    console.log(\`Proxy running on port \${port}\`);
});`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Rocket className="h-4 w-4 text-blue-600" /> 
          Настройка Hugging Face (High-Speed)
        </h3>

        <Alert className="bg-blue-50 border-blue-200">
          <FolderSearch className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold uppercase text-[10px]">Где найти вкладку Files:</AlertTitle>
          <AlertDescription className="text-blue-700 text-[10px] leading-tight space-y-2 mt-1">
            <p>1. Посмотрите на самый верх страницы (над черными блоками с кодом). Там есть ряд вкладок: <b>App</b>, <b>Files</b>, <b>Community</b>, <b>Settings</b>.</p>
            <p>2. Нажмите на <b>Files</b> (или <b>Files and versions</b>).</p>
            <p>3. Нажмите кнопку <b>Add file</b> -> <b>Create a new file</b>.</p>
            <p>4. Создайте первый файл с именем <b>Dockerfile</b> и вставьте код №1.</p>
            <p>5. Создайте второй файл с именем <b>server.js</b> и вставьте код №2.</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute top-2 left-4 text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <FileCode className="h-3 w-3" /> 1. Файл Dockerfile
            </div>
            <pre className="p-3 pt-8 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
              {hfDockerCode}
            </pre>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-white" onClick={() => copyToClipboard(hfDockerCode, 'hf-docker')}>
              {copied === 'hf-docker' ? <Check className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute top-2 left-4 text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <FileCode className="h-3 w-3" /> 2. Файл server.js
            </div>
            <pre className="p-3 pt-8 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-800">
              {hfServerCode}
            </pre>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6 text-slate-500 hover:text-white" onClick={() => copyToClipboard(hfServerCode, 'hf-server')}>
              {copied === 'hf-server' ? <Check className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
            </Button>
          </div>
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
          Эту ссылку вставьте в настройки вашего бота. Она пропустит файлы до 100 МБ быстро и надежно.
        </p>
      </div>
    </div>
  )
}
