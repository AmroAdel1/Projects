# Adasa — Photography Blog

A modern, fully responsive photography blog built with **React**, **TypeScript**, and **Tailwind CSS**. Lens showcases articles on photography techniques, gear, and inspiration, with a polished dark UI, dynamic filtering, and a rich reading experience.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)

---

## 🔗 Live Demo

**[View Live Demo →](https://adasa.amroadel-farid.workers.dev)**

---

## ✨ Features

### 🏠 Home Page

A landing page that introduces the blog and highlights its best content, including:

- Hero section with a clear value proposition
- Featured / most popular posts
- Quick access to categories and calls-to-action driving readers into the blog

### 📰 Blogs Page

The main content hub, with a fully interactive browsing experience:

- **Live search** — filters results as you type (activates only after 3+ characters to avoid noisy partial matches)
- **Category filtering** — filter posts by category, synced to the URL (`/blog?category=Portrait`) so filtered views are shareable and bookmarkable
- **Grid & List views** — toggle between a card grid and a detailed list layout
- **Pagination** — 6 posts per page, with dynamic page controls that adjust to the current result count
- **Empty & error states** — friendly "no articles found" messaging with a one-click "Reset Filters" action
- **Smooth scroll-to-top** on page navigation

### 📖 Blog Details Page

A beautifully styled reading experience for individual articles:

- Full-bleed hero image with breadcrumb navigation and category badge
- Auto-generated **table of contents** parsed directly from the article body
- Clean typographic content sections with icon-accented headings
- Author bio card, tags, and social sharing actions
- **Related articles** — automatically surfaced from the same category

### 👥 About Us Page

Introduces the team behind the blog:

- Mission statement and key stats (readers, articles, writers, categories)
- Core values section
- **Writers showcase** — dynamically rendered from post author data

### 📄 Privacy & Terms Pages

Standard legal pages for transparency and compliance.

### 🚫 Not Found (404) Page

A custom fallback for any unmatched route, keeping navigation consistent with the rest of the site.

---

## 🛠️ Tech Stack

| Category    | Technology                 |
| ----------- | -------------------------- |
| Framework   | React (with TypeScript)    |
| Routing     | React Router               |
| Styling     | Tailwind CSS               |
| Icons       | Lucide React, Font Awesome |
| Data Source | Local JSON (`posts.json`)  |

---

## 📂 Project Structure

```
src/
├── api/
│   └── blogs.ts              # Data access layer (posts, categories, search)
├── Components/
│   ├── Layout.tsx            # Shared layout (Navbar + Footer + Outlet)
│   ├── Navbar.tsx
│   └── Footer.tsx
├── Interfaces/
│   └── interface.ts          # Shared TypeScript types (Post, Author, Category, etc.)
├── Pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Blogs.tsx
│   ├── BlogDetails.tsx
│   ├── Privacy.tsx
│   ├── Terms.tsx
│   └── NotFound.tsx
├── posts.json                 # Blog content & site data
├── routes.tsx                  # Route definitions
└── main.tsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

---

## 📝 Content Management

All blog content currently lives in `src/posts.json`, including:

- **Posts** — title, slug, excerpt, content, category, author, image, date, read time, tags
- **Categories** — name, post count, accent color
- **Site Info** — name, tagline, description, social links

Article content supports lightweight markdown-style formatting:

```
Intro paragraph here.

## Section Heading

Paragraph content for this section...
```

Sections separated by blank lines and prefixed with `## ` are automatically rendered as headings and populate the table of contents on the Blog Details page.

---

## 🗺️ Routing

| Route                       | Page              |
| --------------------------- | ----------------- |
| `/`                         | Home              |
| `/about`                    | About Us          |
| `/blog`                     | Blogs (all posts) |
| `/blog?category=<Category>` | Blogs (filtered)  |
| `/blog/:slug`               | Blog Details      |
| `/privacy`                  | Privacy Policy    |
| `/terms`                    | Terms of Service  |
| `*`                         | 404 Not Found     |

---

## 🎨 Design

- Dark, high-contrast theme with an orange/yellow accent gradient
- Fully responsive across mobile, tablet, and desktop breakpoints
- Subtle animations and hover states throughout for a polished feel

---

## 📄 License

This project is available for personal and educational use. Update this section with your preferred license (e.g. MIT) before publishing.

---

## 🙌 Acknowledgements

- [Unsplash](https://unsplash.com) — stock photography used throughout the demo content
- [Lucide](https://lucide.dev) & [Font Awesome](https://fontawesome.com) — iconography
