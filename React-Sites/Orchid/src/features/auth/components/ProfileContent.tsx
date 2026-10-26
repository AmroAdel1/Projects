import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import {
  FiAtSign,
  FiCalendar,
  FiCamera,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { getLoggedUserId } from "@/lib/getLoggedUserId"
import { getProfile, getUserProfile } from "../auth.api"
import { useUploadPhoto } from "./useUploadPhoto"
import ProfileSkeleton from "./ProfileSkeleton"
import ChangePasswordDialog from "./ChangePasswordDialog"
import FollowButton from "./FollowButton"
import UserPosts from "./UserPosts"
import SavedPosts from "./SavedPosts"

type Tab = "posts" | "about" | "saved"

export default function ProfileContent() {
  const { id } = useParams()
  const myId = getLoggedUserId()
  const isMe = !id || id === myId

  const [pwOpen, setPwOpen] = useState(false)

  // reset to the Posts tab when navigating between profiles
  const [tab, setTab] = useState<Tab>("posts")
  const upload = useUploadPhoto()

  const myQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isMe,
    select: (res) => res.data,
  })
  const otherQuery = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => getUserProfile(id!),
    enabled: !isMe,
    select: (res) => res.data,
  })

  const query = isMe ? myQuery : otherQuery
  if (query.isLoading) return <ProfileSkeleton />
  if (query.isError && !query.data)
    return <p className="p-4">{getErrorMessage(query.error)}</p>

  const user = query.data?.user
  const isFollowing = !isMe && !!otherQuery.data?.isFollowing

  const tabs: { key: Tab; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "about", label: "About" },
    ...(isMe ? [{ key: "saved" as Tab, label: "Saved" }] : []),
  ]

  return (
    <div className="space-y-4">
      {upload.input} {/* Upload photo input */}
      {/* ===== Header card ===== */}
      <section className="overflow-hidden rounded-2xl border bg-card">
        {/* Cover */}
        <div className="relative h-44 bg-linear-to-br from-violet-600 via-violet-500 to-fuchsia-400 sm:h-64">
          {user?.cover && (
            <img
              src={user.cover}
              alt={user.name}
              className="size-full object-cover"
            />
          )}
        </div>

        <div className="px-4 sm:px-8">
          <div className="-mt-16 flex flex-col gap-4 sm:-mt-10 sm:flex-row sm:items-end">
            {/* Avatar */}
            <button
              type="button"
              aria-label="Change profile photo"
              onClick={upload.open}
              disabled={!isMe || upload.isPending}
              className="group relative size-32 shrink-0 overflow-hidden rounded-full border-4 border-card bg-violet-100 text-5xl font-bold text-violet-700 enabled:cursor-pointer sm:size-40"
            >
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                (user?.name?.[0]?.toUpperCase() ?? <FiUser />)
              )}

              {/* Overlay */}
              {isMe && (
                <span className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <FiCamera className="size-7" />
                </span>
              )}
            </button>

            {/* Name + stats */}
            <div className="min-w-0 flex-1 sm:pb-3">
              <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                {user?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{user?.username} ·{" "}
                <b className="text-foreground">{user?.followersCount}</b>{" "}
                followers ·{" "}
                <b className="text-foreground">{user?.followingCount}</b>{" "}
                following
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:pb-3">
              {isMe ? (
                <>
                  <Button
                    variant="outline"
                    onClick={upload.open}
                    disabled={upload.isPending}
                    className="cursor-pointer"
                  >
                    <FiCamera />{" "}
                    {upload.isPending ? "Uploading..." : "Edit photo"}
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setPwOpen(true)}
                  >
                    <FiLock /> Password
                  </Button>
                </>
              ) : (
                user?._id && (
                  <FollowButton userId={user._id} isFollowing={isFollowing} />
                )
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1 border-t" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px cursor-pointer border-b-[3px] px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* ===== Body ===== */}
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        {/* Intro card */}
        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="mb-3 text-lg font-bold">Intro</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FiAtSign className="text-muted-foreground" />
              {user?.username}
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="text-muted-foreground" />
              <span className="truncate">{user?.email}</span>
            </li>
            <li className="flex items-center gap-3">
              <FiCalendar className="text-muted-foreground" />
              Joined {dayjs(user?.createdAt).format("MMMM YYYY")}
            </li>
          </ul>
        </aside>

        {/* Tab content */}
        <section className="space-y-4">
          {tab === "posts" && user && <UserPosts userId={user._id} />}
          {tab === "about" && (
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="mb-3 text-lg font-bold">About</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <FiUser className="text-muted-foreground" />
                  <span className="capitalize">{user?.gender}</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiCalendar className="text-muted-foreground" />
                  Born {dayjs(user?.dateOfBirth).format("D MMMM YYYY")}
                </li>
              </ul>
            </div>
          )}
          {tab === "saved" && isMe && <SavedPosts />}
        </section>
      </div>
      {isMe && <ChangePasswordDialog isOpen={pwOpen} setIsOpen={setPwOpen} />}
    </div>
  )
}
