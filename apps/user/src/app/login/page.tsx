"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, ArrowLeft, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"
import api from "@/config"



export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: "error" as "error" | "success",
    title: "",
    message: "",
  })

  const router = useRouter()

  const showDialog = (type: "error" | "success", title: string, message: string) => {
    setDialogState({
      isOpen: true,
      type,
      title,
      message,
    })
  }

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const {data}=await api.post("/api/user/login",formData);
      console.log("Login Successful!",data);

      // Show success toast
      toast.success("Welcome Back! 🎉", {
        description: data.message || "Login successful! Redirecting to your dashboard...",
        duration: 2000,
      })

      // Show success dialog
      showDialog("success", "Welcome Back! 🎉", data.message || "Login successful! Redirecting to your dashboard...")

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Login failed. Please try again."
      const errorTitle = error.response?.status === 401 ? "Invalid Credentials" : "Login Failed"

      // Show error toast
      toast.error(errorTitle, {
        description: errorMessage,
        duration: 4000,
      })

      // Show error dialog
      showDialog("error", errorTitle, errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.email) {
      toast.error("Validation Error", {
        description: "Email is required.",
        duration: 3000,
      })
      return false
    }

    if (!formData.password) {
      toast.error("Validation Error", {
        description: "Password is required.",
        duration: 3000,
      })
      return false
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Validation Error", {
        description: "Please enter a valid email address.",
        duration: 3000,
      })
      return false
    }

    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Skilted
              </span>
              <Badge className="ml-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border-0">
                <Zap className="w-3 h-3 mr-1" />
                Freelancer
              </Badge>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Join thousands of talented freelancers</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back!</CardTitle>
            <CardDescription className="text-gray-600">Sign in to continue your freelancing journey</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80"
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 bg-white/80"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="/user/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium disabled:opacity-50 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                OR
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 border-2 hover:bg-blue-50 bg-white/80 border-gray-200 hover:border-blue-300"
              onClick={() => {
                toast.info("Coming Soon! 🚀", {
                  description: "Google login will be available soon!",
                  duration: 3000,
                })
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

            <div className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up Free
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Your data is protected with enterprise-grade security</p>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={dialogState.isOpen} onOpenChange={closeDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={`flex items-center gap-2 ${dialogState.type === "error" ? "text-red-600" : "text-green-600"}`}
            >
              {dialogState.type === "error" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {dialogState.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">{dialogState.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={closeDialog}
              className={`${
                dialogState.type === "error" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {dialogState.type === "error" ? "Try Again" : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
