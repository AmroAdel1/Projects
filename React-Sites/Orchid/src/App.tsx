import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AuthContextProvider } from "./context/AuthContext/AuthContextProvider"
import routes from "./routes/route"
import { queryClient, persistOptions } from "@/lib/offline"

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      <AuthContextProvider>
        <RouterProvider router={routes} />
        <ToastContainer position="top-right" autoClose={4000} />
      </AuthContextProvider>
    </PersistQueryClientProvider>
  )
}
