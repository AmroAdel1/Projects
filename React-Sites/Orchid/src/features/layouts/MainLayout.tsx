import { Outlet } from "react-router-dom"
import Navbar from "@/components/myComponents/Navbar/Navbar"
import OfflineBanner from "@/components/myComponents/OfflineBanner"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OfflineBanner />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
