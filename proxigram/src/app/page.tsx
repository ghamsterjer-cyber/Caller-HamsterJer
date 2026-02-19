
"use client"

import * as React from "react"
import { Shield, LayoutDashboard, Database, Info, Code2, Activity, Power, ExternalLink, Globe, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChatInterface } from "../components/ChatInterface"
import { HealthDashboard } from "../components/HealthDashboard"
import { UsageGuide } from "../components/UsageGuide"
import { Toaster } from "../components/ui/toaster"
import { useToast } from "../hooks/use-toast"
import { ProxyConfig, HealthMetrics, Message } from "../lib/types"
import { useFirestore, useCollection, useMemoFirebase } from "../firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"

export default function ProxigramApp() {
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [metrics, setMetrics] = React.useState<HealthMetrics | null>(null);
  const [customProxyUrl, setCustomProxyUrl] = React.useState<string>("");
  const [appUrl, setAppUrl] = React.useState<string>("");
  const [isRailwayActive, setIsRailwayActive] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
      // Автоматически подставляем ваш новый домен Railway
      const saved = localStorage.getItem('proxigram_custom_url') || "https://caller-hamsterjer-production.up.railway.app";
      setCustomProxyUrl(saved);
      if (saved.includes("railway.app")) setIsRailwayActive(true);
    }
  }, []);

  const saveProxyUrl = (url: string) => {
    let cleanUrl = url.trim().replace(/\/$/, "");
    if (cleanUrl && !cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    
    setCustomProxyUrl(cleanUrl);
    localStorage.setItem('proxigram_custom_url', cleanUrl);
    const active = cleanUrl.includes("railway.app");
    setIsRailwayActive(active);
    
    toast({
      title: active ? "Активирован High-Load" : "Обновлено",
      description: active 
        ? "Система переключена на безлимитный канал Railway (100MB+)." 
        : "Используется стандартный прокси (4.5МБ).",
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
        text: isRailwayActive 
          ? "Railway Engine Active: Безлимитный режим включен. Файлы до 100МБ разрешены." 
          : "Vercel Engine Active: Лимит 4.5МБ. Подключите Railway для видео.",
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
  }, [firestoreMessages, isRailwayActive]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        timestamp: Date.now(),
        latency: isRailwayActive ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 25) + 15,
        throughput: isRailwayActive ? Math.floor(Math.random() * 400) + 100 : Math.floor(Math.random() * 40) + 10,
        successRate: 100,
        uptime: 99.9,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isRailwayActive]);

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
    const MAX_SIZE = isRailwayActive ? 100 * 1024 * 1024 : 4.5 * 1024 * 1024;
    
    if (file.size > MAX_SIZE) {
      toast({
        variant: "destructive",
        title: "Файл слишком велик",
        description: isRailwayActive 
          ? `Railway лимит 100МБ. Ваш файл: ${(file.size / 1024 / 1024).toFixed(1)}МБ.`
          : `Vercel лимит 4.5МБ. Используйте Railway для этого файла.`,
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
      description: `${file.name} отправлен через ${isRailwayActive ? 'Railway High-Load' : 'Vercel'} прокси.`,
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
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isRailwayActive ? "default" : "secondary"} className={isRailwayActive ? "bg-blue-600 border-none" : ""}>
                  {isRailwayActive ? "Railway Unlimited" : "Vercel Basic"}
                </Badge>
                <div className={`h-2 w-2 rounded-full ${isRailwayActive ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-green-500'} animate-pulse`} />
              </div>
            </div>
            <Globe className={`h-5 w-5 ${isRailwayActive ? 'text-blue-500' : 'text-muted-foreground'}`} />
          </div>

          <div className={`px-6 py-5 border-b transition-colors ${isRailwayActive ? 'bg-blue-50/30' : 'bg-muted/30'}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Power className="h-3 w-3" /> Настройка прокси-двигателя
                </Label>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://...up.railway.app" 
                  className={`h-10 text-xs font-mono border-primary/20 bg-white ${isRailwayActive ? 'border-blue-300' : ''}`} 
                  value={customProxyUrl}
                  onChange={(e) => setCustomProxyUrl(e.target.value)}
                />
                <button 
                  onClick={() => saveProxyUrl(customProxyUrl)}
                  className={`bg-primary text-white px-4 rounded-md text-[10px] font-bold uppercase transition-all active:scale-95 shadow-lg ${isRailwayActive ? 'bg-blue-600 shadow-blue-200' : 'shadow-primary/20'}`}
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
                  <Code2 className="h-4 w-4" /> Endpoint Guide
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="gap-2 text-xs">
                  <Activity className="h-4 w-4" /> Performance
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="usage" className="m-0">
                <UsageGuide appUrl={isRailwayActive ? customProxyUrl : appUrl} />
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
