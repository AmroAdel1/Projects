import { QueryClient } from "@tanstack/react-query"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { removeOldestQuery } from "@tanstack/react-query-persist-client"

export const DAY = 1000 * 60 * 60 * 24

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY, // must be >= the persister's maxAge
      staleTime: 1000 * 60,
      networkMode: "offlineFirst", // use the cache, try the network, don't wait for "online"
      retry: 1,
    },
    mutations: { networkMode: "always" }, // fail fast with a toast instead of hanging while offline
  },
})

export const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: "orchid-cache",
  throttleTime: 1000,
  retry: removeOldestQuery, // if storage is full, drop the oldest entry and retry
})

// Only these query keys are saved for offline use
const OFFLINE_KEYS = new Set(["allPosts", "homeFeed", "postDetails", "comments", "replies", "me", "profile", "profile-posts"])

export const persistOptions = {
  persister,
  maxAge: DAY,
  buster: "v1", // change this string if your response types change, to drop old saved data
  dehydrateOptions: {
    shouldDehydrateQuery: (q: { state: { status: string }; queryKey: readonly unknown[] }) =>
      q.state.status === "success" && OFFLINE_KEYS.has(String(q.queryKey[0])),
  },
}

export async function clearOfflineCache() {
  queryClient.clear()
  await persister.removeClient()
}