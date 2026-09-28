import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blogs" },
  { to: "/about", label: "About Us" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-transparent bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link
              className="group flex items-center gap-3"
              to="/"
              data-discover="true"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105">
                <img
                  alt="Photography Logo"
                  className="h-full w-full object-cover"
                  src={logo}
                />
              </div>
              <div className="flex flex-col">
                <span className="bg-linear-to-r from-white to-neutral-300 bg-clip-text text-xl font-bold text-transparent">
                  Adasa
                </span>
                <span className="hidden text-xs tracking-wide text-orange-400/80 sm:block">
                  World of Photography
                </span>
              </div>
            </Link>

            <div className="hidden items-center md:flex">
              <div className="flex items-center rounded-full border border-[#262626] bg-[#161616] p-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-discover="true"
                    aria-current={isActive(link.to) ? "page" : undefined}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                      isActive(link.to)
                        ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                aria-label="search"
                className="flex h-10 w-10 items-center justify-center rounded-[20%] border border-transparent p-2.5 text-neutral-400 transition-all duration-300 hover:border-[#262626] hover:bg-[#161616] hover:text-orange-500"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
              <Link
                className="rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
                to="/blog"
                data-discover="true"
              >
                Start Reading
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              className="rounded-xl border border-transparent p-3 text-neutral-400 transition-all duration-300 hover:border-[#262626] hover:bg-[#161616] hover:text-white md:hidden"
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faXmark : faBars}
                className="h-6 w-6 text-xl"
              />
            </button>
          </div>

          {/* Mobile nav */}
          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="rounded-2xl border border-[#262626] bg-[#161616] p-4 backdrop-blur-xl">
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-discover="true"
                    aria-current={isActive(link.to) ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive(link.to)
                        ? "border border-orange-500/30 bg-orange-500/10 text-orange-500"
                        : "text-neutral-400 hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  className="mt-2 rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-center text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
                  to="/blog"
                  data-discover="true"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
