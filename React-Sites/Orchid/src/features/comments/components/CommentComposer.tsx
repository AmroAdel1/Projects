import { useRef, useState } from "react"
import { ImagePlus, Loader2, SendHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  placeholder: string
  submitLabel: string
  onSubmit: (content: string, file: File | null) => Promise<unknown>
  onCancel?: () => void
  initial?: string
  existingImage?: string
  autoFocus?: boolean
}

export default function CommentComposer({
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
  initial = "",
  existingImage,
  autoFocus,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [imgPrev, setImgPrev] = useState<null | string>(null)
  const [busy, setBusy] = useState(false)

  function addImg(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader()
    const isFileExist = e.target.files?.[0]
    if (isFileExist && e.target.files) {
      reader.readAsDataURL(e.target.files[0])
      reader.onload = function () {
        if (typeof reader.result === "string") {
          setImgPrev(reader.result)
        }
      }
    }
  }

  function removeImg() {
    setImgPrev(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function submit() {
    const content = textareaRef.current?.value.trim()
    const file = fileRef.current?.files?.[0] ?? null
    if (!content) return

    setBusy(true)
    try {
      await onSubmit(content, file)
      if (textareaRef.current) textareaRef.current.value = initial
      removeImg()
    } catch {
      /* the caller shows the error toast */
    } finally {
      setBusy(false)
    }
  }

  const shownImage = imgPrev ?? existingImage

  return (
    <div className="rounded-2xl border bg-muted/40 p-2 transition-colors focus-within:border-violet-400 focus-within:bg-background">
      <Textarea
        ref={textareaRef}
        defaultValue={initial}
        autoFocus={autoFocus}
        disabled={busy}
        rows={1}
        aria-label={placeholder}
        placeholder={placeholder}
        className="max-h-40 min-h-10 resize-none border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
      />

      {shownImage && (
        <div className="relative m-2 w-fit">
          <img
            src={shownImage}
            alt="Attachment"
            className="max-h-44 rounded-xl border object-cover"
          />
          {imgPrev && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Discard new image"
              className="absolute top-1.5 right-1.5 size-6 cursor-pointer rounded-full"
              onClick={removeImg}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center gap-1">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => addImg(e)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Attach an image"
          className="size-8 cursor-pointer text-muted-foreground"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="size-[18px]" />
        </Button>
        <div className="ml-auto flex items-center gap-1">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={busy}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            aria-label={submitLabel}
            disabled={busy}
            onClick={submit}
            className="cursor-pointer gap-1.5 rounded-full bg-violet-600 px-3 hover:bg-violet-700"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
            <span className="hidden sm:inline">{submitLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
