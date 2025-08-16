"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Share2,
  MoreHorizontal,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Star,
} from "lucide-react"
import Link from "next/link"

// Dummy job data
const jobData = {
  id: 1,
  title: "Cybersecurity Analyst",
  description:
    "Monitor systems for threats and improve security protocols. We are looking for an experienced cybersecurity professional to join our team and help protect our digital infrastructure. The role involves continuous monitoring of network traffic, analyzing security logs, implementing security measures, and responding to security incidents. You will work closely with our IT team to ensure our systems remain secure and compliant with industry standards.",
  image: "/placeholder.svg?height=300&width=600",
  baseBiddingPrice: 800,
  isBiddingEnabled: true,
  technologies: ["Wireshark", "Kali Linux", "Splunk"],
  minimumRequirements: ["2+ years experience", "Certifications like CEH"],
  createdAt: "2025-07-06T11:43:45.829Z",
  updatedAt: "2025-07-10T17:01:42.487Z",
  adminId: 1,
  status: "active",
  category: "Cybersecurity",
  experienceLevel: "intermediate",
  deadline: "2025-08-15",
  applicationsCount: 12,
  viewsCount: 156,
}

// Mock applications data
const applications = [
  {
    id: 1,
    freelancer: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      completedJobs: 23,
    },
    bidAmount: 750,
    proposal: "I have 3+ years of experience in cybersecurity with CEH certification...",
    submittedAt: "2025-01-12T10:30:00Z",
    status: "pending",
  },
  {
    id: 2,
    freelancer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      completedJobs: 31,
    },
    bidAmount: 820,
    proposal: "Cybersecurity expert with CISSP certification and 5+ years experience...",
    submittedAt: "2025-01-11T14:20:00Z",
    status: "shortlisted",
  },
  {
    id: 3,
    freelancer: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      completedJobs: 18,
    },
    bidAmount: 780,
    proposal: "Specialized in network security and threat analysis...",
    submittedAt: "2025-01-10T09:15:00Z",
    status: "pending",
  },
]

export default function JobDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case "shortlisted":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Shortlisted</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Skilted
                </span>
                <Badge variant="secondary" className="ml-2">
                  Admin
                </Badge>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/jobs" className="text-gray-900 font-medium">
                  Jobs
                </Link>
                <Link href="/users" className="text-gray-600 hover:text-gray-900">
                  Users
                </Link>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@skilted.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{jobData.title}</h1>
                {getStatusBadge(jobData.status)}
              </div>
              <p className="text-gray-600">
                Job ID: #{jobData.id} • Created {formatDate(jobData.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview as Freelancer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Applications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Archive Job
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Image */}
              <Card>
                <CardContent className="p-0">
                  <img
                    src={jobData.image || "/placeholder.svg?height=300&width=600"}
                    alt={jobData.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>

              {/* Job Details Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
                    </CardContent>
                  </Card>

                  {/* Technologies */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Technologies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {jobData.technologies.map((tech) => (
                          <Badge key={tech} className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Minimum Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {jobData.minimumRequirements.map((req, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="applications" className="space-y-6">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={application.freelancer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {application.freelancer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{application.freelancer.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{application.freelancer.rating}</span>
                                </div>
                                <span>{application.freelancer.completedJobs} jobs completed</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(application.bidAmount)}
                            </div>
                            {getStatusBadge(application.status)}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{application.proposal}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Submitted {formatDate(application.submittedAt)}</span>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New application received</p>
                          <p className="text-xs text-gray-500">Sarah Johnson submitted a proposal</p>
                        </div>
                        <span className="text-xs text-gray-400">2h ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Job updated</p>
                          <p className="text-xs text-gray-500">Description and requirements modified</p>
                        </div>
                        <span className="text-xs text-gray-400">1d ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Job published</p>
                          <p className="text-xs text-gray-500">Job went live on the platform</p>
                        </div>
                        <span className="text-xs text-gray-400">4d ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Views</span>
                    </div>
                    <span className="font-semibold">{jobData.viewsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Applications</span>
                    </div>
                    <span className="font-semibold">{jobData.applicationsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Avg. Bid</span>
                    </div>
                    <span className="font-semibold">$783</span>
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <p className="text-sm text-gray-900">{jobData.category}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Base Price</Label>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(jobData.baseBiddingPrice)}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Experience Level</Label>
                    <p className="text-sm text-gray-900 capitalize">{jobData.experienceLevel}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Deadline</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{formatDate(jobData.deadline)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bidding</Label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{jobData.isBiddingEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{formatDate(jobData.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Job Details
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Applications
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Job
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Job
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
