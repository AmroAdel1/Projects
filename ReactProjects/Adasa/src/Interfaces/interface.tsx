export interface Blog {
  posts: Post[]
  categories: Category[]
  siteInfo: SiteInfo
}

export interface Post {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: Author
  image: string
  date: string
  readTime: string
  featured: boolean
  tags: string[]
}

export interface Author {
  name: string
  avatar: string
  role: string
}

export interface Category {
  name: string
  count: number
  color: string
}

export interface SiteInfo {
  name: string
  tagline: string
  description: string
  email: string
  social: Social
}

export interface Social {
  twitter: string
  github: string
  linkedin: string
  youtube: string
}
