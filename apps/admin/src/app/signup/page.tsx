"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import { BACKEND_URL } from "config"
import axios from "axios"

export default function AdminSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [emailStatus,setEmailStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
    experience: "",
    reason: "",
  })
  
  useEffect(()=> {
    if(!formData.email) {
      setEmailStatus("idle")
      return
    }

    const timer=setTimeout(async()=> {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setEmailStatus("idle")
        return
      }

      setEmailStatus("checking");
      try {
        const res=await axios.get(`${BACKEND_URL}/api/admin/check-email?email=${encodeURIComponent(formData.email)}`);
        setEmailStatus(res.data.available ? "available" : "taken");
      } catch (err) {
        console.error(err)
        setEmailStatus("idle")  
      }
    },500)
    return ()=>clearTimeout(timer)
  },[formData.email])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Skilted
            </span>
          </div>
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access Request
          </Badge>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
            </div>
            <div className={`w-12 h-0.5 ${currentStep > 1 ? "bg-purple-600" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStep === 1 ? "Create Admin Account" : "Almost There!"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1
                ? "Fill in your details to request admin access"
                : "Tell us about your experience and needs"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Business Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {emailStatus === "checking" && <p className="text-gray-500 text-sm">Checking...</p>}
        {emailStatus === "available" && <p className="text-green-600 text-sm">✅ Email is available</p>}
        {emailStatus === "taken" && <p className="text-red-600 text-sm">❌ Email is already in use</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Your Company Ltd."
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Your Role
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceo">CEO/Founder</SelectItem>
                        <SelectItem value="cto">CTO</SelectItem>
                        <SelectItem value="manager">Project Manager</SelectItem>
                        <SelectItem value="director">Business Director</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                      Experience with Marketplaces
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("experience", value)}>
                      <SelectTrigger className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">New to marketplaces</SelectItem>
                        <SelectItem value="intermediate">Some experience</SelectItem>
                        <SelectItem value="advanced">Very experienced</SelectItem>
                        <SelectItem value="expert">Industry expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                      Why do you need admin access?
                    </Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Tell us about your business needs and how you plan to use the platform..."
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      className="min-h-[100px] border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
              >
                {isLoading ? "Processing..." : currentStep === 1 ? "Continue" : "Submit Request"}
              </Button>
            </form>

            {currentStep === 1 && (
              <>
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                    OR
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-11 border-2 hover:bg-gray-50 bg-transparent"
                  onClick={() => {
                    /* Handle Google signup */
                  }}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}

            <div className="text-center text-sm text-gray-600">
              {currentStep === 1 ? (
                <>
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="text-xs text-gray-500">
                  <p>Your request will be reviewed within 24 hours</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>All admin accounts require approval for security</p>
        </div>
      </div>
    </div>
  )
}
