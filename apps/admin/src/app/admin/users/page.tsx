"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Bell,
  Filter,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import Link from "next/link"
import { BACKEND_URL } from "config"
import axios from "axios"

interface User {
  id: number
  email: string
  profile: {
    name: string
    profilePicture?: string | null
    title?: string | null
    skills: string[]
    availability: boolean
  } | null
  rating?: number
  completedJobs?: number
  bidsCount?: number
  totalEarnings?: number
  successRate?: number
  lastActive?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 3000);
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    fetchUsers()
  }, [page,debouncedSearch])

  const fetchUsers = async () => {
    try {
      const endpoint = debouncedSearch
        ? `${BACKEND_URL}/api/admin/users/search?q=${searchQuery}&page=${page}&limit=${limit}`
        : `${BACKEND_URL}/api/admin/get-users?page=${page}&limit=${limit}`;
  
      const response = await axios.get(endpoint, { withCredentials: true });
  
      const data = response.data;
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const getAvailabilityBadge = (available: boolean) =>
    available ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1 rounded-lg text-sm">
        <CheckCircle className="w-4 h-4 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-3 py-1 rounded-lg text-sm">
        <XCircle className="w-4 h-4 mr-1" />
        Busy
      </Badge>
    )

    const filteredUsers = users;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Skilted
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
            <div className="flex items-center space-x-3">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="top-rated">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                  <SelectItem value="jobs">Completed Jobs</SelectItem>
                  <SelectItem value="recent">Recently Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-lg">User</TableHead>
                  <TableHead className="text-lg">Skills</TableHead>
                  <TableHead className="text-lg">Status</TableHead>
                  <TableHead className="text-lg">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 h-20">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user.profile?.profilePicture || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {user.profile?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || user.email[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {user.profile?.name || "Unnamed User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.profile?.title || "No title"}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {user.profile?.skills?.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-sm px-2 py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAvailabilityBadge(user.profile?.availability ?? false)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-5 h-5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" /> Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
