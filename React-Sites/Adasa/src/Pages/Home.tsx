import { getAllPosts, getFeaturedPosts } from "@/api/blogs"
import type { Post } from "@/Interfaces/interface"
import { Info } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Home() {
  const [blogs] = useState<Post[]>(() => {
    try {
      return getAllPosts()
    } catch {
      return []
    }
  })

  const [featured] = useState<Post[]>(() => {
    try {
      return getFeaturedPosts()
    } catch {
      return []
    }
  })

  return (
    <div>
      <main className="grow pt-20">
        <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-size-[60px_60px]" />
          <div className="blob absolute top-20 left-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div
            className="blob absolute right-10 bottom-20 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl"
            style={{ animationDelay: "-2s" }}
          />
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="section-label animate-fade-in mb-8 inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                <span className="text-sm font-medium text-neutral-300">
                  Welcome to Adasa
                </span>
              </div>
              <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                Discover the
                <span className="gradient-text"> art</span>
                <br />
                of photography
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-neutral-400 md:text-2xl">
                Immerse yourself in professional secrets and practical tips to
                develop your photography skills.
              </p>
              <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  className="btn-primary group inline-flex items-center justify-center gap-2"
                  to="/blog"
                  data-discover="true"
                >
                  <span>Discover Blogs</span>
                  <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-1"></i>
                </Link>
                <Link
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                  to="/about"
                  data-discover="true"
                >
                  <Info />
                  <span>Learn more</span>
                </Link>
              </div>
              <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
                <div
                  className="glass-card p-4 transition-transform duration-300 hover:scale-105"
                  style={{ animationDelay: "0ms" }}
                >
                  <i className="fa-solid fa-newspaper mb-1 text-2xl text-orange-500" />
                  <p className="gradient-text text-2xl font-bold md:text-3xl">
                    50+
                  </p>
                  <p className="text-sm text-neutral-500">Blog</p>
                </div>
                <div
                  className="glass-card p-4 transition-transform duration-300 hover:scale-105"
                  style={{ animationDelay: "100ms" }}
                >
                  <i className="fa-solid fa-users mb-1 text-2xl text-orange-500" />
                  <p className="gradient-text text-2xl font-bold md:text-3xl">
                    10K+
                  </p>
                  <p className="text-sm text-neutral-500">Reader</p>
                </div>
                <div
                  className="glass-card p-4 transition-transform duration-300 hover:scale-105"
                  style={{ animationDelay: "200ms" }}
                >
                  <i className="fa-solid fa-folder-open mb-1 text-2xl text-orange-500" />
                  <p className="gradient-text text-2xl font-bold md:text-3xl">
                    4
                  </p>
                  <p className="text-sm text-neutral-500">Categories</p>
                </div>
                <div
                  className="glass-card p-4 transition-transform duration-300 hover:scale-105"
                  style={{ animationDelay: "300ms" }}
                >
                  <i className="fa-solid fa-pen-nib mb-1 text-2xl text-orange-500" />
                  <p className="gradient-text text-2xl font-bold md:text-3xl">
                    6
                  </p>
                  <p className="text-sm text-neutral-500">Writers</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-linear-to-l from-orange-500/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="section-label mb-4">
                  <span className="relative ml-[0.5px] flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                  </span>
                  Featured
                </span>
                <h2 className="section-title text-white">Selected Blogs</h2>
                <p className="section-subtitle max-w-lg">
                  Curated content to start your learning journey.
                </p>
              </div>
              <Link
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-5 py-2.5 font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
                to="/blog"
                data-discover="true"
              >
                View all
                <i className="fa-solid fa-chevron-right transition-transform group-hover:translate-x-1"></i>
              </Link>
            </div>
            <div className="space-y-8">
              {featured.map((post) => (
                <article
                  key={post.slug}
                  className="group relative overflow-hidden rounded-3xl border border-[#262626] bg-[#161616] transition-all duration-500 hover:border-orange-500/30"
                  style={{ animationDelay: "0ms" }}
                >
                  <Link
                    className="block"
                    to={`/blog/${post.slug}`}
                    data-discover="true"
                  >
                    <div className="grid gap-0 md:grid-cols-2">
                      <div className="relative h-72 overflow-hidden md:h-[400px]">
                        <img
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          src={post.image}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-orange-500 to-yellow-500 px-3 py-1.5 text-sm font-semibold text-white">
                            <i className="fa-solid fa-star"></i>
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center bg-[#161616] p-8 md:p-10">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-neutral-500">
                            <i className="fa-regular fa-clock"></i>
                            {post.readTime}
                          </span>
                        </div>
                        <h2 className="mb-4 text-2xl leading-tight font-bold text-white transition-colors duration-300 group-hover:text-orange-500 md:text-3xl">
                          {post.title}
                        </h2>
                        <p className="mb-6 line-clamp-3 leading-relaxed text-neutral-400">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                alt={post.author.name}
                                className="h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-[#262626]"
                                src={post.author.avatar}
                              />
                              <div className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full border-2 border-[#161616] bg-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {post.author.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {post.date}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition-all duration-300 group-hover:gap-3">
                            Read blog
                            <i className="fa-solid fa-arrow-right-long transition-transform"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="relative border-y border-[#262626] bg-[#111111] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="section-label mb-4">
                <span className="relative ml-[0.5px] flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                </span>
                Categories
              </span>
              <h2 className="section-title text-white">Explore by topic</h2>
              <p className="section-subtitle mx-auto max-w-lg">
                Find content tailored to your interests.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              <Link
                className="group relative block overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/30"
                to="/blog?category=Lighting"
                data-discover="true"
                style={{ animationDelay: "0ms" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-yellow-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-white/20">
                    <i className="fa-solid fa-sun text-xl text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-white">
                    Lighting
                  </h3>
                  <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-white/80">
                    3 Blogs
                  </p>
                  <div className="absolute top-6 left-45 flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] opacity-0 transition-all duration-300 group-hover:bg-white/20 group-hover:opacity-100">
                    <i className="fa-solid fa-chevron-right text-white"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="group relative block overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/30"
                to="/blog?category=Portrait"
                data-discover="true"
                style={{ animationDelay: "100ms" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-orange-600 to-orange-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-white/20">
                    <i className="fa-solid fa-user text-xl text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-white">
                    Portrait
                  </h3>
                  <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-white/80">
                    3 Blogs
                  </p>
                  <div className="absolute top-6 left-45 flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] opacity-0 transition-all duration-300 group-hover:bg-white/20 group-hover:opacity-100">
                    <i className="fa-solid fa-chevron-right text-white"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="group relative block overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/30"
                to="/blog?category=Landscape"
                data-discover="true"
                style={{ animationDelay: "200ms" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-yellow-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-white/20">
                    <i className="fa-solid fa-mountain-sun text-xl text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-white">
                    Landscape
                  </h3>
                  <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-white/80">
                    2 Blogs
                  </p>
                  <div className="absolute top-6 left-45 flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] opacity-0 transition-all duration-300 group-hover:bg-white/20 group-hover:opacity-100">
                    <i className="fa-solid fa-chevron-right text-white"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="group relative block overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/30"
                to="/blog?category=Techniques"
                data-discover="true"
                style={{ animationDelay: "300ms" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-yellow-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-white/20">
                    <i className="fa-solid fa-sliders text-xl text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-white">
                    Techniques
                  </h3>
                  <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-white/80">
                    5 Blogs
                  </p>
                  <div className="absolute top-6 left-45 flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] opacity-0 transition-all duration-300 group-hover:bg-white/20 group-hover:opacity-100">
                    <i className="fa-solid fa-chevron-right text-white"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="group relative block overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/30"
                to="/blog?category=Equipment"
                data-discover="true"
                style={{ animationDelay: "400ms" }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-yellow-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-white/20">
                    <i className="fa-solid fa-sun text-xl text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-white">
                    Equipment
                  </h3>
                  <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-white/80">
                    3 Blogs
                  </p>
                  <div className="absolute top-6 left-45 flex h-8 w-8 items-center justify-center rounded-full bg-[#262626] opacity-0 transition-all duration-300 group-hover:bg-white/20 group-hover:opacity-100">
                    <i className="fa-solid fa-chevron-right text-white"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
          <div className="absolute bottom-0 left-0 h-full w-1/3 bg-linear-to-r from-orange-500/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="section-label mb-4">
                  <span className="relative ml-[0.5px] flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                  </span>
                  Latest
                </span>
                <h2 className="section-title text-white">Latest Blogs</h2>
                <p className="section-subtitle max-w-lg">
                  Fresh new content, hot off the press.
                </p>
              </div>
              <Link
                className="group inline-flex items-center gap-2 font-semibold text-orange-500 transition-colors hover:text-orange-400"
                to="/blog"
                data-discover="true"
              >
                View all Blogs
                <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-1"></i>
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(3, 6).map((post) => (
                <article
                  key={post.slug}
                  className="group card overflow-hidden"
                  style={{ animationDelay: "0ms" }}
                >
                  <Link
                    className="block"
                    to={`/blog/${post.slug}`}
                    data-discover="true"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        src={post.image}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute top-4 right-4">
                        <span className="rounded-full border border-[#333333] bg-[#0a0a0a]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-3 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-clock"></i>
                          {post.readTime}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-neutral-600" />
                        <span>{post.date}</span>
                      </div>
                      <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-white transition-colors duration-300 group-hover:text-orange-500">
                        {post.title}
                      </h3>
                      <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between border-t border-[#262626] pt-4">
                        <div className="flex items-center gap-3">
                          <img
                            alt={post.author.name}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-[#262626]"
                            src={post.author.avatar}
                          />
                          <div>
                            <p className="text-sm font-medium text-white">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {post.author.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 transition-colors duration-300 group-hover:border-transparent group-hover:bg-orange-500">
                          <i className="fa-solid fa-chevron-right text-orange-500 transition-colors duration-300 group-hover:text-white"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
          <div className="absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-[#262626] bg-[#161616] p-8 text-center md:p-12 lg:p-16">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-orange-600">
                <i className="fa-regular fa-envelope text-3xl text-white"></i>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Subscribe to
                <span className="gradient-text"> our newsletter</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-400">
                Get exclusive photography tips and new tutorials delivered
                straight to your email.
              </p>
              <form className="mx-auto mb-6 flex max-w-lg flex-col gap-3 sm:flex-row">
                <input
                  placeholder="Enter your email address"
                  className="flex-1 rounded-xl border border-[#262626] bg-[#0a0a0a] px-5 py-4 text-white placeholder-neutral-500 transition-colors focus:border-orange-500/50 focus:outline-none"
                  type="email"
                  required
                />
                <button
                  type="submit"
                  className="rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
                >
                  Subscribe now
                </button>
              </form>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2 space-x-reverse">
                    {featured.map((post) => (
                      <img
                        key={post.slug}
                        className="h-8 w-8 rounded-full border-2 border-[#161616]"
                        alt="..."
                        src={post.author.avatar}
                      />
                    ))}
                  </div>
                  <span>
                    Join over
                    <span className="font-medium text-white"> 10,000+ </span>
                    photographers
                  </span>
                </div>
                <span className="hidden text-[#262626] sm:inline">•</span>
                <span>Without disturbance</span>
                <span className="hidden text-[#262626] sm:inline">•</span>
                <span>Cancel your subscription at any time.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
