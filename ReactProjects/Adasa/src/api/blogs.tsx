import blogData from "../posts.json"
import type { Blog, Category, Post } from "../Interfaces/interface"

const data = blogData as Blog

export function getAllPosts(): Post[] {
  return data.posts
}
export function getAllCategories(): Category[] {
  return data.categories
}

export function getPostBySlug(slug: string): Post | undefined {
  return data.posts.find((post) => post.slug === slug)
}

export function getFeaturedPosts(): Post[] {
  return data.posts.filter((post) => post.featured)
}

export function getPostsByCategory(category: string): Post[] {
  return data.posts.filter((post) => post.category === category)
}
