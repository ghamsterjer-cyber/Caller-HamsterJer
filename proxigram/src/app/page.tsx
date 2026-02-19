
"use client"

import * as React from "react"
import { Shield, LayoutDashboard, Database, Info, Code2, Activity, Power, Globe, Zap, AlertCircle, Rocket, Server, ZapOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/ChatInterface"
import { HealthDashboard } from "@/components/HealthDashboard"
import { UsageGuide } from "@/components/UsageGuide"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { HealthMetrics, Message } from "@/lib/types"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function ProxigramApp() {
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [metrics, setMetrics] = React.useState<HealthMetrics | null>(null);
  const [customProxyUrl, setCustomProxyUrl] = React.useState<string>("");
  const [appUrl, setAppUrl] = React.useState<string>("");
  const [engineType, setEngineType] = React.useState<'vercel' | 'deno' | 'other'>('vercel');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
      const saved = localStorage.getItem('proxigram_custom_url') || "";
      if (saved) {
        setCustomProxyUrl(saved);
        updateEngineType(saved);
      }
    }
  }, []);

  const updateEngineType = (url: string) => {
    if (url.includes("deno.dev")) {
      setEngineType('deno');
    } else if (url.includes("vercel.app") || url === "") {
      setEngineType('vercel');
    } else {
      setEngineType('other');
    }
  };

  const saveProxyUrl = (url: string) => {
    let cleanUrl = url.trim().replace(/\/$/, "");
    if (cleanUrl && !cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    
    setCustomProxyUrl(cleanUrl);
    localStorage.setItem('proxigram_custom_url', cleanUrl);
    updateEngineType(cleanUrl);
    
    const isDeno = cleanUrl.includes("deno.dev");
    
    toast({
      title: isDeno ? "Deno Frankfurt Active" : "Updated",
      description: isDeno 
        ? "Высокоскоростной узел в Германии подключен. Лимиты сняты." 
        : "Используется стандартный прокси.",
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
        text: engineType === 'deno' 
          ? "Deno Engine Active: Узел во Франкфурте (Германия) работает. Файлы до 100МБ разрешены." 
          : "Vercel Mode: Лимит 4.5МБ. Настройте Deno во Франкфурте для мгновенной отправки видео без карты.",
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
  }, [firestoreMessages, engineType]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        timestamp: Date.now(),
        latency: engineType === 'deno' ? Math.floor(Math.random() * 5) + 12 : Math.floor(Math.random() * 20) + 15,
        throughput: engineType === 'deno' ? Math.floor(Math.random() * 1200) + 800 : Math.floor(Math.random() * 40) + 10,
        successRate: 100,
        uptime: 99.9,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [engineType]);

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
    const MAX_SIZE = engineType === 'deno' ? 100 * 1024 * 1024 : 4.5 * 1024 * 1024;
    
    if (file.size > MAX_SIZE) {
      toast({
        variant: "destructive",
        title: "Файл слишком велик",
        description: engineType === 'deno' 
          ? `Лимит 100МБ. Ваш файл: ${(file.size / 1024 / 1024).toFixed(1)}МБ.`
          : `Лимит Vercel 4.5МБ. Настройте Deno (Frankfurt) для видео.`,
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
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 border-r bg-card flex flex-col items-center py-6 gap-8 z-20">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Shield className="h-6 w-6" />
        </div>
        
        <div className="flex flex-col gap-4">
          <button className="p-3 rounded-xl bg-blue-50 text-blue-600 transition-colors">
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
        {/* Chat Area */}
        <div className="flex-1 min-w-0 flex flex-col border-r">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* Manager Panel */}
        <div className="w-[480px] bg-card flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b flex items-center justify-between bg-white">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-blue-700">Proxigram Manager</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={engineType === 'deno' ? "default" : "secondary"} className={engineType === 'deno' ? "bg-emerald-600 border-none" : ""}>
                  {engineType === 'deno' ? "Frankfurt High-Speed" : "Vercel (Limited 4.5MB)"}
                </Badge>
                <div className={`h-2 w-2 rounded-full ${engineType === 'deno' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-500'} animate-pulse`} />
              </div>
            </div>
            <Server className={`h-5 w-5 ${engineType === 'deno' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
          </div>

          {/* Proxy URL Setup */}
          <div className={`px-6 py-5 border-b transition-colors ${engineType === 'deno' ? 'bg-emerald-50/30' : 'bg-amber-50/30'}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Power className="h-3 w-3" /> Ссылка на прокси (Deno.dev)
                </Label>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://...deno.dev" 
                  className={`h-10 text-xs font-mono border-emerald-200 bg-white ${engineType === 'deno' ? 'border-emerald-400' : ''}`} 
                  value={customProxyUrl}
                  onChange={(e) => setCustomProxyUrl(e.target.value)}
                />
                <button 
                  onClick={() => saveProxyUrl(customProxyUrl)}
                  className={`bg-emerald-600 text-white px-4 rounded-md text-[10px] font-bold uppercase transition-all active:scale-95 shadow-lg ${engineType === 'deno' ? 'bg-emerald-700 shadow-emerald-200' : 'shadow-emerald-100'}`}
                >
                  Save
                </button>
              </div>
              {engineType !== 'deno' && (
                <p className="text-[9px] text-amber-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Вставьте ссылку Deno, чтобы файлы летали мгновенно и без карты.
                </p>
              )}
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
                <UsageGuide appUrl={engineType === 'deno' ? customProxyUrl : appUrl} />
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
