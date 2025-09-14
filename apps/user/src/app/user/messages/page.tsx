"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle, Clock, Mail, ArrowRight, Inbox, CheckCircle2 } from "lucide-react"
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
  admin: {
    id: number
    email: string
  }
  messages: Message[]
}

interface ApiResponse {
  success: boolean
  chats: Chat[]
}

export default function UserMessagesPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/api/user/get-chats");
        setChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error)
        toast.error("Failed to load conversations")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getAdminName = (email: string) => {
    return email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getCompanyName = (email: string) => {
    const domain = email.split("@")[1]
    return domain.split(".")[0].replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const filteredChats = chats.filter((chat) => {
    const adminName = getAdminName(chat.admin.email)
    const companyName = getCompanyName(chat.admin.email)
    const lastMessage = chat.messages[0]?.content || ""

    return (
      adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const totalUnread = chats.reduce((sum, chat) => {
    const unreadCount = chat.messages.filter((msg) => !msg.isRead && msg.senderType === "admin").length
    return sum + unreadCount
  }, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Communicate with clients about your job applications</p>
            </div>
            {totalUnread > 0 && (
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
                {totalUnread} unread
              </Badge>
            )}
          </div>

          {/* Search
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Conversations List */}
        {filteredChats.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No conversations found" : "No messages yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms to find conversations."
                  : "Start applying to jobs to begin conversations with clients."}
              </p>
              {!searchTerm && (
                <Link href="/user/getJobs">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                    <Inbox className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredChats.map((chat) => {
              const lastMessage = chat.messages[0]
              const adminName = getAdminName(chat.admin.email)
              const companyName = getCompanyName(chat.admin.email)
              const unreadCount = chat.messages.filter((msg) => !msg.isRead && msg.senderType === "admin").length

              return (
                <Link key={chat.id} href={`/user/chat/${chat.admin.id}`} className="block">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                            {adminName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{adminName}</h3>
                                {unreadCount > 0 && (
                                  <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">{unreadCount}</Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{chat.admin.email}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{companyName}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {lastMessage ? formatTimeAgo(lastMessage.createdAt) : formatTimeAgo(chat.updatedAt)}
                              </span>
                            </div>
                          </div>

                          {/* Job Badge */}
                          {chat.jobId && (
                            <div className="mb-3">
                              <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border-0 text-xs">
                                Job #{chat.jobId}
                              </Badge>
                            </div>
                          )}

                          {/* Last Message */}
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm flex-1 truncate ${
                                lastMessage?.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                              }`}
                            >
                              {lastMessage ? (
                                <>
                                  {lastMessage.senderType === "user" ? "You: " : ""}
                                  {lastMessage.content}
                                </>
                              ) : (
                                "No messages yet"
                              )}
                            </p>
                            <div className="flex items-center space-x-2 ml-4">
                              {lastMessage?.isRead && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
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
