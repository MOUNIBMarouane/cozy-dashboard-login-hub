
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast();

  // Show only the last toast, if any
  const latestToast = toasts.length ? toasts[0] : null;

  if (!latestToast) return null;

  return (
    <ToastProvider>
      <Toast
        key={latestToast.id}
        open={latestToast.open}
        onOpenChange={(open) => {
          if (!open) dismiss(latestToast.id);
        }}
        className="fixed right-5 bottom-5 z-[1080] w-[345px] border-none bg-[#181e38] shadow-xl rounded-xl animate-fade-in dark:bg-[#181e38] dark:text-blue-100 text-blue-900 flex items-center gap-2"
        style={{
          minHeight: 70,
          paddingLeft: 20,
          paddingRight: 16,
          paddingTop: 14,
          paddingBottom: 14,
          border: "1.5px solid #273052"
        }}
      >
        <div className="flex items-start flex-1">
          {/* Icon */}
          <div className="mr-3 mt-0.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#273052]">
              {/* Use an icon for error/info */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#ea384c" />
                <path d="M12 7.5V13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#fff"/>
              </svg>
            </span>
          </div>
          {/* Message */}
          <div className="flex flex-col gap-1 mr-5">
            {latestToast.title && (
              <ToastTitle className="text-base font-semibold text-white">
                {latestToast.title}
              </ToastTitle>
            )}
            {(latestToast.description || latestToast.title === undefined) && (
              <ToastDescription className="text-sm font-normal text-blue-100 max-w-[260px] break-words">
                {latestToast.description}
              </ToastDescription>
            )}
          </div>
        </div>
        {/* Close/X button */}
        <button
          aria-label="Dismiss"
          className="absolute top-2 right-2 rounded-md hover:bg-[#25306f]/30 p-1 group"
          style={{ lineHeight: 0 }}
          onClick={() => dismiss(latestToast.id)}
        >
          <X className="w-5 h-5 text-blue-200 group-hover:text-red-400" />
        </button>
      </Toast>
      {/* The viewport might not be necessary since we're showing only one toast */}
      {/* <ToastViewport /> */}
    </ToastProvider>
  )
}

