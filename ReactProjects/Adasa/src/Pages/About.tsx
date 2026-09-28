import { getAllPosts } from "@/api/blogs"
import type { Post } from "@/Interfaces/interface"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function About() {
  const [blogs] = useState<Post[]>(() => {
    try {
      return getAllPosts()
    } catch {
      return []
    }
  })

  return (
    <div>
      <main className="grow pt-20">
        <div className="bg-[#0a0a0a]">
          <section className="relative overflow-hidden py-24">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-size-[60px_60px]" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
              <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-yellow-500/10 blur-[120px]" />
            </div>
            <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
              <span className="section-label mb-6 inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                About Us
              </span>
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Our mission is to
                <span className="gradient-text"> inform and inspire</span>
              </h1>
              <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-neutral-400">
                A blog dedicated to the art of photography, where we share
                professional secrets and practical tips to help you hone your
                skills. We are passionate about sharing knowledge and helping
                photographers develop their abilities through high-quality
                content.
              </p>
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
                <div className="glass-card p-6">
                  <i className="fa-solid fa-users mb-2 block text-2xl text-orange-500" />
                  <div className="gradient-text mb-1 text-3xl font-bold">
                    2M+
                  </div>
                  <div className="text-sm text-neutral-500">
                    Monthly readers
                  </div>
                </div>
                <div className="glass-card p-6">
                  <i className="fa-solid fa-newspaper mb-2 block text-2xl text-orange-500" />
                  <div className="gradient-text mb-1 text-3xl font-bold">
                    500+
                  </div>
                  <div className="text-sm text-neutral-500">
                    Published articles
                  </div>
                </div>
                <div className="glass-card p-6">
                  <i className="fa-solid fa-pen-nib mb-2 block text-2xl text-orange-500" />
                  <div className="gradient-text mb-1 text-3xl font-bold">
                    50+
                  </div>
                  <div className="text-sm text-neutral-500">Expert Writers</div>
                </div>
                <div className="glass-card p-6">
                  <i className="fa-solid fa-book-open mb-2 block text-2xl text-orange-500" />
                  <div className="gradient-text mb-1 text-3xl font-bold">
                    15+
                  </div>
                  <div className="text-sm text-neutral-500">Categories</div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-[#262626] bg-[#111111] py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold text-white md:text-4xl">
                  <span className="h-8 w-1.5 rounded-full bg-linear-to-b from-orange-500 to-yellow-500" />
                  Our Values
                  <span className="h-8 w-1.5 rounded-full bg-linear-to-b from-yellow-500 to-orange-500" />
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                  The principles that guide everything we create.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 text-center transition-all duration-300 hover:border-orange-500/30">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <div className="relative">
                    <i className="fa-solid fa-bullseye mb-4 block text-4xl text-orange-500" />
                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-orange-500">
                      Quality First
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Expertly researched and written content
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 text-center transition-all duration-300 hover:border-orange-500/30">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-600 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <div className="relative">
                    <i className="fa-solid fa-bolt mb-4 block text-4xl text-orange-500" />
                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-orange-500">
                      Practical focus
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Real-world examples you can apply today
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 text-center transition-all duration-300 hover:border-orange-500/30">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <div className="relative">
                    <i className="fa-solid fa-handshake mb-4 block text-4xl text-orange-500" />
                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-orange-500">
                      Society
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Learn with thousands of photographers.
                    </p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#161616] p-6 text-center transition-all duration-300 hover:border-orange-500/30">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-600 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <div className="relative">
                    <i className="fa-solid fa-arrows-rotate mb-4 block text-4xl text-orange-500" />
                    <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-orange-500">
                      Always up-to-date
                    </h3>
                    <p className="text-sm text-neutral-400">
                      Latest Trends and Best Practices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#0a0a0a] py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <span className="section-label mb-4">Our Team</span>
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                  Discover our writers
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                  Our team of experienced photographers and writers is
                  passionate about sharing their knowledge with the community.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <div
                    key={blog.slug}
                    className="group rounded-2xl border border-[#262626] bg-[#161616] p-6 text-center transition-all duration-300 hover:border-orange-500/30"
                  >
                    <div className="relative mb-4 inline-block">
                      <img
                        alt={blog.author.name}
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-[#262626] transition-all group-hover:ring-orange-500/30"
                        src={blog.author.avatar}
                      />
                      <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#161616] bg-orange-500">
                        <i className="fa-solid fa-check text-xs text-white"></i>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {blog.author.name}
                    </h3>
                    <p className="mb-4 text-sm font-medium text-orange-500">
                      {blog.author.role}
                    </p>
                    <div className="flex justify-center gap-3">
                      <a
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-neutral-500 transition-colors hover:bg-orange-500 hover:text-white"
                      >
                        <i className="fa-brands fa-x-twitter"></i>
                      </a>
                      <a
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-neutral-500 transition-colors hover:bg-neutral-700 hover:text-white"
                      >
                        <i className="fa-brands fa-github"></i>
                      </a>
                      <a
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#262626] text-neutral-500 transition-colors hover:bg-blue-600 hover:text-white"
                      >
                        <i className="fa-brands fa-linkedin"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-linear-to-br from-orange-600 via-orange-500 to-yellow-500 py-20">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-white/20 blur-[100px]" />
              <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-white/20 blur-[80px]" />
            </div>
            <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Have questions? Let's talk!
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
                We would love to hear from you. Whether you have a question
                about our content, want to contribute, or just want to say
                hello, please don't hesitate to get in touch.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:hello@adasah.com"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-900"
                >
                  <i className="fa-regular fa-envelope"></i>
                  Contact us
                </a>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-transparent px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#0a0a0a]"
                  to="/blog"
                  data-discover="true"
                >
                  Browse blogs
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
