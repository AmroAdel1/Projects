import { useContext, useEffect, useRef, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  FiHome,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiSun,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi"
import { AuthContext } from "@/context/AuthContext/authContext"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import ChangePasswordDialog from "@/features/auth/components/ChangePasswordDialog"
import NotificationBell from "@/features/notifications/components/NotificationsBell"
import { getProfile } from "@/features/auth/auth.api"
import { clearOfflineCache } from "@/lib/offline"

const navLink = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`

export default function Navbar() {
  const { token, setToken } = useContext(AuthContext)
  const [open, setOpen] = useState(false) // open menu
  const [pwOpen, setPwOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!token, // don't run with empty id
    select: (data) => data?.data.user,
  })

  // Close the menu when clicking outside it
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  function logout() {
    localStorage.removeItem("token")
    setToken(null)
    setOpen(false)
    clearOfflineCache() // clears the in-memory cache and the saved copy
    navigate("/login")
  }

  const item =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        <Link
          to="/posts"
          className="mr-3 text-xl font-extrabold tracking-tight text-violet-600"
        >
          orchid
        </Link>

        {token && (
          <nav className="flex gap-1">
            <NavLink to="/posts" className={navLink}>
              <FiHome /> <span className="hidden sm:inline">Home</span>
            </NavLink>
            <NavLink to="/feed" className={navLink}>
              <FiUsers /> <span className="hidden sm:inline">Feed</span>
            </NavLink>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="cursor-pointer"
          >
            {dark ? <FiSun /> : <FiMoon />}
          </Button>

          {token && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Open user menu"
                aria-expanded={open}
                className="grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full bg-violet-100 font-bold text-violet-700"
              >
                {data?.photo ? (
                  <img
                    src={data?.photo}
                    alt={data?.name}
                    className="size-full object-cover"
                  />
                ) : (
                  (data?.name?.[0]?.toUpperCase() ?? <FiUser />)
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-popover p-1.5 shadow-lg">
                  {data && (
                    <div className="border-b px-3 pt-1.5 pb-2.5">
                      <p className="truncate text-sm font-semibold">
                        {data.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{data.username}
                      </p>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={`${item} my-2`}
                  >
                    <FiUser /> Profile
                  </Link>
                  <Link
                    to="/follow"
                    onClick={() => setOpen(false)}
                    className={`${item} my-2`}
                  >
                    <FiUserPlus /> Find people
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false)
                      setPwOpen(true)
                    }}
                    className={`${item} my-2 cursor-pointer`}
                  >
                    <FiSettings /> Change password
                  </button>
                  <button
                    onClick={logout}
                    className={`${item} cursor-pointer text-rose-600`}
                  >
                    <FiLogOut /> Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {token && <ChangePasswordDialog isOpen={pwOpen} setIsOpen={setPwOpen} />}
    </header>
  )
}
