"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, DollarSign, MapPin, Search, Heart, Calendar, Briefcase, Star, Users } from "lucide-react"
import api from "@/config"

interface Job {
  id: string
  title: string
  category: string
  baseBiddingPrice: number
  deadline: string
  experienceLevel: string
  image: string
  createdAt: string
}

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  useEffect(()=> {
    const fetchJobs = async()=> {
        try {
            setLoading(true);
            const res = await api.get("/api/user/get-all-jobs");

            if(!res.data.jobs) {
                throw new Error("Failed to fetch jobs")
            }

            setJobs(res.data.jobs || []);

            setLoading(false);

        } catch (error) {
            console.error("Error fetching jobs:", error)
            setJobs([])
            setLoading(false)
        }
    }

    fetchJobs();
  },[])
  

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSaved = new Set(prev)
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId)
      } else {
        newSaved.add(jobId)
      }
      return newSaved
    })
  }

  const getExperienceBadgeColor = (level: string | null) => {
    if (!level) {
        return "bg-gray-100 text-gray-700 hover:bg-gray-200"; 
      }
    switch (level.toLowerCase()) {
      case "entry":
        return "bg-green-100 text-green-700 hover:bg-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      case "expert":
        return "bg-red-100 text-red-700 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    const matchesExperience = selectedExperience === "all" || job.experienceLevel === selectedExperience

    return matchesSearch && matchesCategory && matchesExperience
  })

  const categories = [...new Set(jobs.map((job) => job.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50">
      <Navbar />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
              <p className="text-gray-600">Discover amazing opportunities that match your skills</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$2.1K</p>
                  <p className="text-sm text-gray-600">Avg. Budget</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-600">Client Rating</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Active Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="w-full sm:w-48 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Entry">Entry Level</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-pulse">
                <CardHeader className="p-0">
                  <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const daysLeft = getDaysUntilDeadline(job.deadline)
              return (
                <Card
                  key={job.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader className="p-0 relative">
                    <img
                      src={job.image || "/placeholder.svg"}
                      alt={job.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-sm transition-all ${
                        savedJobs.has(job.id)
                          ? "bg-red-100/80 text-red-600 hover:bg-red-200/80"
                          : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-600"
                      }`}
                      onClick={() => toggleSaveJob(job.id)}
                    >
                      <Heart className={`w-4 h-4 ${savedJobs.has(job.id) ? "fill-current" : ""}`} />
                    </Button>
                    <div className="absolute bottom-3 left-3">
                      <Badge className={getExperienceBadgeColor(job.experienceLevel)}>{job.experienceLevel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{job.category}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">${job.baseBiddingPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {formatDate(job.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Remote</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedExperience("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
