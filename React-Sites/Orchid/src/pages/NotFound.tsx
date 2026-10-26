import { Link, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiHome } from "react-icons/fi"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("token")

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-16">
      {/* Soft background shapes, same language as the auth pages */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 size-96 rounded-full bg-violet-500/10"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-24 size-80 rounded-full bg-violet-600/10"
      />

      <div className="relative w-full max-w-md text-center">
        <p className="bg-gradient-to-br from-violet-600 to-fuchsia-400 bg-clip-text text-8xl leading-none font-extrabold tracking-tighter text-transparent sm:text-9xl">
          404
        </p>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
          This page doesn't exist
        </h1>
        <p className="mt-2 text-muted-foreground">
          The link may be broken, or the page may have been moved or deleted.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft /> Go back
          </Button>
          <Link
            to={isLoggedIn ? "/posts" : "/login"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-violet-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            <FiHome /> {isLoggedIn ? "Back to feed" : "Go to login"}
          </Link>
        </div>
      </div>
    </main>
  )
}
