'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils' // Assuming you have shadcn's utility

interface Message {
  id: string
  sender: 'user' | 'support'
  text: string
  timestamp: Date
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const responseTimerRef = useRef<number | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'support',
      text: 'Hello! How can we help you today?',
      timestamp: new Date(),
    },
  ])

  // 1. Auto-scroll to bottom whenever messages or typing status changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      if (responseTimerRef.current) {
        window.clearTimeout(responseTimerRef.current)
      }
    }
  }, [])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate support response
    if (responseTimerRef.current) {
      window.clearTimeout(responseTimerRef.current)
    }

    responseTimerRef.current = window.setTimeout(() => {
      const supportMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'support',
        text: "Thanks for your message! We'll get back to you shortly.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, supportMessage])
      setIsTyping(false)
      responseTimerRef.current = null
    }, 1500)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-amber-800 text-primary-foreground rounded-full p-4 shadow-xl hover:scale-110 transition-transform active:scale-95"
        aria-label="Open chat support"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(calc(100vw-3rem),400px)] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Support Team</p>
                <p className="text-[10px] opacity-80">Online | Usually responds in 1m</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-dot-pattern scroll-smooth"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col",
                  msg.sender === 'user' ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                    msg.sender === 'user'
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none border border-border"
                  )}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none border border-border">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border">
            <div className="flex gap-2 items-center bg-muted/50 rounded-xl p-1 pr-2 border border-border focus-within:ring-2 focus-within:ring-primary transition-all">
              <input
                type="text"
                placeholder="Message support..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={!input.trim() || isTyping}
                className="h-8 w-8 rounded-lg shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              Powered by YourBrand AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}