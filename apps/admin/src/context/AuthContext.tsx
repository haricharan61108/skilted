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
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({children}: {children: ReactNode}) => {
    const [admin, setAdmin] = useState<Admin>({ adminId: null })

    useEffect(()=> {
        const fetchAdmin = async() => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/admin/getAdminIdForFrontend`, {
                    withCredentials: true
                })

                setAdmin({ adminId: res.data.adminId })

                console.log("Fetched admin:", res.data.adminId)

            } catch (error) {
                console.error("Failed to fetch admin:", error)
                setAdmin({ adminId: null })
            }
        }
        fetchAdmin()
    },[])

    return (
        <AdminContext.Provider value={{ admin, setAdmin }}>
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
