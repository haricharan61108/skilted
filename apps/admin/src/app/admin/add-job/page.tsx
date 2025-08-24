"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Upload, X, DollarSign, Settings, LogOut, Bell, Search, Save, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"
import { BACKEND_URL } from "config"
// Available technologies
const availableTechnologies = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Django",
  "Flask",
  "JavaScript",
  "TypeScript",
  "PHP",
  "Laravel",
  "WordPress",
  "Shopify",
  "HTML/CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Figma",
  "Adobe XD",
  "Photoshop",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "AWS",
  "Docker",
  "Git",
]

// Job categories
const jobCategories = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "E-commerce Development",
  "WordPress Development",
  "API Development",
  "Database Design",
  "DevOps & Deployment",
]

const defaultCategoryImages: Record<string, string> = {
  "Web Development": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755948955/Web-development_wtrmzq.jpg",
  "Mobile App Development": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755930391/App-development_npt4fb.jpg",
  "UI/UX Design": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755943193/ui-ux_rubywt.jpg",
  "E-commerce Development": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755930790/e-commerce_yo5uku.jpg",
  "WordPress Development": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755930885/wordpress_nkd7uh.jpg",
  "API Development": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755949141/Api-deployement_saq31z.png",
  "Database Design": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755930631/Database-Design_xjpxsy.jpg",
  "DevOps & Deployment": "https://res.cloudinary.com/dw2qamkjb/image/upload/v1756030946/Devops_hqbota.jpg",
};


export default function AddJobPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    baseBiddingPrice: "",
    isBiddingEnabled: true,
    minimumRequirements: "",
    deadline: "",
    experienceLevel: "",
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTechnologyAdd = (tech: string) => {
    if (!selectedTechnologies.includes(tech)) {
      setSelectedTechnologies((prev) => [...prev, tech])
    }
  }

  const handleTechnologyRemove = (tech: string) => {
    setSelectedTechnologies((prev) => prev.filter((t) => t !== tech))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const finalImage = imagePreview || defaultCategoryImages[formData.category] || "https://res.cloudinary.com/dw2qamkjb/image/upload/v1755930671/default_qdjbcm.jpg";
      console.log("Image url is ", finalImage);
      const response = await axios.post(`${BACKEND_URL}/api/admin/add-job`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        baseBiddingPrice: formData.baseBiddingPrice,
        isBiddingEnabled: formData.isBiddingEnabled,
        minimumRequirements: [formData.minimumRequirements],
        deadline: formData.deadline,
        experienceLevel: formData.experienceLevel,
        technologies: selectedTechnologies,
        image: finalImage,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      toast.success("Job Created Successfully!", {
        description: "Your job posting has been created and is now live.",
        duration: 3000,
      });
  
      const jobId = response.data.job?.id || response.data.id || 1;
      setTimeout(() => {
        router.push(`/admin/${jobId}`);
      }, 1500);
    } catch (error: any) {
      console.error("Submission failed:", error.response?.data || error.message);
      toast.error("Failed to Create Job", {
        description: error.response?.data?.message || error.message || "Please try again.",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Job</h3>
            <p className="text-gray-600 mb-4">Please wait while we process your job posting...</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
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
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
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
                <Input
                  placeholder="Search..."
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
              <p className="text-gray-600 mt-1">Fill in the details to post a new job on the platform</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about the job posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., E-commerce Website Development"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select job category" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Job Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of the project requirements, goals, and expectations..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumRequirements" className="text-sm font-medium">
                    Minimum Requirements *
                  </Label>
                  <Textarea
                    id="minimumRequirements"
                    name="minimumRequirements"
                    placeholder="List the minimum qualifications, experience, and skills required for this job..."
                    value={formData.minimumRequirements}
                    onChange={handleInputChange}
                    required
                    className="min-h-[100px] border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Image */}
            <Card>
              <CardHeader>
                <CardTitle>Project Image</CardTitle>
                <CardDescription>Upload an image to represent this job (optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setImagePreview(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Required Technologies</CardTitle>
                <CardDescription>Select the technologies and skills needed for this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTechnologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleTechnologyRemove(tech)}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <Select onValueChange={handleTechnologyAdd}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Add technologies..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTechnologies
                      .filter((tech) => !selectedTechnologies.includes(tech))
                      .map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Pricing & Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Settings</CardTitle>
                <CardDescription>Configure pricing and bidding options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="baseBiddingPrice" className="text-sm font-medium">
                      Base Bidding Price *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="baseBiddingPrice"
                        name="baseBiddingPrice"
                        type="number"
                        placeholder="0.00"
                        value={formData.baseBiddingPrice}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel" className="text-sm font-medium">
                      Experience Level
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("experienceLevel", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-sm font-medium">
                    Project Deadline
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="bidding-toggle" className="text-sm font-medium">
                      Enable Bidding
                    </Label>
                    <p className="text-sm text-gray-500">
                      Allow freelancers to submit competitive bids for this project
                    </p>
                  </div>
                  <Switch
                    id="bidding-toggle"
                    checked={formData.isBiddingEnabled}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isBiddingEnabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>

              <div className="flex items-center space-x-3">
                <Button variant="outline" type="button">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Job...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Job
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
