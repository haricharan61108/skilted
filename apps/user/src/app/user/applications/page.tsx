"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Eye,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/config";

interface AppliedJob {
  bidId: number;
  bidAmount: number;
  comments: string;
  createdAt: string;
  job: {
    id: number;
    title: string;
    description: string;
    category?: string;
    baseBiddingPrice: number;
    experienceLevel?: string;
    technologies: string[];
    adminEmail: string | null;
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/user/applied-jobs");
        setApplications(response.data.appliedJobs);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getBidStatus = (bidAmount: number, baseBiddingPrice: number) => {
    const difference = bidAmount - baseBiddingPrice;
    if (difference > 0) {
      return {
        status: "Higher",
        color: "bg-red-100 text-red-700",
        icon: "↑",
      };
    } else if (difference < 0) {
      return {
        status: "Lower",
        color: "bg-green-100 text-green-700",
        icon: "↓",
      };
    } else {
      return {
        status: "Same",
        color: "bg-blue-100 text-blue-700",
        icon: "=",
      };
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || app.job.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "bid-high":
        return b.bidAmount - a.bidAmount;
      case "bid-low":
        return a.bidAmount - b.bidAmount;
      default:
        return 0;
    }
  });

  const totalApplications = applications.length;
  const totalBidValue = applications.reduce(
    (sum, app) => sum + app.bidAmount,
    0
  );
  const avgBidAmount =
    totalApplications > 0 ? totalBidValue / totalApplications : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track all your job applications and bids
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalApplications}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bid Amount
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalBidValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Bid
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(avgBidAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search applications by job title or client email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Mobile Development">
                      Mobile Development
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="bid-high">Bid: High to Low</SelectItem>
                    <SelectItem value="bid-low">Bid: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {sortedApplications.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || categoryFilter !== "all"
                  ? "No applications found"
                  : "No applications yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Start applying to jobs to track your applications here."}
              </p>
              <Link href="/user/getJobs">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedApplications.map((application) => {
              const bidStatus = getBidStatus(
                application.bidAmount,
                application.job.baseBiddingPrice
              );

              return (
                <Card
                  key={application.bidId}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Job Details */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {application.job.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              {application.job.category && (
                                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border-0">
                                  {application.job.category}
                                </Badge>
                              )}
                              {application.job.experienceLevel && (
                                <Badge
                                  className={
                                    application.job.experienceLevel ===
                                    "beginner"
                                      ? "bg-green-100 text-green-700"
                                      : application.job.experienceLevel ===
                                          "intermediate"
                                        ? "bg-blue-100 text-blue-700"
                                        : application.job.experienceLevel ===
                                            "senior"
                                          ? "bg-purple-100 text-purple-700"
                                          : "bg-red-100 text-red-700"
                                  }
                                >
                                  {application.job.experienceLevel}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {application.job.description}
                        </p>

                        {/* Technologies */}
                        {application.job.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {application.job.technologies
                              .slice(0, 4)
                              .map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="secondary"
                                  className="text-xs bg-gray-100 text-gray-700"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            {application.job.technologies.length > 4 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700"
                              >
                                +{application.job.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Comments */}
                        {application.comments && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-xs font-medium text-gray-700 mb-1">
                              Your Proposal:
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {application.comments}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bid Details */}
                      <div className="lg:col-span-1">
                        <div className="space-y-4">
                          {/* Bid Amount */}
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-xs font-medium text-gray-600 mb-2">
                              Your Bid
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mb-2">
                              {formatCurrency(application.bidAmount)}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge className={`${bidStatus.color} text-xs`}>
                                {bidStatus.icon} {bidStatus.status} vs Base
                              </Badge>
                              <p className="text-xs text-gray-600">
                                {formatCurrency(
                                  application.job.baseBiddingPrice
                                )}{" "}
                                base
                              </p>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {formatDate(application.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {formatTimeAgo(application.createdAt)}
                              </span>
                            </div>
                            {application.job.adminEmail && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 truncate">
                                  {application.job.adminEmail}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <Link href={`/user/job/${application.job.id}`}>
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Job Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
