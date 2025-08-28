"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Clock,
  DollarSign,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Award,
  Globe,
  Github,
  Linkedin,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Users,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"


const mockApplications = [
  {
    id: 1,
    userId: 1,
    bidAmount: 2200,
    proposal:
      "I'm excited to work on your e-commerce platform project. With over 6 years of experience in full-stack development, I've built numerous e-commerce solutions using React, Node.js, and modern payment integrations. I can deliver a scalable, secure, and user-friendly platform that meets all your requirements. My approach includes thorough planning, agile development, and comprehensive testing to ensure quality delivery.",
    estimatedDuration: "6-8 weeks",
    submittedAt: "2024-01-20T10:30:00Z",
    status: "pending",
    profile: {
      id: 1,
      userId: 1,
      name: "Sarah Johnson",
      profilePicture: null,
      title: "Senior Full-Stack Developer",
      bio: "Passionate full-stack developer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. I love turning complex problems into simple, beautiful solutions.",
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Stripe API", "Docker", "GraphQL"],
      languages: ["English", "Spanish"],
      education: "Computer Science, Stanford University",
      certifications: ["AWS Solutions Architect", "Google Cloud Professional", "MongoDB Certified Developer"],
      workHistory: "Senior Developer at TechCorp (2021-2024), Full-Stack Developer at StartupXYZ (2019-2021)",
      availability: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        github: "https://github.com/sarahjohnson",
        portfolio: "https://sarahjohnson.dev",
      },
      createdAt: "2023-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:20:00Z",
    },
    freelancerStats: {
      rating: 4.9,
      completedJobs: 47,
      totalEarnings: 125000,
      responseTime: "2 hours",
      successRate: 98,
    },
  },
  {
    id: 2,
    userId: 2,
    bidAmount: 2500,
    proposal:
      "Hello! I'm a seasoned e-commerce developer with extensive experience in building high-performance online stores. I've worked with major brands to create conversion-optimized platforms that handle high traffic volumes. My expertise includes advanced payment gateway integration, inventory management systems, and mobile-first responsive design. I'm confident I can exceed your expectations on this project.",
    estimatedDuration: "5-7 weeks",
    submittedAt: "2024-01-19T15:45:00Z",
    status: "shortlisted",
    profile: {
      id: 2,
      userId: 2,
      name: "Marcus Rodriguez",
      profilePicture: null,
      title: "E-commerce Specialist & Full-Stack Developer",
      bio: "E-commerce expert with 8+ years of experience. I've helped businesses increase their online revenue by 300% through optimized user experiences and robust backend systems.",
      skills: [
        "React",
        "Vue.js",
        "Node.js",
        "Python",
        "PostgreSQL",
        "Redis",
        "Shopify",
        "WooCommerce",
        "Stripe",
        "PayPal",
      ],
      languages: ["English", "Spanish", "Portuguese"],
      education: "Software Engineering, MIT",
      certifications: ["Shopify Partner", "AWS Certified", "Google Analytics Certified", "Stripe Certified"],
      workHistory: "Lead Developer at E-commerce Solutions Inc (2020-2024), Senior Developer at RetailTech (2018-2020)",
      availability: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/marcusrodriguez",
        github: "https://github.com/marcusrodriguez",
        portfolio: "https://marcusdev.com",
      },
      createdAt: "2023-02-10T08:45:00Z",
      updatedAt: "2024-01-19T16:30:00Z",
    },
    freelancerStats: {
      rating: 4.8,
      completedJobs: 62,
      totalEarnings: 180000,
      responseTime: "1 hour",
      successRate: 96,
    },
  },
  {
    id: 3,
    userId: 3,
    bidAmount: 1950,
    proposal:
      "I'm interested in your e-commerce project and believe I can deliver exceptional results. As a full-stack developer with strong expertise in modern web technologies, I focus on creating fast, secure, and scalable applications. I have experience with payment processing, inventory management, and creating intuitive user interfaces that drive conversions. Let's discuss how I can bring your vision to life.",
    estimatedDuration: "7-9 weeks",
    submittedAt: "2024-01-18T09:20:00Z",
    status: "pending",
    profile: {
      id: 3,
      userId: 3,
      name: "Emily Chen",
      profilePicture: null,
      title: "Full-Stack Developer & UI/UX Designer",
      bio: "Creative developer who combines technical expertise with design thinking. I create beautiful, functional web applications that users love and businesses profit from.",
      skills: ["React", "Next.js", "Node.js", "MongoDB", "Figma", "Tailwind CSS", "Firebase", "Vercel"],
      languages: ["English", "Mandarin", "Japanese"],
      education: "Computer Science & Design, UC Berkeley",
      certifications: ["Google UX Design Certificate", "Meta Frontend Developer", "MongoDB University"],
      workHistory: "Senior Developer at DesignTech (2021-2024), Full-Stack Developer at CreativeStudio (2019-2021)",
      availability: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/emilychen",
        github: "https://github.com/emilychen",
        dribbble: "https://dribbble.com/emilychen",
      },
      createdAt: "2023-03-05T12:20:00Z",
      updatedAt: "2024-01-18T10:45:00Z",
    },
    freelancerStats: {
      rating: 4.7,
      completedJobs: 34,
      totalEarnings: 89000,
      responseTime: "3 hours",
      successRate: 94,
    },
  },
  {
    id: 4,
    userId: 4,
    bidAmount: 2800,
    proposal:
      "Greetings! I'm a senior full-stack developer with deep expertise in e-commerce development. I've architected and built enterprise-level platforms that handle millions in transactions. My approach emphasizes security, scalability, and performance optimization. I use cutting-edge technologies and best practices to ensure your platform can grow with your business. I'd love to discuss your specific requirements in detail.",
    estimatedDuration: "4-6 weeks",
    submittedAt: "2024-01-17T14:10:00Z",
    status: "pending",
    profile: {
      id: 4,
      userId: 4,
      name: "David Kim",
      profilePicture: null,
      title: "Senior Full-Stack Developer & DevOps Engineer",
      bio: "Enterprise-level developer with 10+ years of experience. I specialize in building high-performance, scalable applications that can handle massive traffic and complex business logic.",
      skills: ["React", "Node.js", "Python", "Go", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Terraform"],
      languages: ["English", "Korean"],
      education: "Computer Engineering, Carnegie Mellon University",
      certifications: [
        "AWS Solutions Architect Professional",
        "Kubernetes Administrator",
        "Docker Certified Associate",
      ],
      workHistory: "Principal Engineer at CloudTech (2022-2024), Senior Developer at DataFlow Systems (2019-2022)",
      availability: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/davidkim",
        github: "https://github.com/davidkim",
      },
      createdAt: "2023-01-28T14:15:00Z",
      updatedAt: "2024-01-17T15:30:00Z",
    },
    freelancerStats: {
      rating: 4.9,
      completedJobs: 71,
      totalEarnings: 245000,
      responseTime: "1 hour",
      successRate: 99,
    },
  },
  {
    id: 5,
    userId: 5,
    bidAmount: 2100,
    proposal:
      "Hi there! I'm excited about your e-commerce platform project. With my background in both frontend and backend development, I can create a comprehensive solution that's both beautiful and powerful. I have extensive experience with payment integrations, inventory management, and creating responsive designs that work perfectly across all devices. I'm committed to delivering high-quality code and excellent user experiences.",
    estimatedDuration: "6-8 weeks",
    submittedAt: "2024-01-16T11:30:00Z",
    status: "rejected",
    profile: {
      id: 5,
      userId: 5,
      name: "Alexandra Popov",
      profilePicture: null,
      title: "Full-Stack Developer & E-commerce Consultant",
      bio: "Results-driven developer with a passion for e-commerce. I help businesses maximize their online potential through well-crafted digital solutions and strategic technical consulting.",
      skills: ["React", "Angular", "Node.js", "PHP", "MySQL", "Magento", "WooCommerce", "Stripe", "PayPal"],
      languages: ["English", "Russian", "German"],
      education: "Information Systems, Oxford University",
      certifications: ["Magento Certified Developer", "WooCommerce Expert", "Google Analytics Certified"],
      workHistory:
        "E-commerce Consultant at Digital Solutions (2020-2024), Senior Developer at OnlineRetail (2018-2020)",
      availability: false,
      socialLinks: {
        linkedin: "https://linkedin.com/in/alexandrapopov",
        github: "https://github.com/alexandrapopov",
      },
      createdAt: "2023-04-12T09:30:00Z",
      updatedAt: "2024-01-16T12:15:00Z",
    },
    freelancerStats: {
      rating: 4.6,
      completedJobs: 28,
      totalEarnings: 67000,
      responseTime: "4 hours",
      successRate: 91,
    },
  },
]

