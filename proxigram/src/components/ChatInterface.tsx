
"use client"

import * as React from "react"
import { Send, Paperclip, FileText, CheckCheck, Loader2, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/lib/types"

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onFileUpload: (file: File) => void;
  isAIRecommending?: boolean;
}

export function ChatInterface({ messages, onSendMessage, onFileUpload, isAIRecommending }: ChatInterfaceProps) {
  const [inputText, setInputText] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm relative">
      <div className="telegram-bg absolute inset-0 z-0" />
      
      <div className="p-4 border-b bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-primary">Proxigram Agent</h2>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-green-500" /> End-to-end encrypted
            </div>
          </div>
        </div>
        {isAIRecommending && (
          <div className="flex items-center gap-2 text-xs font-medium text-primary animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" /> AI Selecting...
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 z-10" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm relative group transition-all hover:shadow-md ${
                msg.sender === 'user' ? 'chat-bubble-right' : 'chat-bubble-left border'
              }`}>
                {msg.type === 'file' ? (
                  <div className="flex items-center gap-3 p-1">
                    <div className={`p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white/20' : 'bg-primary/10'}`}>
                      <FileText className={`h-6 w-6 ${msg.sender === 'user' ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{msg.fileName}</p>
                      <p className={`text-[10px] ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {msg.fileSize} • Routing via Proxy
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                )}
                
                <div className="flex items-center justify-end mt-1 gap-1">
                  <span className={`text-[9px] ${msg.sender === 'user' ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'user' && <CheckCheck className="h-3 w-3 text-white/60" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t z-10">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-muted-foreground hover:text-primary h-11 w-11 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 bg-muted/50 rounded-2xl border flex items-center px-4 min-h-[44px]">
            <textarea 
              className="flex-1 bg-transparent border-none outline-none resize-none py-3 text-sm h-[44px] max-h-32"
              placeholder="Message via secure proxy..."
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <Button 
            className="rounded-full h-11 w-11 p-0 shrink-0 shadow-lg hover:scale-105 transition-transform"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
