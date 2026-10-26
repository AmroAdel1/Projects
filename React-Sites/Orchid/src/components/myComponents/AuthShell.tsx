import type { ReactNode } from "react"

interface Props {
  title: string
  sub: string
  children: ReactNode
  foot: ReactNode
}

export default function AuthShell({ title, sub, children, foot }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-violet-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-violet-500" />
        <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-violet-700" />
        <span className="relative text-2xl font-extrabold tracking-tight">
          orchid
        </span>
        <p className="relative max-w-sm text-4xl leading-tight font-extrabold tracking-tight">
          Say what you're thinking. Find the people who get it.
        </p>
      </div>
      <div className="grid place-items-center p-6 py-10">
        <div className="w-full max-w-sm">
          <span className="mb-6 block text-xl font-extrabold tracking-tight text-violet-600 lg:hidden">
            orchid
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1 mb-6 text-muted-foreground">{sub}</p>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {foot}
          </p>
        </div>
      </div>
    </div>
  )
}
