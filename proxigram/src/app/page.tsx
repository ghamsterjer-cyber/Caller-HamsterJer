"use client"

import * as React from "react"
import { Shield, LayoutDashboard, Database, Info, Code2, Activity, Rocket } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/ChatInterface"
import { HealthDashboard } from "@/components/HealthDashboard"
import { UsageGuide } from "@/components/UsageGuide"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { HealthMetrics, Message } from "@/lib/types"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"

export default function ProxigramApp() {
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const [metrics, setMetrics] = React.useState<HealthMetrics | null>(null);
  const [appUrl, setAppUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
    }
  }, []);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "messages"), orderBy("timestamp", "asc"), limit(50));
  }, [firestore]);

  const { data: firestoreMessages } = useCollection<any>(messagesQuery);

  const messages: Message[] = React.useMemo(() => {
    if (!firestoreMessages || firestoreMessages.length === 0) {
      return [{
        id: 'welcome',
        text: "Edge Engine Active: Ваш внутренний прокси готов. Скорость максимальная, лимит 32МБ. Помните: Telegram Bot API не принимает файлы > 50МБ.",
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
        latency: Math.floor(Math.random() * 5) + 5,
        throughput: Math.floor(Math.random() * 2000) + 1000,
        successRate: 100,
        uptime: 99.9,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    const EDGE_LIMIT = 32 * 1024 * 1024;
    const TG_LIMIT = 50 * 1024 * 1024;
    
    if (file.size > TG_LIMIT) {
      toast({
        variant: "destructive",
        title: "Лимит Telegram",
        description: "Bot API запрещает файлы > 50МБ. Это ограничение самого Telegram.",
      });
      return;
    }

    if (file.size > EDGE_LIMIT) {
      toast({
        variant: "destructive",
        title: "Лимит Vercel Edge",
        description: "Vercel ограничивает Edge-запросы до 32МБ. Файл слишком велик для прокси.",
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

        <div className="w-[480px] bg-card flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b flex items-center justify-between bg-white">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-primary">Proxigram Edge</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="bg-blue-600 border-none">
                  Vercel Edge High-Speed
                </Badge>
                <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" />
              </div>
            </div>
            <Rocket className="h-5 w-5 text-blue-500" />
          </div>

          <div className="px-6 py-4 bg-blue-50/30 border-b">
            <p className="text-[10px] text-blue-700 font-medium leading-tight">
              Используется встроенный Edge-движок. Срок действия: <b>Бессрочно</b>. 
              Никаких внешних ссылок не требуется. Лимит: 32 МБ.
            </p>
          </div>

          <Tabs defaultValue="usage" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-2">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="usage" className="gap-2 text-xs">
                  <Code2 className="h-4 w-4" /> Endpoint
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="gap-2 text-xs">
                  <Activity className="h-4 w-4" /> Health
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="usage" className="m-0">
                <UsageGuide appUrl={appUrl} />
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
