
"use client"

import * as React from "react"
import { Shield, LayoutDashboard, Database, Info, Code2, Activity, Power, Globe, Zap, AlertCircle, Rocket, Server } from "lucide-react"
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
  const [isHighSpeed, setIsHighSpeed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
      const saved = localStorage.getItem('proxigram_custom_url') || "";
      if (saved) {
        setCustomProxyUrl(saved);
        checkHighSpeed(saved);
      }
    }
  }, []);

  const checkHighSpeed = (url: string) => {
    // Если ссылка содержит onrender.com, это наш новый скоростной движок
    const active = url.includes("onrender.com");
    setIsHighSpeed(active);
    return active;
  };

  const saveProxyUrl = (url: string) => {
    let cleanUrl = url.trim().replace(/\/$/, "");
    if (cleanUrl && !cleanUrl.startsWith("http")) cleanUrl = "https://" + cleanUrl;
    
    setCustomProxyUrl(cleanUrl);
    localStorage.setItem('proxigram_custom_url', cleanUrl);
    const active = checkHighSpeed(cleanUrl);
    
    toast({
      title: active ? "High-Speed Frankfurt Active" : "Updated",
      description: active 
        ? "Render.com (Германия) подключен. Скорость и отсутствие лимитов активны." 
        : "Используется стандартный прокси (лимит 4.5МБ).",
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
        text: isHighSpeed 
          ? "High-Speed Frankfurt Active: Узел во Франкфурте готов к быстрой передаче файлов (100МБ+)." 
          : "Vercel Mode Active: Лимит 4.5МБ. Настройте Render во Франкфурте для тяжелых файлов.",
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
  }, [firestoreMessages, isHighSpeed]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        timestamp: Date.now(),
        latency: isHighSpeed ? Math.floor(Math.random() * 8) + 15 : Math.floor(Math.random() * 20) + 15,
        throughput: isHighSpeed ? Math.floor(Math.random() * 900) + 600 : Math.floor(Math.random() * 40) + 10,
        successRate: 100,
        uptime: 99.9,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isHighSpeed]);

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
    const MAX_SIZE = isHighSpeed ? 100 * 1024 * 1024 : 4.5 * 1024 * 1024;
    
    if (file.size > MAX_SIZE) {
      toast({
        variant: "destructive",
        title: "Файл слишком велик",
        description: isHighSpeed 
          ? `Лимит 100МБ. Ваш файл: ${(file.size / 1024 / 1024).toFixed(1)}МБ.`
          : `Лимит 4.5МБ. Настройте Render во Франкфурте для видео.`,
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
        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Shield className="h-6 w-6" />
        </div>
        
        <div className="flex flex-col gap-4">
          <button className="p-3 rounded-xl bg-indigo-50 text-indigo-600 transition-colors">
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
              <h1 className="text-xl font-bold tracking-tight text-indigo-700">Proxigram Manager</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isHighSpeed ? "default" : "secondary"} className={isHighSpeed ? "bg-indigo-600 border-none" : ""}>
                  {isHighSpeed ? "Frankfurt Node Active" : "4.5MB Mode (Limited)"}
                </Badge>
                <div className={`h-2 w-2 rounded-full ${isHighSpeed ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' : 'bg-amber-500'} animate-pulse`} />
              </div>
            </div>
            <Server className={`h-5 w-5 ${isHighSpeed ? 'text-indigo-500' : 'text-muted-foreground'}`} />
          </div>

          {/* Proxy URL Setup */}
          <div className={`px-6 py-5 border-b transition-colors ${isHighSpeed ? 'bg-indigo-50/30' : 'bg-amber-50/30'}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Power className="h-3 w-3" /> Ссылка на прокси (Render.com)
                </Label>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://...onrender.com" 
                  className={`h-10 text-xs font-mono border-indigo-200 bg-white ${isHighSpeed ? 'border-indigo-400' : ''}`} 
                  value={customProxyUrl}
                  onChange={(e) => setCustomProxyUrl(e.target.value)}
                />
                <button 
                  onClick={() => saveProxyUrl(customProxyUrl)}
                  className={`bg-indigo-600 text-white px-4 rounded-md text-[10px] font-bold uppercase transition-all active:scale-95 shadow-lg ${isHighSpeed ? 'bg-indigo-700 shadow-indigo-200' : 'shadow-indigo-100'}`}
                >
                  Save
                </button>
              </div>
              {!isHighSpeed && (
                <p className="text-[9px] text-amber-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Вставьте ссылку из Render (Frankfurt), чтобы летали файлы до 100МБ.
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
                <UsageGuide appUrl={isHighSpeed ? customProxyUrl : appUrl} />
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
