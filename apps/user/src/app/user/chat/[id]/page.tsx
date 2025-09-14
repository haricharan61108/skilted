"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Clock, CheckCircle2 } from "lucide-react"
import Navbar from "@/components/navbar"
import { toast } from "sonner"
import api from "@/config"

interface Message {
  id: number
  content: string
  senderId: number
  senderType: "admin" | "user"
  createdAt: string
  isRead: boolean
}

interface Chat {
  id: number
  userId: number
  adminId: number
  jobId?: number
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface ApiResponse {
  chat: Chat
}

export default function UserChatPage() {
  const params = useParams()
  const router = useRouter()
  const [chat, setChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const adminId = params.id as string

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        setIsLoading(true)
        const res = await api.get(`/api/user/get-chat/${adminId}`);
        setChat(res.data.chat);
      } catch (error) {
        console.error("Error fetching chat messages:", error)
        toast.error("Failed to load chat messages")
      } finally {
        setIsLoading(false)
      }
    }

    if (adminId) {
      fetchChatMessages()
    }
  }, [adminId])

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const getAdminName = (adminId: number) => {
    // Generate name from admin ID for display
    const names = ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Lisa Thompson"]
    return names[adminId % names.length] || `Admin ${adminId}`
  }

  const getAdminEmail = (adminId: number) => {
    // Generate email from admin ID for display
    const emails = [
      "sarah@techcorp.com",
      "michael@designstudio.com",
      "emily@startupventures.com",
      "david@datainsights.com",
      "lisa@webagency.com",
    ]
    return emails[adminId % emails.length] || `admin${adminId}@company.com`
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    try {
      setIsSending(true)
      // TODO: Replace with actual API call
      // const response = await api.post(`/api/user/chat/${adminId}/message`, {
      //   content: newMessage
      // })

      // Mock sending message
      const mockMessage: Message = {
        id: Date.now(),
        content: newMessage,
        senderId: 1, // Current user ID
        senderType: "user",
        createdAt: new Date().toISOString(),
        isRead: false,
      }

      setChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, mockMessage],
            }
          : null,
      )

      setNewMessage("")
      toast.success("Message sent!")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const groupMessagesByDate = (messages: Message[] | undefined | null) => {
    const groups: { [key: string]: Message[] } = {}
    if (!messages || !Array.isArray(messages)) {
        return groups
      }

    messages.forEach((message) => {
      const date = formatDate(message.createdAt)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Not Found</h1>
            <p className="text-gray-600 mb-6">The conversation you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/user/messages")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Messages
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(chat.messages)
  const adminName = getAdminName(chat.adminId)
  const adminEmail = getAdminEmail(chat.adminId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/user/messages")}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Messages
          </Button>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    {adminName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-gray-900">{adminName}</h1>
                  <p className="text-sm text-gray-600">{adminEmail}</p>
                  {chat.jobId && <p className="text-xs text-blue-600 mt-1">Job #{chat.jobId}</p>}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Messages */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {Object.entries(messageGroups).map(([date, messages]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{date}</div>
                  </div>

                  {/* Messages for this date */}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === "user" ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === "user"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                            message.senderType === "user" ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(message.createdAt)}</span>
                          {message.senderType === "user" && message.isRead && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
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
