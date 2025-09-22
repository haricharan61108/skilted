"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { BACKEND_URL } from "config"
import axios from "axios"
import { io, Socket } from "socket.io-client";

interface Message {
  id: string
  sender: "admin" | "user"
  content: string
  createdAt: string
}

interface UserInfo {
  email: string
  name?: string
}

export default function AdminChatPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const userId = params.userId as string
  const [socket, setSocket] = useState<Socket | null>(null);
  const adminId = 1;

  const [messages, setMessages] = useState<Message[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [chatId, setChatId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  //initialise socket connection
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
  
    const token = getCookie('jwt') || '';
    const newSocket = io('http://localhost:3000', {
      auth: { token }
    });
  
    newSocket.on('connect', () => console.log('Connected to WebSocket'));
    newSocket.on('disconnect', () => console.log('Disconnected'));
    newSocket.on('error', (error) => toast.error('Connection error'));
  
    setSocket(newSocket);
  
    return () => { newSocket.disconnect(); };
  }, []);

  // Socket Message Handler
useEffect(() => {
  if (socket && chatId) {
    socket.emit('joinRoom', chatId.toString());
    
    socket.on('receiveMessage', (data: Message) => {
      setMessages(prev => {
        if (!prev || prev.some(msg => msg.id === data.id)) return prev;
        return [...prev, { ...data, createdAt: data.createdAt || new Date().toISOString() }]; 
      });
    });

    return () => { socket.off('receiveMessage'); };
  }
}, [socket, chatId]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  useEffect(() => {
    const loadChatData = async () => {
      try {
        setIsLoading(true)
       

        const mockUserInfo: UserInfo = {
          email: "haricharan61108@gmail.com",
          name: "Hari Charan",
        }
        const res = await axios.post(`${BACKEND_URL}/api/admin/create-chat/${userId}`, {

        },{
          withCredentials: true
        })
        const data = res.data;
        setChatId(data.chat.id);
        console.log("Getting data",data)
        setUserInfo(mockUserInfo)
        if(data.success && data.chat && data.chat.messages) {
          setMessages(data.chat.messages);  
        }
        else {
          setMessages([]);
        console.warn("No messages found in response:", data);
        }
      } catch (error) {
        console.error("Error loading chat data:", error)
        toast.error("Failed to load chat")
      } finally {
        setIsLoading(false)
      }
    }

    loadChatData()
  }, [jobId, userId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !socket || !chatId) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSending(true);
  

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ✅ Unique ID
      sender: "admin",
      content: messageContent,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])

    try {
      socket.emit('sendMessage', {
        chatId: chatId.toString(),
        senderId: 1, 
        senderType: "admin",
        content: messageContent,
        receiverId: parseInt(userId)
      });

      // const response = await axios.post(
      //   `${BACKEND_URL}/api/admin/send-message/${chatId}`,
      //   { content: messageContent },
      //   {
      //     withCredentials: true,
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );
  
      // const savedMessage = response.data.message;
      // setMessages((prev) => prev.map((msg) => 
      //   msg.id === tempMessage.id ? {
      //     ...savedMessage,
      //     sender: "admin"
      //   } : msg
      // ));
  
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")

      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      setNewMessage(messageContent) 
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Floating Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-16 bg-white/60 rounded-lg mb-6"></div>
            <div className="h-[70vh] bg-white/60 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href={`/admin/jobs/${jobId}/applications`}>
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {userInfo?.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{userInfo?.name || userInfo?.email}</h1>
                  <p className="text-sm text-gray-600">{userInfo?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Container */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
              {messages && messages.length>0 ?(
              messages.map((message) => (
                <div
                  key={`${message.id}-${message.createdAt}`}
                  className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === "admin"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "admin" ? "text-white/70" : "text-gray-500"}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[44px] max-h-32 resize-none"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
