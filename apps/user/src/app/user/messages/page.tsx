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

interface ChatConversation {
  id: number
  jobId: number
  jobTitle: string
  adminId: number
  admin: {
    id: number
    name: string
    email: string
    company?: string
    avatar?: string
  }
  lastMessage: {
    id: number
    content: string
    senderId: number
    senderType: "admin" | "user"
    createdAt: string
    isRead: boolean
  }
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export default function UserMessagesPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const response = await api.get('/api/user/conversations')
        // setConversations(response.data.conversations)

        // Mock data for now
        const mockConversations: ChatConversation[] = [
          {
            id: 1,
            jobId: 31,
            jobTitle: "Full Stack Web Application Development",
            adminId: 1,
            admin: {
              id: 1,
              name: "Sarah Johnson",
              email: "sarah@techcorp.com",
              company: "TechCorp Solutions",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            lastMessage: {
              id: 15,
              content:
                "Thanks for your proposal! I'd like to discuss the timeline in more detail. When would be a good time for a call?",
              senderId: 1,
              senderType: "admin",
              createdAt: "2024-01-15T14:30:00Z",
              isRead: false,
            },
            unreadCount: 2,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T14:30:00Z",
          },
          {
            id: 2,
            jobId: 28,
            jobTitle: "E-commerce Website Redesign",
            adminId: 2,
            admin: {
              id: 2,
              name: "Michael Chen",
              email: "michael@designstudio.com",
              company: "Creative Design Studio",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            lastMessage: {
              id: 12,
              content: "Perfect! I'll send over the brand guidelines and we can get started next week.",
              senderId: 2,
              senderType: "admin",
              createdAt: "2024-01-14T16:45:00Z",
              isRead: true,
            },
            unreadCount: 0,
            createdAt: "2024-01-14T09:15:00Z",
            updatedAt: "2024-01-14T16:45:00Z",
          },
          {
            id: 3,
            jobId: 35,
            jobTitle: "Mobile App UI/UX Design",
            adminId: 3,
            admin: {
              id: 3,
              name: "Emily Rodriguez",
              email: "emily@startupventures.com",
              company: "Startup Ventures Inc",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            lastMessage: {
              id: 8,
              content:
                "Your portfolio looks impressive! Could you share some examples of mobile apps you've designed recently?",
              senderId: 3,
              senderType: "admin",
              createdAt: "2024-01-13T11:20:00Z",
              isRead: true,
            },
            unreadCount: 0,
            createdAt: "2024-01-13T08:30:00Z",
            updatedAt: "2024-01-13T11:20:00Z",
          },
          {
            id: 4,
            jobId: 42,
            jobTitle: "Data Analytics Dashboard",
            adminId: 4,
            admin: {
              id: 4,
              name: "David Kim",
              email: "david@datainsights.com",
              company: "Data Insights Co",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            lastMessage: {
              id: 5,
              content:
                "Hi! I reviewed your application and I'm interested in moving forward. Can we schedule a brief call to discuss the project requirements?",
              senderId: 4,
              senderType: "admin",
              createdAt: "2024-01-12T13:15:00Z",
              isRead: false,
            },
            unreadCount: 1,
            createdAt: "2024-01-12T10:45:00Z",
            updatedAt: "2024-01-12T13:15:00Z",
          },
          {
            id: 5,
            jobId: 39,
            jobTitle: "WordPress Plugin Development",
            adminId: 5,
            admin: {
              id: 5,
              name: "Lisa Thompson",
              email: "lisa@webagency.com",
              company: "Digital Web Agency",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            lastMessage: {
              id: 3,
              content:
                "Thank you for the detailed proposal. I'll review it with my team and get back to you by tomorrow.",
              senderId: 5,
              senderType: "admin",
              createdAt: "2024-01-11T15:30:00Z",
              isRead: true,
            },
            unreadCount: 0,
            createdAt: "2024-01-11T12:00:00Z",
            updatedAt: "2024-01-11T15:30:00Z",
          },
        ]

        setConversations(mockConversations)
      } catch (error) {
        console.error("Error fetching conversations:", error)
        toast.error("Failed to load conversations")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
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

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

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

          {/* Search */}
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
          </Card>
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
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
            {filteredConversations.map((conversation) => (
              <Link key={conversation.id} href={`/user/messages/${conversation.id}`} className="block">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={conversation.admin.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                          {conversation.admin.name
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
                              <h3 className="font-semibold text-gray-900 truncate">{conversation.admin.name}</h3>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{conversation.admin.email}</span>
                            </div>
                            {conversation.admin.company && (
                              <p className="text-xs text-gray-500 mt-1">{conversation.admin.company}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(conversation.lastMessage.createdAt)}</span>
                          </div>
                        </div>

                        {/* Job Title */}
                        <div className="mb-3">
                          <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border-0 text-xs">
                            {conversation.jobTitle}
                          </Badge>
                        </div>

                        {/* Last Message */}
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm flex-1 truncate ${
                              conversation.lastMessage.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                            }`}
                          >
                            {conversation.lastMessage.senderType === "admin" ? "" : "You: "}
                            {conversation.lastMessage.content}
                          </p>
                          <div className="flex items-center space-x-2 ml-4">
                            {conversation.lastMessage.isRead && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
