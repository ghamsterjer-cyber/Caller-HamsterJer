
"use client"

import * as React from "react"
import { Shield, LayoutDashboard, Database, Info, Code2, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/ChatInterface"
import { HealthDashboard } from "@/components/HealthDashboard"
import { UsageGuide } from "@/components/UsageGuide"
import { Toaster } from "@/components/ui/toaster"
import { ProxyConfig, HealthMetrics, Message } from "@/lib/types"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"

export default function ProxigramApp() {
  const { firestore } = useFirestore();
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
        text: "Добро пожаловать в Proxigram! Ваше защищенное соединение с Telegram API.",
        sender: 'system',
        timestamp: new Date(),
        type: 'text'
      }];
    }
    return firestoreMessages.map(m => ({
      ...m,
      timestamp: m.timestamp?.toDate() || new Date()
    }));
  }, [firestoreMessages]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        timestamp: Date.now(),
        latency: Math.floor(Math.random() * 30) + 10,
        throughput: Math.floor(Math.random() * 100) + 50,
        successRate: 100,
        uptime: 24,
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
    if (!firestore) return;
    addDoc(collection(firestore, "messages"), {
      text: `Файл отправлен через прокси: ${file.name}`,
      sender: 'user',
      timestamp: serverTimestamp(),
      type: 'file',
      fileName: file.name,
      fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    });
  };

  const activeProxy: ProxyConfig = {
    id: "internal",
    ipAddress: appUrl.replace('https://', '').replace('http://', ''),
    port: 443,
    location: "Cloud (Automatic)",
    estimatedLatencyMs: 15,
    estimatedThroughputMbps: 200,
    currentLoad: 0.1,
    isInternal: true
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

        <div className="w-[450px] bg-card flex flex-col overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Proxigram Cloud</h1>
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
          </div>

          <Tabs defaultValue="usage" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="usage" className="gap-2 text-xs">
                  <Code2 className="h-4 w-4" /> Setup
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
