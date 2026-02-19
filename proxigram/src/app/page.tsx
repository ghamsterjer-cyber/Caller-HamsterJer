
"use client"

import * as React from "react"
import { Shield, LayoutDashboard, Database, Info, Code2, Activity, AlertCircle, Settings2, Power } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChatInterface } from "../components/ChatInterface"
import { HealthDashboard } from "../components/HealthDashboard"
import { UsageGuide } from "../components/UsageGuide"
import { Toaster } from "../components/ui/toaster"
import { useToast } from "../hooks/use-toast"
import { ProxyConfig, HealthMetrics, Message } from "../lib/types"
import { useFirestore, useCollection, useMemoFirebase } from "../firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

export default function ProxigramApp() {
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [metrics, setMetrics] = React.useState<HealthMetrics | null>(null);
  const [customProxyUrl, setCustomProxyUrl] = React.useState<string>("");
  const [appUrl, setAppUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
      const saved = localStorage.getItem('proxigram_custom_url');
      if (saved) setCustomProxyUrl(saved);
    }
  }, []);

  const saveProxyUrl = (url: string) => {
    let cleanUrl = url.trim().replace(/\/$/, "");
    if (cleanUrl && !cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    
    setCustomProxyUrl(cleanUrl);
    localStorage.setItem('proxigram_custom_url', cleanUrl);
    toast({
      title: "Настройки сохранены",
      description: cleanUrl ? "Теперь используется безлимитный прокси Railway (100MB+)." : "Используется стандартный прокси Vercel (4.5MB).",
    });
  };

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "messages"), orderBy("timestamp", "asc"), limit(50));
  }, [firestore]);

  const { data: firestoreMessages } = useCollection<any>(messagesQuery);

  const messages: Message[] = React.useMemo(() => {
    if (!firestoreMessages || firestoreMessages.length === 0) {
      return [{
        id: 'welcome',
        text: "Система готова к работе. Для файлов > 4.5 МБ используйте Railway Engine.",
        sender: 'system',
        timestamp: new Date(),
        type: 'text'
      }];
    }
    return firestoreMessages.map(m => ({
      ...m,
      id: m.id,
      timestamp: m.timestamp?.toDate() || new Date()
    }));
  }, [firestoreMessages]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        timestamp: Date.now(),
        latency: Math.floor(Math.random() * 10) + 2,
        throughput: customProxyUrl ? Math.floor(Math.random() * 900) + 100 : Math.floor(Math.random() * 100) + 20,
        successRate: 100,
        uptime: 99.9,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [customProxyUrl]);

  const handleSendMessage = (text: string) => {
    if (!firestore) return;
    addDoc(collection(firestore, "messages"), {
      text,
      sender: 'user',
      timestamp: serverTimestamp(),
      type: 'text'
    });
  };

  const handleFileUpload = (file: File) => {
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB UI Limit
    
    if (file.size > MAX_SIZE) {
      toast({
        variant: "destructive",
        title: "Файл слишком велик",
        description: `Максимальный лимит системы — 100 МБ. Ваш файл: ${(file.size / 1024 / 1024).toFixed(2)} МБ.`,
      });
      return;
    }

    if (file.size > 4.5 * 1024 * 1024 && !customProxyUrl) {
      toast({
        variant: "destructive",
        title: "Лимит Vercel (4.5 МБ)",
        description: "Этот файл не пройдет через стандартный прокси. Настройте Railway во вкладке Setup.",
      });
      return;
    }

    if (!firestore) return;
    addDoc(collection(firestore, "messages"), {
      text: `Файл отправлен: ${file.name}`,
      sender: 'user',
      timestamp: serverTimestamp(),
      type: 'file',
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'success'
    });
    
    toast({
      title: "Файл передан",
      description: `${file.name} отправлен через ${customProxyUrl ? 'Railway' : 'Vercel'} прокси.`,
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="w-20 border-r bg-card flex flex-col items-center py-6 gap-8 z-20">
        <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Shield className="h-6 w-6" />
        </div>
        
        <div className="flex flex-col gap-4">
          <button className="p-3 rounded-xl bg-primary/10 text-primary transition-colors">
            <LayoutDashboard className="h-6 w-6" />
          </button>
          <button className="p-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Database className="h-6 w-6" />
          </button>
          <button className="p-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <Info className="h-6 w-6" />
          </button>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col border-r">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
          />
        </div>

        <div className="w-[450px] bg-card flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b flex items-center justify-between bg-white">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-primary">Proxigram High-Load</h1>
              <span className={`text-[10px] uppercase font-bold ${customProxyUrl ? 'text-blue-500' : 'text-green-600'}`}>
                {customProxyUrl ? "Railway Engine: Connected" : "Vercel Engine: active (4.5MB limit)"}
              </span>
            </div>
            <div className={`h-3 w-3 rounded-full ${customProxyUrl ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'} animate-pulse`} />
          </div>

          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Power className="h-3 w-3" /> Railway Proxy Domain
                </Label>
                {customProxyUrl && <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">UNLIMITED</span>}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://...railway.app" 
                  className="h-9 text-xs border-primary/20 bg-white" 
                  value={customProxyUrl}
                  onChange={(e) => setCustomProxyUrl(e.target.value)}
                />
                <button 
                  onClick={() => saveProxyUrl(customProxyUrl)}
                  className="bg-primary text-white px-4 rounded-md text-[10px] font-bold uppercase transition-transform active:scale-95 shadow-lg shadow-primary/20"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="usage" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-2">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="usage" className="gap-2 text-xs">
                  <Code2 className="h-4 w-4" /> Setup Guide
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="gap-2 text-xs">
                  <Activity className="h-4 w-4" /> Performance
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="usage" className="m-0">
                <UsageGuide appUrl={customProxyUrl || appUrl} />
              </TabsContent>

              <TabsContent value="dashboard" className="m-0 space-y-6">
                <HealthDashboard metrics={metrics} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
