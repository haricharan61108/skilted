"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Heart, Briefcase, ArrowRight, Clock } from "lucide-react"
import { toast } from "sonner"
import api from "@/config"

interface Job {
  id: number
  title: string
  description: string
  image?: string
  baseBiddingPrice: number
  isBiddingEnabled: boolean
  technologies: string[]
  category?: string
  deadline?: string
  experienceLevel?: string
  createdAt: string
}

interface SavedJob {
  id?: number
  job: Job
}

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/api/user/saved-jobs')
        setSavedJobs(response.data.savedJobs)
      } catch (error) {
        console.error("Error fetching saved jobs:", error)
        toast.error("Failed to load saved jobs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedJobs()
  }, [])

  const handleUnsaveJob = async (jobId: number) => {
    try {
      await api.delete(`/api/user/unsave-job/${jobId}`)
      setSavedJobs(savedJobs.filter((savedJob) => savedJob.job.id !== jobId))
      toast.success("Job removed from saved!")
    } catch (error) {
      console.error("Error unsaving job:", error)
      toast.error("Failed to unsave job")
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
      year: "numeric",
      month: "short",
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

  const filteredJobs = savedJobs.filter((savedJob) => {
    const matchesSearch =
      savedJob.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      savedJob.job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || savedJob.job.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search saved jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Saved Jobs */}
      {filteredJobs.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || categoryFilter !== "all" ? "No saved jobs found" : "No saved jobs yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "Save jobs to view them here later."}
            </p>
            <Link href="/user/getJobs">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                <Search className="w-4 h-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((savedJob) => {
            const daysLeft = savedJob.job.deadline ? getDaysUntilDeadline(savedJob.job.deadline) : 0

            return (
              <Card
                key={savedJob.job.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Job Image */}
                {savedJob.job.image && (
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-200 to-cyan-200">
                    <img
                      src={savedJob.job.image || "/placeholder.svg"}
                      alt={savedJob.job.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">
                        {savedJob.job.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsaveJob(savedJob.job.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {savedJob.job.category && (
                        <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border-0">
                          {savedJob.job.category}
                        </Badge>
                      )}
                      {savedJob.job.experienceLevel && (
                        <Badge className={getExperienceBadgeColor(savedJob.job.experienceLevel)}>
                          {savedJob.job.experienceLevel.charAt(0).toUpperCase() + savedJob.job.experienceLevel.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{savedJob.job.description}</p>

                  {/* Price and Bidding */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(savedJob.job.baseBiddingPrice)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {savedJob.job.isBiddingEnabled ? "Starting bid" : "Fixed price"}
                      </p>
                    </div>
                  </div>

                  {/* Technologies */}
                  {savedJob.job.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {savedJob.job.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-100"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {savedJob.job.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{savedJob.job.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Info and Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {savedJob.job.deadline && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span className={daysLeft > 0 ? "text-green-600" : "text-red-600"}>
                            {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link href={`/user/job/${savedJob.job.id}`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
