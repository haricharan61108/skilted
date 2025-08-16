"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Star,
  Clock,
} from "lucide-react"
import Link from "next/link"

// Mock data
const dashboardStats = [
  {
    title: "Total Jobs",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Briefcase,
    color: "text-blue-600",
  },
  {
    title: "Active Users",
    value: "5,678",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Revenue",
    value: "$89,432",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600",
  },
  {
    title: "Completion Rate",
    value: "94.2%",
    change: "+2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-pink-600",
  },
]

const recentUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    jobs: 23,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    jobs: 31,
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "UI/UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.7,
    jobs: 18,
    status: "inactive",
    joinDate: "2024-01-08",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    jobs: 27,
    status: "active",
    joinDate: "2024-01-05",
  },
]

const recentJobs = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "TechCorp Inc.",
    freelancer: "Sarah Johnson",
    budget: "$2,500",
    status: "in-progress",
    deadline: "2024-02-15",
  },
  {
    id: 2,
    title: "Mobile App UI Design",
    client: "StartupXYZ",
    freelancer: "Emily Davis",
    budget: "$1,800",
    status: "completed",
    deadline: "2024-01-30",
  },
  {
    id: 3,
    title: "API Development",
    client: "DataFlow Ltd.",
    freelancer: "Alex Rodriguez",
    budget: "$3,200",
    status: "pending",
    deadline: "2024-02-20",
  },
]

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  // Fix hydration error by setting date only on client side
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString())
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
                <Link href="/admin/dashboard" className="text-gray-900 font-medium">
                  Dashboard
                </Link>
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                  Jobs
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                  Users
                </Link>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Add Job Button */}
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                asChild
              >
                <Link href="/admin/add-job">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Link>
              </Button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h1>
              <p className="text-gray-600 mt-1">Here's what's happening on your platform today.</p>
            </div>
            <div className="text-sm text-gray-500">Last updated: {currentDate || "Loading..."}</div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Recent Users</TabsTrigger>
              <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used admin functions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                      <Link href="/admin/add-job">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Job Posting
                      </Link>
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage User Accounts
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics Report
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Platform Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest platform activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-gray-500">Sarah Johnson joined as Frontend Developer</p>
                      </div>
                      <span className="text-xs text-gray-400">2m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Job completed</p>
                        <p className="text-xs text-gray-500">E-commerce project delivered successfully</p>
                      </div>
                      <span className="text-xs text-gray-400">1h ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment processed</p>
                        <p className="text-xs text-gray-500">$2,500 payment completed</p>
                      </div>
                      <span className="text-xs text-gray-400">3h ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New job posted</p>
                        <p className="text-xs text-gray-500">Mobile App UI Design project added</p>
                      </div>
                      <span className="text-xs text-gray-400">5h ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Newly registered freelancers and clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Jobs</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{user.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.jobs}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                  <CardDescription>Latest job postings and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.client}</TableCell>
                          <TableCell>{job.freelancer}</TableCell>
                          <TableCell>{job.budget}</TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
