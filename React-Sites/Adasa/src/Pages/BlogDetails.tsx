import { getPostBySlug, getPostsByCategory } from "@/api/blogs"
import type { Post } from "@/Interfaces/interface"
import { Link, useParams } from "react-router-dom"

export default function BlogDetails() {
  const { slug } = useParams()
  let blog: Post | undefined
  try {
    blog = slug ? getPostBySlug(slug) : undefined
  } catch {
    blog = undefined
  }

  if (!blog) {
    return (
      <div className="pt-32 text-center text-neutral-400">
        <p className="mb-4">Post not found.</p>
        <Link to="/blog" className="text-orange-500 hover:text-orange-400">
          Back to Blogs
        </Link>
      </div>
    )
  }

  // Display Content Logic

  // Split content into blocks on blank lines, then classify each block
  const contentBlocks = blog?.content.split("\n\n").filter(Boolean) ?? [] // removes any empty-string entries
  const headings = contentBlocks
    .map((block, index) => ({ block, index })) // converts each string into an object
    .filter(({ block }) => block.startsWith("## ")) // keeps only objects that start with "## "

  // Format Date logic

  // Display date in "month day" format Ex: "12 January 2026" -> "January 12"
  function formatShortDate(dateString: string): string {
    const parts = dateString.trim().split(" ")
    if (parts.length < 2) return dateString // fallback if format is unexpected
    const [day, month] = parts
    return `${month} ${day}`
  }

  // Related Posts Logic

  // Related posts: same category, excluding the current post, max 3
  const relatedPosts = getPostsByCategory(blog.category)
    .filter((post) => post.slug !== blog!.slug)
    .slice(0, 3)

  return (
    <div>
      <main className="grow pt-20">
        <article className="min-h-screen bg-[#0a0a0a]">
          <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
            <img
              alt={blog?.title}
              className="absolute inset-0 h-full w-full object-cover"
              src={blog?.image}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/30 to-transparent" />
            <div className="absolute top-8 right-8 left-8">
              <nav className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm backdrop-blur-md">
                <Link
                  className="text-white/70 transition-colors hover:text-white"
                  to="/"
                  data-discover="true"
                >
                  <i className="fa-solid fa-home" />
                </Link>
                <i className="fa-solid fa-chevron-right text-xs text-white/30" />
                <Link
                  className="text-white/70 transition-colors hover:text-white"
                  to="/blog"
                  data-discover="true"
                >
                  Blogs
                </Link>
                <i className="fa-solid fa-chevron-right text-xs text-white/30" />
                <span className="max-w-[200px] truncate font-medium text-orange-400">
                  {blog?.category}
                </span>
              </nav>
            </div>
            <div className="absolute right-0 bottom-0 left-0 p-8 md:p-12">
              <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <Link
                    className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                    to={`/blog?category=${encodeURIComponent(blog?.category ?? "")}`}
                    data-discover="true"
                  >
                    {blog?.category}
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-2">
                      <i className="fa-regular fa-calendar" />
                      {blog?.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="fa-regular fa-clock" />
                      {blog?.readTime}
                    </span>
                  </div>
                </div>
                <h1 className="mb-6 max-w-4xl text-3xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
                  {blog?.title}
                </h1>
                <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <img
                    alt={blog?.author.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-orange-500/50"
                    src={blog?.author.avatar}
                  />
                  <div>
                    <p className="font-bold text-white">{blog?.author.name}</p>
                    <p className="text-sm text-white/60">{blog?.author.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
              <div className="order-2 lg:order-1">
                <div className="mb-10 rounded-2xl border border-orange-500/20 bg-linear-to-r from-orange-500/10 to-yellow-500/5 p-6">
                  <p className="text-lg leading-relaxed text-neutral-200 italic">
                    {blog?.excerpt}
                  </p>
                </div>
                <div className="prose-custom">
                  {contentBlocks.map((block, i) => {
                    if (block.startsWith("## ")) {
                      return (
                        <h2
                          key={i}
                          id={`section-${i}`}
                          className="mt-14 mb-6 flex scroll-mt-24 items-center gap-4 text-2xl font-bold text-white md:text-3xl"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10">
                            <i className="fa-solid fa-camera text-orange-500" />
                          </span>
                          {block.replace("## ", "")}
                        </h2>
                      )
                    }
                    return (
                      <p
                        key={i}
                        className="mb-6 text-lg leading-relaxed text-neutral-300"
                      >
                        {block}
                      </p>
                    )
                  })}
                </div>
                <div className="mt-14 rounded-2xl border border-[#262626] bg-[#111111] p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10">
                      <i className="fa-solid fa-tags text-orange-500" />
                    </div>
                    <h3 className="font-bold text-white">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blog?.tags.map((tag) => (
                      <span className="cursor-pointer rounded-full border border-[#262626] bg-[#1a1a1a] px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-orange-500/50 hover:text-orange-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-[#262626] bg-[#111111] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10">
                        <i className="fa-solid fa-share-nodes text-orange-500" />
                      </div>
                      <h3 className="font-bold text-white">Share article</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#262626] bg-[#1a1a1a] text-neutral-400 transition-all duration-300 hover:border-transparent hover:bg-[#1da1f2] hover:text-white">
                        <i className="fa-brands fa-x-twitter" />
                      </button>
                      <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#262626] bg-[#1a1a1a] text-neutral-400 transition-all duration-300 hover:border-transparent hover:bg-[#0077b5] hover:text-white">
                        <i className="fa-brands fa-linkedin-in" />
                      </button>
                      <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#262626] bg-[#1a1a1a] text-neutral-400 transition-all duration-300 hover:border-transparent hover:bg-[#25d366] hover:text-white">
                        <i className="fa-brands fa-whatsapp" />
                      </button>
                      <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#262626] bg-[#1a1a1a] text-neutral-400 transition-all duration-300 hover:border-transparent hover:bg-orange-500 hover:text-white">
                        <i className="fa-solid fa-link" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-[#262626] bg-linear-to-br from-[#161616] to-[#111111] p-8">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <img
                      alt={blog?.author.name}
                      className="h-24 w-24 rounded-2xl object-cover ring-4 ring-orange-500/20"
                      src={blog?.author.avatar}
                    />
                    <div className="text-left sm:text-left">
                      <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
                        Author of the article
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        {blog?.author.name}
                      </h3>
                      <p className="mb-3 text-sm text-neutral-500">
                        {blog?.author.role}
                      </p>
                      <p className="max-w-md text-sm leading-relaxed text-neutral-400">
                        A professional photographer passionate about sharing
                        knowledge and expertise in the world of photography.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <aside className="order-1 lg:order-2">
                <div className="space-y-6 lg:sticky lg:top-24">
                  <div className="rounded-2xl border border-[#262626] bg-[#111111] p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10">
                        <i className="fa-solid fa-list text-orange-500" />
                      </div>
                      <h3 className="font-bold text-white">Article Contents</h3>
                    </div>
                    <nav className="space-y-2">
                      {headings.map(({ block, index }, order) => (
                        <a
                          key={index}
                          href={`#section-${index}`}
                          className="group flex items-center gap-3 rounded-xl p-3 text-neutral-400 transition-all duration-300 hover:bg-orange-500/5 hover:text-orange-500"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a1a1a] text-xs font-bold text-neutral-500 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-500">
                            {order + 1}
                          </span>
                          <span className="text-sm">
                            {block.replace("## ", "")}
                          </span>
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className="rounded-2xl border border-[#262626] bg-[#111111] p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#0a0a0a] p-4 text-center">
                        <i className="fa-regular fa-clock mb-2 text-xl text-orange-500" />
                        <p className="font-bold text-white">{blog?.readTime}</p>
                        <p className="text-xs text-neutral-500">Read Time</p>
                      </div>
                      <div className="rounded-xl bg-[#0a0a0a] p-4 text-center">
                        <i className="fa-regular fa-calendar mb-2 text-xl text-orange-500" />
                        <p className="text-sm font-bold text-white">
                          {blog?.date ? formatShortDate(blog.date) : ""}
                        </p>
                        <p className="text-xs text-neutral-500">Publish Date</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 to-yellow-500/5 p-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20">
                        <i className="fa-solid fa-envelope text-xl text-orange-500" />
                      </div>
                      <h3 className="mb-2 font-bold text-white">
                        Don't miss out on the latest.
                      </h3>
                      <p className="mb-4 text-sm text-neutral-400">
                        Subscribe to get the latest articles.
                      </p>
                      <Link
                        className="block w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
                        to="/blog"
                        data-discover="true"
                      >
                        Browse more
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
            {relatedPosts.length > 0 && (
              <div className="mt-20 border-t border-[#262626] pt-12">
                <div className="mb-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10">
                      <i className="fa-solid fa-images text-xl text-orange-500" />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Articles you might like
                      </h2>
                      <p className="text-sm text-neutral-500">
                        Explore more featured content
                      </p>
                    </div>
                  </div>
                  <Link
                    className="group hidden items-center gap-2 text-orange-500 transition-colors hover:text-orange-400 sm:flex"
                    to="/blog"
                    data-discover="true"
                  >
                    View all
                    <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      className="group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#111111] transition-all duration-500 hover:border-orange-500/30"
                      to={`/blog/${post.slug}`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={post.image}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#111111] to-transparent" />
                        <span className="absolute top-4 right-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="mb-3 line-clamp-2 font-bold text-white transition-colors group-hover:text-orange-500">
                          {post.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-neutral-500">
                          <span className="flex items-center gap-2">
                            <img
                              alt={post.author.name}
                              className="h-6 w-6 rounded-full"
                              src={post.author.avatar}
                            />
                            {post.author.name}
                          </span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}