const mockJobData = {
  id: 1,
  title: "Advanced E-commerce Platform Development",
  category: "Web Development",
  baseBiddingPrice: 2500,
  applicationsCount: 5,
  averageBid: 2310,
  status: "active",
}

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState(mockApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const params = useParams()

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString())
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case "shortlisted":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Shortlisted</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const handleStatusChange = (applicationId: number, newStatus: string) => {
    setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))
    toast.success(`Application ${newStatus} successfully`)
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profile.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.proposal.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      case "highest-bid":
        return b.bidAmount - a.bidAmount
      case "lowest-bid":
        return a.bidAmount - b.bidAmount
      case "rating":
        return b.freelancerStats.rating - a.freelancerStats.rating
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <Link href={`/jobs/${params.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
              <p className="text-gray-600 mt-1">
                {mockJobData.title} • {applications.length} applications received
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message All
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Bid</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockJobData.averageBid)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((app) => app.status === "shortlisted").length}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(
                        applications.reduce((acc, app) => acc + app.freelancerStats.rating, 0) / applications.length
                      ).toFixed(1)}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search applications by name, title, or proposal..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest-bid">Highest Bid</SelectItem>
                      <SelectItem value="lowest-bid">Lowest Bid</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {sortedApplications.map((application) => (
              <Card key={application.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={application.profile.profilePicture || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg font-semibold">
                          {application.profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{application.profile.name}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{application.profile.title}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{application.freelancerStats.rating}</span>
                            <span>({application.freelancerStats.completedJobs} jobs)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Responds in {application.freelancerStats.responseTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{application.freelancerStats.successRate}% success rate</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {application.profile.skills.slice(0, 6).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.profile.skills.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{application.profile.skills.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatCurrency(application.bidAmount)}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">in {application.estimatedDuration}</p>
                      <p className="text-xs text-gray-400">Submitted {getTimeAgo(application.submittedAt)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed line-clamp-3">{application.proposal}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application)
                          setIsDetailModalOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {application.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStatusChange(application.id, "shortlisted")}
                          >
                            <Award className="w-4 h-4 mr-1" />
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(application.id, "accepted")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(application.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {application.status === "shortlisted" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(application.id, "accepted")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(application.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Briefcase className="mr-2 h-4 w-4" />
                            View Portfolio
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedApplications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No applications have been submitted for this job yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Application Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Application Details</DialogTitle>
                <DialogDescription>Detailed view of {selectedApplication.profile.name}'s application</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Freelancer Info */}
                <div className="flex items-start space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedApplication.profile.profilePicture || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl font-semibold">
                      {selectedApplication.profile.name
                        .split(" ")
                        .map((n:any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedApplication.profile.name}</h3>
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                    <p className="text-lg text-gray-600 font-medium mb-3">{selectedApplication.profile.title}</p>
                    <p className="text-gray-700 leading-relaxed mb-4">{selectedApplication.profile.bio}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{selectedApplication.freelancerStats.rating}</span>
                        <span className="text-gray-500">
                          ({selectedApplication.freelancerStats.completedJobs} jobs completed)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">
                          {formatCurrency(selectedApplication.freelancerStats.totalEarnings)} earned
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span>Responds in {selectedApplication.freelancerStats.responseTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>{selectedApplication.freelancerStats.successRate}% success rate</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-3">
                      {selectedApplication.profile.socialLinks?.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedApplication.profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="w-4 h-4 mr-1" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {selectedApplication.profile.socialLinks?.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedApplication.profile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4 mr-1" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {selectedApplication.profile.socialLinks?.portfolio && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedApplication.profile.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {formatCurrency(selectedApplication.bidAmount)}
                    </div>
                    <p className="text-gray-600 mb-1">Delivery: {selectedApplication.estimatedDuration}</p>
                    <p className="text-sm text-gray-500">Submitted {formatDate(selectedApplication.submittedAt)}</p>
                  </div>
                </div>

                <Tabs defaultValue="proposal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="proposal">Proposal</TabsTrigger>
                    <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
                    <TabsTrigger value="education">Education & Certs</TabsTrigger>
                    <TabsTrigger value="work-history">Work History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="proposal" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cover Letter</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {selectedApplication.proposal}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.profile.skills.map((skill:any) => (
                            <Badge key={skill} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Languages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.profile.languages.map((language:any) => (
                            <Badge key={language} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedApplication.profile.education}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Certifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedApplication.profile.certifications.map((cert:any, index:any) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-yellow-600" />
                              <span className="text-gray-700">{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="work-history" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Experience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{selectedApplication.profile.workHistory}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedApplication.status === "pending" && (
                    <>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          handleStatusChange(selectedApplication.id, "shortlisted")
                          setIsDetailModalOpen(false)
                        }}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Shortlist
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleStatusChange(selectedApplication.id, "accepted")
                          setIsDetailModalOpen(false)
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                    </>
                  )}
                  {selectedApplication.status === "shortlisted" && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleStatusChange(selectedApplication.id, "accepted")
                        setIsDetailModalOpen(false)
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Application
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
