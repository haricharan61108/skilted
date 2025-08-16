"use client"
import { BACKEND_URL } from "config"
import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit,
  Share2,
  Eye,
  Users,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  Trophy,
  DollarSign,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"

interface Job {
  id: number
  title: string
  description: string
  image: string
  baseBiddingPrice: number
  isBiddingEnabled: boolean
  technologies: string[]
  minimumRequirements: string[]
  createdAt: string
  updatedAt: string
  adminId: number
  status: string
  category: string
  experienceLevel: string
  deadline: string
  applicationsCount: number
  viewsCount: number
  averageBid: number
  applications?: Application[]
}

interface Application {
  id: number
  freelancer: {
    name: string
    avatar: string
    rating: number
    completedJobs: number
    specialization: string
  }
  bidAmount: number
  proposal: string
  submittedAt: string
  status: string
  estimatedDuration: string
}

export default function AdminJobDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentDate, setCurrentDate] = useState("")
  const [jobData, setJobData] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BACKEND_URL}/api/admin/get-job/${params.id}`, {
          withCredentials: true,
        })
        if (response.status !== 200) {
          throw new Error("Failed to fetch job details")
        }
        const data = response.data
        console.log("Base Bidding price is " + data.baseBiddingPrice)
        setJobData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast.error("Failed to load job details")
      } finally {
        setLoading(false)
      }
    }
    fetchJobDetails()
    setCurrentDate(new Date().toLocaleDateString())
  }, [params.id])

  // Add loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading job</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button
            onClick={() => router.push("/admin/dashboard")}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Job not found</h3>
          <p className="mt-2 text-gray-600">The requested job could not be found.</p>
          <Button
            onClick={() => router.push("/admin/dashboard")}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
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
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
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
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
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
                <input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
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

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Job Created Successfully!</h3>
              <p className="text-sm text-green-700">Your job posting is now live and visible to freelancers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/admin/dashboard">
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
                Job ID: #{params.id} • Created {currentDate} • {jobData.category}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                <Users className="w-4 h-4 mr-2" />
                View Applications ({jobData.applicationsCount})
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
                  <DropdownMenuItem>
                    <Trophy className="mr-2 h-4 w-4" />
                    Promote Job
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
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative">
                  <img
                    src={jobData.image || "/placeholder.svg?height=300&width=600"}
                    alt={jobData.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        {jobData.category}
                      </Badge>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        {jobData.experienceLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 py-6">
                      <CardTitle className="flex items-center space-x-2 text-xl">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <span>Job Description</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 leading-relaxed text-lg">{jobData.description}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6">
                      <CardTitle className="flex items-center space-x-2 text-xl">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span>Required Technologies</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-3">
                        {jobData.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 hover:from-purple-200 hover:to-pink-200 px-3 py-1 text-sm font-medium"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 py-6">
                      <CardTitle className="flex items-center space-x-2 text-xl">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span>Minimum Requirements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {jobData.minimumRequirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
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
                          <p className="text-sm font-medium">Job created successfully</p>
                          <p className="text-xs text-gray-500">Job posting went live on the platform</p>
                        </div>
                        <span className="text-xs text-gray-400">Just now</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 py-6">
                  <CardTitle className="text-xl">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium text-purple-700">Budget Range</Label>
                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(jobData.baseBiddingPrice)}+</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Experience Level</Label>
                    <p className="text-sm text-gray-900 capitalize font-medium">{jobData.experienceLevel}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Project Deadline</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900 font-medium">{formatDate(jobData.deadline)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bidding Status</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span
                        className={`text-sm font-medium ${jobData.isBiddingEnabled ? "text-green-700" : "text-red-700"}`}
                      >
                        {jobData.isBiddingEnabled ? "Open for Bids" : "Bidding Closed"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 py-6">
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Job Details
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Review Applications
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Job
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-yellow-100"
                    variant="outline"
                  >
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
