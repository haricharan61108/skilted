"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"
import { BACKEND_URL } from "config"

interface Admin {
  adminId: number | null
}

interface AdminContextType {
    admin: Admin 
    setAdmin: (admin:Admin) => void
    isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({children}: {children: ReactNode}) => {
    const [admin, setAdmin] = useState<Admin>({ adminId: null })
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(()=> {
        const fetchAdmin = async() => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/admin/getAdminIdForFrontend`, {
                    withCredentials: true
                })

                setAdmin({ adminId: res.data.adminId })

                console.log("Fetched admin:", res.data.adminId)

            } catch (error:any) {
              if (error.response?.status === 401) {
                console.log("Admin not logged in - this is normal")
                setAdmin({ adminId: null })
              } else {
                console.error("Failed to fetch admin:", error)
                setAdmin({ adminId: null })
              }
            }
            finally {
              setIsLoading(false)
            }
        }
        fetchAdmin()
    },[])

    return (
        <AdminContext.Provider value={{ admin, setAdmin , isLoading}}>
          {children}
        </AdminContext.Provider>
      )
}

export const useAdmin = () => {
    const context = useContext(AdminContext)
    if (!context) {
      throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
  }
