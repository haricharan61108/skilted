import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, TrendingUp, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"
import AdminLandingPage from "@/components/landingPage";
export default function Home() {
  return (
    <div>
      <AdminLandingPage />
    </div>
  );
}
