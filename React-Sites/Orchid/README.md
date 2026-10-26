# Orchid: Social Media App

A modern, responsive social media app built with **React**, **TypeScript**, **Tailwind CSS** and **shadcn/ui**. Orchid lets people share posts with photos, follow the conversation through comments and replies, like and save content, and stay up to date with notifications, all with a clean violet design, dark mode and offline support.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)

---

## 🔗 Live Demo

**[View Live Demo →](https://orchid.amroadel-farid.workers.dev)**

> Replace the link above with your deployed URL.

---

## ✨ Features

### 🔐 Authentication

Secure sign-up and login, validated before anything is sent to the server:

- **Sign up** with name, username, email, date of birth, gender and password
- **Login** with email and password
- Form state handled by **React Hook Form**, rules defined once with **Zod** (password strength, matching passwords, minimum age of 18)
- Show / hide password toggle and inline error messages
- Token stored locally and attached to every request automatically
- Protected pages redirect to login; logged-in users are redirected away from login and register

### 🏠 Home Feed

The main timeline, with a Facebook-style layout:

- **"What's on your mind?" composer** that opens a create-post dialog
- **All posts** page and a **Following** feed (`/feed`)
- **Infinite scroll** powered by React Query and the Intersection Observer, with skeleton placeholders while loading
- Top comment preview under each post, with a link to the full discussion
- Friendly empty, error and "you're all caught up" states

### 📝 Posts

Full create, read, update and delete:

- Create a post with text, an image, or both, with a live image preview
- Edit your own post, including swapping or removing its image
- Delete your own post
- **Like**, **save (bookmark)** and **share** any post
- **"People who liked this"** dialog with infinite scroll and profile links
- Shared posts render as a quoted card linking to the original

### 💬 Comments & Replies

A threaded discussion on every post:

- Add, edit and delete comments, with optional images
- **Optimistic likes**: the heart updates instantly and rolls back if the request fails
- Nested **replies** with their own pagination
- Owners can edit and delete their own comments; confirmation dialog before deleting
- One shared composer component for comments, replies and edits (`Ctrl/Cmd + Enter` to send)

### 👤 Profile

A Facebook-style profile page for yourself and other users:

- Cover banner with an overlapping avatar, name, username and follower / following counts
- Change your profile photo
- Follow / unfollow other users
- **Posts**, **About** and **Saved** tabs (Saved is private to you)
- Sticky "Intro" card and paginated posts list

### 🔔 Notifications

Stay in the loop without leaving the page:

- **Notification bell** in the navbar with a live unread badge
- Dropdown with **All / Unread** tabs, plus a full **Notifications page**
- Typed icons for likes, comments, shares and follows
- Mark one or all as read; clicking a notification opens the related post or profile

### 📴 Offline Support

The app keeps working when your connection drops:

- Posts, post details, comments, replies and your profile are **cached and persisted** between visits
- Saved posts are shown instantly when you open the app offline, with an **offline banner**
- A failed refresh never hides saved content; it shows a "Couldn't refresh" notice instead
- Cache is cleared on logout so one user never sees another's data

### 🌗 Dark Mode

One-click light / dark toggle in the navbar. The choice is remembered, and every screen uses theme tokens so both modes stay consistent.

### 🚫 Not Found (404) Page

A custom fallback for any unmatched route, with a smart "back to feed" or "go to login" action.

---

## 🛠️ Tech Stack

| Category       | Technology                                               |
| -------------- | -------------------------------------------------------- |
| Framework      | React 19 (with TypeScript), built with Vite              |
| Routing        | React Router                                             |
| Styling        | Tailwind CSS v4                                          |
| UI Components  | shadcn/ui (Base UI)                                      |
| Server State   | TanStack React Query (infinite queries, persisted cache) |
| Forms          | React Hook Form + Zod (`@hookform/resolvers`)            |
| HTTP           | Axios                                                    |
| Pagination     | `useInfiniteQuery` + `react-intersection-observer`       |
| Loading States | React Loading Skeleton                                   |
| Notifications  | React Toastify                                           |
| Icons          | Lucide React, React Icons                                |
| Dates          | Day.js, date-fns                                         |
| Auth Helpers   | jwt-decode                                               |
| Backend        | [Route Posts API](https://route-posts.routemisr.com)     |

---

## 📂 Project Structure

The app is organised **by feature**, so everything related to one part of the product lives together.

```
src/
├── api/
│   ├── axios.ts                 # Axios instance + auth interceptor
│   └── auth.api.ts              # Sign-up / login requests
├── components/
│   ├── ui/                      # shadcn/ui primitives (button, dialog, avatar, ...)
│   └── myComponents/
│       └── Navbar/              # Navbar, user menu, theme toggle
├── context/
│   └── AuthContext/             # Token state shared across the app
├── features/
│   ├── auth/                    # LoginForm, RegisterForm, AuthShell, pages
│   ├── posts/                   # PostCard, AddPost, UpdatePost, Feed, LikesDialog, pages
│   ├── comments/                # CommentCard, replies, composer, comments api + types
│   ├── notifications/           # Bell, items, skeletons, notifications api + types
│   ├── profile/                 # ProfileHeader, ProfilePage
│   └── layouts/                 # MainLayout (navbar) and AuthLayout
├── hooks/                       # useMe, useTheme, useNotifications, cache invalidators
├── lib/
│   ├── queryClient.ts           # React Query client + offline persistence
│   ├── dayjs.ts                 # Day.js with relative-time plugin
│   ├── getErrorMessage.ts       # Turns any error into a readable message
│   └── utils.ts                 # shadcn class helper
├── pages/
│   └── NotFound.tsx             # 404 page
├── routes/
│   ├── route.tsx                # Route definitions
│   ├── ProtectedRoute.tsx       # Logged-in only
│   └── AuthRoute.tsx            # Logged-out only
├── App.tsx                      # Providers: query cache, auth, router, toasts
└── main.tsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
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

### Environment Variables

Create a `.env` file in the project root if you want to point the app at a different API:

```bash
VITE_API_URL=https://route-posts.routemisr.com/api
```

Then read it in `src/api/axios.ts`:

```ts
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
```

### Available Scripts

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the development server          |
| `npm run build`     | Type-check and build for production   |
| `npm run preview`   | Preview the production build locally  |
| `npm run lint`      | Run ESLint                            |
| `npm run typecheck` | Run the TypeScript compiler (no emit) |
| `npm run format`    | Format all `.ts` / `.tsx` files       |

---

## 🌐 API

The app talks to the **Route Posts** API (`https://route-posts.routemisr.com/api`). Every protected request sends `Authorization: Bearer <token>`; Axios adds it automatically through a request interceptor, so individual API functions never handle tokens.

Responses follow one contract:

```json
{ "success": true, "message": "success", "data": {}, "meta": {} }
```

| Area          | Endpoints used                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth & Users  | `POST /users/signup`, `POST /users/signin`, `GET /users/profile-data`, `PUT /users/upload-photo`, `PATCH /users/change-password`, `GET /users/suggestions`                |
| Posts & Feed  | `GET /posts`, `GET /posts/feed?only=`, `POST /posts`, `PUT /posts/:id`, `PUT /posts/:id/like`, `GET /posts/:id/likes`, `PUT /posts/:id/bookmark`, `POST /posts/:id/share` |
| Comments      | `GET/POST /posts/:id/comments`, `PUT/DELETE /posts/:id/comments/:commentId`, `PUT .../like`, `GET/POST .../replies`                                                       |
| Notifications | `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`                                                 |

---

## 🗺️ Routing

| Route            | Page                       | Access     |
| ---------------- | -------------------------- | ---------- |
| `/login`         | Login                      | Logged out |
| `/register`      | Sign up                    | Logged out |
| `/`              | Redirects to `/posts`      | Logged in  |
| `/posts`         | All posts                  | Logged in  |
| `/feed`          | Following feed             | Logged in  |
| `/posts/:id`     | Post details with comments | Logged in  |
| `/profile`       | Your profile               | Logged in  |
| `/profile/:id`   | Another user's profile     | Logged in  |
| `/notifications` | All notifications          | Logged in  |
| `*`              | 404 Not Found              | Everyone   |

---

## 🧠 How It Works

### Data fetching

All server data goes through **React Query**. Each list uses `useInfiniteQuery` with the API's pagination metadata to decide whether another page exists, and a sentinel element watched by the Intersection Observer triggers the next fetch.

### Cache invalidation

After a mutation (create, edit, delete, like, comment), small hooks such as `useInvalidatePosts` and `useInvalidateComments` mark the affected queries as stale, so every screen that shows that data refreshes automatically.

### Optimistic updates

Comment likes update the cache immediately and roll back on error, so the interface feels instant even on a slow connection.

### Offline cache

React Query's cache is persisted to local storage under a single key. Only a short allow-list of content queries is saved, old entries are dropped if storage fills up, and the whole cache is wiped on logout. Bump the `buster` value in `src/lib/queryClient.ts` whenever response types change to discard stale saved data.

### Validation

Forms are validated by **Zod** schemas that double as the source of the TypeScript types (`z.infer`), so rules and types never drift apart.

---

## 🎨 Design

- Violet accent with a rose highlight for likes and destructive actions
- Facebook-inspired profile and post cards with rounded corners and soft borders
- Fully responsive across mobile, tablet and desktop breakpoints
- Light and dark themes built on shadcn theme tokens
- Skeleton loaders shaped like the real content, plus empty and error states everywhere
- Accessible by default: labelled inputs, `aria` states on toggles and tabs, keyboard-friendly dialogs and menus

---

## 🧭 Roadmap

- [ ] Change-password page (the API endpoint is already available)
- [ ] Cover photo upload
- [ ] Service worker for offline image caching
- [ ] Custom text when sharing a post
- [ ] Search and user discovery
- [ ] Unit and end-to-end tests

---

## 📄 License

This project is available for personal and educational use. Update this section with your preferred license (e.g. MIT) before publishing.

---

## 🙌 Acknowledgements

- [Route Academy](https://route-posts.routemisr.com): the Route Posts API that powers this project
- [shadcn/ui](https://ui.shadcn.com): component primitives
- [TanStack Query](https://tanstack.com/query): server-state management
- [Lucide](https://lucide.dev) & [React Icons](https://react-icons.github.io/react-icons/): iconography
