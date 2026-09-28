import { getAllPosts } from "@/api/blogs"
import type { Post } from "@/Interfaces/interface"
import {
  ChevronLeft,
  ChevronRight,
  Frown,
  LayoutGrid,
  Newspaper,
  RefreshCw,
  TextAlignJustify,
  X,
} from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

const CATEGORIES = [
  "All Blogs",
  "Lighting",
  "Portrait",
  "Landscape",
  "Techniques",
  "Equipment",
]
const PER_PAGE = 6

export default function Blogs() {
  // no need for setAllBlogs, since the data is static and won't change
  const [isError, setIsError] = useState(false)
  const [allBlogs] = useState<Post[]>(() => {
    try {
      return getAllPosts()
    } catch {
      setIsError(true)
      return []
    }
  })
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams() // current URL's URLSearchParams
  const resultsRef = useRef<HTMLDivElement>(null)
  const activeCategory = searchParams.get("category") || "All Blogs"

  // Search Logic
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  // Category Logic
  function handleCategoryClick(category: string) {
    if (category === "All Blogs") {
      setSearchParams({}) // remove param for clean /blog URL
    } else {
      setSearchParams({ category })
    }
    setPage(1)
  }

  // Filter Logic
  const query = search.trim() // filter by search once user has typed more than 2 letters
  const isSearching = query.length > 2
  const filteredBlogs = useMemo(() => {
    let result = allBlogs

    // when clicked on category, filter by category
    if (activeCategory !== "All Blogs") {
      result = result.filter((blog) => blog.category === activeCategory)
    }

    // when searching, filter by title, excerpt, or tags
    if (isSearching) {
      const q = query.toLowerCase()
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(q) ||
          blog.excerpt.toLowerCase().includes(q) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    return result
  }, [allBlogs, activeCategory, isSearching, query])

  // Clear Filter Logic
  const showClearFilters =
    activeCategory !== "All Blogs" || filteredBlogs.length === 0
  function handleClearFilters() {
    setSearch("") // set everything back to default
    setSearchParams({}) // clears URL query string
    setPage(1)
  }

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginatedBlogs = filteredBlogs.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  )
  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
    // for scrolling up when page changes
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div>
      <main className="grow pt-20">
        <div className="min-h-screen bg-[#0a0a0a]">
          <div className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-size-[60px_60px]" />
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <span className="section-label mb-6 inline-flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                Our Blogs
              </span>
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Explore
                <span className="gradient-text"> our Blogs</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-neutral-400">
                Discover lessons, insights, and best practices for modern
                development.
              </p>
            </div>
          </div>
          <div className="sticky top-20 z-40 border-b border-[#262626] bg-[#0a0a0a]/90 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="relative w-full md:w-80">
                  <input
                    placeholder="Search Blogs..."
                    className="input-dark w-full px-5 py-3 pr-12"
                    type="text"
                    value={search}
                    onChange={handleChange}
                  />
                  <i className="fa-solid fa-magnifying-glass absolute top-[55%] right-4 h-5 w-5 -translate-y-1/2 text-neutral-500"></i>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                          : "border border-[#262626] bg-[#161616] text-neutral-400 hover:border-orange-500/30"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            ref={resultsRef}
            className="mx-auto max-w-7xl scroll-mt-[146px] px-4 py-12 sm:px-6 lg:px-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <p className="text-neutral-400">
                Showing
                <span className="font-bold text-white">
                  {" "}
                  {filteredBlogs.length}
                </span>{" "}
                Blogs
                {activeCategory !== "All Blogs" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="font-bold text-orange-500 capitalize">
                      {activeCategory}
                    </span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border border-[#262626] bg-[#161616] p-1">
                  <button
                    className={`rounded-lg p-2 transition-all duration-300 ${
                      view === "grid"
                        ? "bg-orange-500 text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    title="Grid View"
                    onClick={() => setView("grid")}
                  >
                    <LayoutGrid />
                  </button>
                  <button
                    className={`rounded-lg p-2 transition-all duration-300 ${
                      view === "list"
                        ? "bg-orange-500 text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    title="List View"
                    onClick={() => setView("list")}
                  >
                    <TextAlignJustify />
                  </button>
                </div>
                {showClearFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-orange-500"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {isError && (
              <p className="text-center text-neutral-400">
                Something went wrong loading the blogs.
              </p>
            )}

            {!isError && filteredBlogs.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#262626] bg-[#161616]">
                  <Frown className="h-12 w-12 text-neutral-500" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  No articles found
                </h3>
                <p className="mb-6 text-neutral-400">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reset Filters
                </button>
              </div>
            )}

            {!isError && paginatedBlogs.length > 0 && (
              <div
                className={
                  view === "grid"
                    ? "grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-6"
                }
              >
                {paginatedBlogs.map((blog, index) =>
                  view === "grid" ? (
                    <GridCard key={blog.id} blog={blog} delay={index * 100} />
                  ) : (
                    <ListCard key={blog.id} blog={blog} delay={index * 100} />
                  )
                )}
              </div>
            )}

            {totalPages > 1 && (
              <>
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(safePage - 1)}
                    disabled={safePage === 1}
                    className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:border-[#262626]"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`h-11 min-w-11 rounded-xl text-sm font-medium transition-all duration-300 ${
                            p === safePage
                              ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                              : "border border-[#262626] bg-[#161616] text-neutral-400 hover:border-orange-500/50 hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    className="rounded-xl border border-[#262626] bg-[#161616] p-3 text-white transition-all duration-300 hover:border-orange-500/50 hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:border-[#262626] disabled:hover:bg-[#161616]"
                    onClick={() => goToPage(safePage + 1)}
                    disabled={safePage === totalPages}
                  >
                    <ChevronRight />
                  </button>
                </div>
                <p className="mt-4 text-center text-sm text-neutral-500">
                  Page {safePage} of {totalPages}
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function GridCard({ blog, delay }: { blog: Post; delay: number }) {
  return (
    <article
      className="group card overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link className="block" to={`/blog/${blog.slug}`} data-discover="true">
        <div className="relative h-52 overflow-hidden">
          <img
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            src={blog.image}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute top-4 right-4">
            <span className="rounded-full border border-[#333333] bg-[#0a0a0a]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {blog.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <i className="fa-regular fa-clock"></i>
              {blog.readTime}
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <span>{blog.date}</span>
          </div>
          <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-white transition-colors duration-300 group-hover:text-orange-500">
            {blog.title}
          </h3>
          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
            {blog.excerpt}
          </p>
          <div className="flex items-center justify-between border-t border-[#262626] pt-4">
            <div className="flex items-center gap-3">
              <img
                alt={blog.author.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#262626]"
                src={blog.author.avatar}
              />
              <div>
                <p className="text-sm font-medium text-white">
                  {blog.author.name}
                </p>
                <p className="text-xs text-neutral-500">{blog.author.role}</p>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-orange-500">
              <ChevronRight className="h-4 w-4 text-orange-500 transition-colors duration-300 group-hover:text-white" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

function ListCard({ blog, delay }: { blog: Post; delay: number }) {
  return (
    <article
      className="group overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] transition-all duration-500 hover:border-orange-500/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        className="flex flex-col md:flex-row"
        to={`/blog/${blog.slug}`}
        data-discover="true"
      >
        <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-auto md:w-72 lg:w-80">
          <img
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={blog.image}
          />
          <div className="absolute inset-0 bg-linear-to-l from-[#161616]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col justify-center p-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-neutral-500">
              <i className="fa-regular fa-clock"></i>
              {blog.readTime}
            </span>
            <span className="flex items-center gap-1 text-sm text-neutral-500">
              <i className="fa-regular fa-calendar"></i>
              {blog.date}
            </span>
          </div>
          <h2 className="mb-3 line-clamp-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-orange-500 lg:text-2xl">
            {blog.title}
          </h2>
          <p className="mb-4 line-clamp-2 leading-relaxed text-neutral-400">
            {blog.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                alt={blog.author.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#262626]"
                src={blog.author.avatar}
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {blog.author.name}
                </p>
                <p className="text-xs text-neutral-500">{blog.author.role}</p>
              </div>
            </div>
            <span className="hidden items-center gap-2 text-sm font-semibold text-orange-500 transition-all duration-300 group-hover:gap-3 sm:inline-flex">
              Read Article
              <ChevronRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
