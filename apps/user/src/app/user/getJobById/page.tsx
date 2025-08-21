"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  CheckCircle,
  Heart,
  Share2,
  Flag,
  Briefcase,
  Star,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react"
import Navbar from "@/components/navbar"
import { toast } from "sonner"

// Mock job data - replace with actual API call
const mockJobData = {
  id: 1,
  title: "Senior React Developer",
  description: `We are looking for an experienced React developer to build a modern e-commerce platform. This is a comprehensive project that involves creating a full-featured online store with advanced functionality.

The ideal candidate will have extensive experience with React, TypeScript, and modern web development practices. You'll be working on a cutting-edge e-commerce platform that serves thousands of users daily.

Key responsibilities include:
- Developing responsive and interactive user interfaces
- Implementing complex state management solutions
- Integrating with RESTful APIs and GraphQL endpoints
- Ensuring optimal performance and user experience
- Writing comprehensive tests and documentation
- Collaborating with our design and backend teams

This is an excellent opportunity to work on a high-impact project with a growing company. We value clean code, innovative solutions, and attention to detail.`,
  image: "/placeholder.svg?height=400&width=800&text=React+E-commerce+Platform",
  baseBiddingPrice: 2500.0,
  isBiddingEnabled: true,
  technologies: ["React", "TypeScript", "Node.js", "MongoDB", "GraphQL", "Redux", "Tailwind CSS", "Jest"],
  minimumRequirements: [
    "3+ years of React development experience",
    "Strong TypeScript proficiency",
    "Experience with e-commerce platforms",
    "Knowledge of modern testing frameworks",
    "Understanding of responsive design principles",
    "Experience with version control (Git)",
    "Strong problem-solving skills",
  ],
  category: "Web Development",
  deadline: "2025-02-15T00:00:00Z",
  experienceLevel: "senior",
  createdAt: "2025-01-10T10:00:00Z",
  updatedAt: "2025-01-12T15:30:00Z",
  adminId: 1,
  admin: {
    email: "sarah.johnson@techcorp.com",
    name: "Sarah Johnson",
    company: "TechCorp Solutions",
    rating: 4.9,
    jobsPosted: 23,
    verified: true,
  },
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState(mockJobData)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // TODO: Replace with actual API call
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // const response = await fetch(`/api/jobs/${params.id}`)
        // const jobData = await response.json()
        // setJob(jobData)
      } catch (error) {
        console.error("Error fetching job:", error)
        toast.error("Failed to load job details")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "intermediate":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "senior":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100"
      case "expert":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? "Job removed from saved" : "Job saved successfully!")
  }

  const handleApplyJob = () => {
    // TODO: Navigate to application form or open modal
    toast.success("Redirecting to application form...")
    router.push(`/user/getJobs/${params.id}/apply`)
  }

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Job link copied to clipboard!")
  }

  const handleReportJob = () => {
    toast.success("Job reported. We'll review it shortly.")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const daysLeft = getDaysUntilDeadline(job.deadline || "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/user/getJobs">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        {/* Job Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{job.title}</h1>
                {job.category && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
                    {job.category}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Remote</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className={daysLeft > 0 ? "text-green-600" : "text-red-600"}>
                      {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                    </span>
                  </div>
                )}
                <Badge className={getExperienceBadgeColor(job.experienceLevel || "")}>
                  {job.experienceLevel?.charAt(0).toUpperCase() + job.experienceLevel?.slice(1)}
                </Badge>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(job.baseBiddingPrice)}</div>
              <div className="text-sm text-gray-600">
                {job.isBiddingEnabled ? "Starting bid • Bidding enabled" : "Fixed price • No bidding"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleSaveJob}
                className={`${isSaved ? "bg-red-50 border-red-200 text-red-600" : ""}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save Job"}
              </Button>

              <Button variant="outline" onClick={handleShareJob}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={handleApplyJob}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Image */}
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <img
                  src={job.image || "/placeholder.svg?height=400&width=800"}
                  alt={job.title}
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Job Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <div className={`${!showFullDescription ? "line-clamp-6" : ""}`}>
                    {job.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {job.description.length > 500 && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Required Technologies */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Required Technologies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {job.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border-0 px-3 py-1"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Minimum Requirements */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>Minimum Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.minimumRequirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Client Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      {job.admin.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "CL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{job.admin.name || "Client"}</h3>
                      {job.admin.verified && <Shield className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{job.admin.company || "Company"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{job.admin.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{job.admin.rating || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Jobs Posted</span>
                    <span className="text-sm font-medium">{job.admin.jobsPosted || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Statistics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Job Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Job ID</span>
                  <span className="text-sm font-medium">#{job.id}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(job.baseBiddingPrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bidding</span>
                  <Badge className={job.isBiddingEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {job.isBiddingEnabled ? "Enabled" : "Fixed Price"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <Badge className={getExperienceBadgeColor(job.experienceLevel || "")}>
                    {job.experienceLevel?.charAt(0).toUpperCase() + job.experienceLevel?.slice(1)}
                  </Badge>
                </div>

                {job.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <span className="text-sm font-medium">{formatDate(job.deadline)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">{formatDate(job.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleApplyJob}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  Apply for this Job
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSaveJob}
                  className={`w-full ${isSaved ? "bg-red-50 border-red-200 text-red-600" : ""}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Remove from Saved" : "Save for Later"}
                </Button>

                <Button variant="outline" onClick={handleShareJob} className="w-full bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Job
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReportJob}
                  className="w-full text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
