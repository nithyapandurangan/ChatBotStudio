import { useEffect, useState, useRef } from "react"
import { useToast } from "../hooks/use-toast"
import { useMediaQuery } from "../hooks/use-media-query"
import { Button } from "../components/ui/button"

export default function MobileWarningToast({ onContinueAndOpenSidebar }) {
  const { toast, dismiss } = useToast()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [hasDismissed, setHasDismissed] = useState(false)
  const toastId = "mobile-warning-toast"
  const toastShownRef = useRef(false)

  useEffect(() => {
    if (!isDesktop && !hasDismissed && !toastShownRef.current) {
      toast({
        id: toastId,
        title: "Optimized for Desktop",
        description: "For the best experience, please use a laptop or desktop computer.",
        duration: Number.POSITIVE_INFINITY,
        action: (
          <Button
            variant="secondary"
            onClick={() => {
              dismiss()
              setHasDismissed(true)
              onContinueAndOpenSidebar()
            }}
          >
            Still continue
          </Button>

        ),
      })
      toastShownRef.current = true
    } else if (isDesktop && toastShownRef.current) {
      dismiss(toastId)
      toastShownRef.current = false
      setHasDismissed(false)
    }
  }, [isDesktop, hasDismissed, toast, dismiss, onContinueAndOpenSidebar])

  return null
}
