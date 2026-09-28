import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import {
  faGithub,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import type { Category } from "@/Interfaces/interface"
import { getAllCategories } from "@/api/blogs"
import { useState } from "react"
export default function Footer() {
  const [categories] = useState<Category[]>(() => {
    try {
      return getAllCategories()
    } catch {
      return []
    }
  })
  return (
    <div>
      <footer className="relative overflow-hidden border-t border-[#262626] bg-[#0a0a0a] text-neutral-300">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link
                className="group mb-6 flex items-center gap-3"
                to="/"
                data-discover="true"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-orange-600 transition-all duration-300 group-hover:scale-105"
                  style={{ boxShadow: "rgba(249, 115, 22, 0.3) 0px 4px 20px" }}
                >
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <span className="text-xl font-bold text-white">Adasa</span>
              </Link>
              <p className="mb-6 text-sm leading-relaxed text-neutral-500">
                A blog dedicated to the art of photography, where we share
                professional secrets and practical tips to help you develop your
                skills.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://twitter.com/adasah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#262626] bg-[#161616] text-neutral-500 transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-linear-to-br hover:from-orange-500 hover:to-orange-600 hover:text-white"
                  aria-label="twitter"
                >
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a
                  href="https://github.com/adasah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#262626] bg-[#161616] text-neutral-500 transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-linear-to-br hover:from-orange-500 hover:to-orange-600 hover:text-white"
                  aria-label="github"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  href="https://linkedin.com/company/adasah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#262626] bg-[#161616] text-neutral-500 transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-linear-to-br hover:from-orange-500 hover:to-orange-600 hover:text-white"
                  aria-label="linkedin"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a
                  href="https://youtube.com/@adasah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#262626] bg-[#161616] text-neutral-500 transition-all duration-300 hover:scale-110 hover:border-transparent hover:bg-linear-to-br hover:from-orange-500 hover:to-orange-600 hover:text-white"
                  aria-label="youtube"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-white">
                Discover
                <span className="h-0.5 w-8 rounded-full bg-linear-to-r from-orange-500 to-yellow-500" />
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors duration-300 hover:text-orange-500"
                    to="/"
                    data-discover="true"
                  >
                    <FontAwesomeIcon
                      className="-mr-4 h-4 w-4 rotate-180 text-orange-500 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100"
                      icon={faAngleLeft}
                    />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors duration-300 hover:text-orange-500"
                    to="/blog"
                    data-discover="true"
                  >
                    <FontAwesomeIcon
                      className="-mr-4 h-4 w-4 rotate-180 text-orange-500 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100"
                      icon={faAngleLeft}
                    />
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors duration-300 hover:text-orange-500"
                    to="/about"
                    data-discover="true"
                  >
                    <FontAwesomeIcon
                      className="-mr-4 h-4 w-4 rotate-180 text-orange-500 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100"
                      icon={faAngleLeft}
                    />
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-white">
                Categories
                <span className="h-0.5 w-8 rounded-full bg-linear-to-r from-orange-500 to-yellow-500" />
              </h3>
              <ul className="space-y-4">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.name}>
                    <Link
                      className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors duration-300 hover:text-orange-500"
                      to={`/blog?category=${encodeURIComponent(category.name)}`}
                      data-discover="true"
                    >
                      <FontAwesomeIcon
                        className="-mr-4 h-4 w-4 rotate-180 text-orange-500 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100"
                        icon={faAngleLeft}
                      />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-white">
                Stay informed
                <span className="h-0.5 w-8 rounded-full bg-linear-to-r from-orange-500 to-yellow-500" />
              </h3>
              <p className="mb-4 text-sm text-neutral-500">
                Subscribe to receive the latest articles and updates.
              </p>
              <form className="space-y-3">
                <div className="relative">
                  <input
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-[#262626] bg-[#161616] px-4 py-3 text-sm text-white placeholder-neutral-600 transition-all duration-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    type="email"
                  />
                </div>
                <button type="submit" className="btn-primary w-full text-sm">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="relative border-t border-[#262626]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-neutral-600">
                © 2026 Adasa. Made with
                <i className="fa-solid fa-heart text-orange-500" /> All rights
                reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  className="text-sm text-neutral-600 transition-colors duration-300 hover:text-orange-500"
                  to="/privacy"
                  data-discover="true"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="text-sm text-neutral-600 transition-colors duration-300 hover:text-orange-500"
                  to="/terms"
                  data-discover="true"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
