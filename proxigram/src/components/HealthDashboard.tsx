
"use client"

import * as React from "react"
import { Activity, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { HealthMetrics } from "@/lib/types"

const mockHistory = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  latency: Math.floor(Math.random() * 100) + 20,
}));

export function HealthDashboard({ metrics }: { metrics: HealthMetrics | null }) {
  if (!metrics) return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
      <Activity className="h-12 w-12 mb-4 opacity-20" />
      <p>No active proxy monitoring data available.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs uppercase font-semibold">
              <Clock className="h-4 w-4" /> Latency
            </div>
            <div className="text-2xl font-bold text-primary">{metrics.latency}ms</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs uppercase font-semibold">
              <Zap className="h-4 w-4" /> Speed
            </div>
            <div className="text-2xl font-bold text-secondary">{metrics.throughput}Mbps</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Performance History
          </CardTitle>
          <CardDescription>Real-time throughput tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHistory}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="latency" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
