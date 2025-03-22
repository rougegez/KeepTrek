import { AlertTriangle, CheckCircle, Info, Loader, XCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          // toast:
          //   "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          // Default styling from shadcn, below is customised
          toast:
          "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // https://github.com/shadcn-ui/ui/issues/3579 - ! is used to override the default styles
          // https://github.com/emilkowalski/sonner/issues/417 - code for shifting the close button
          closeButton:
            `group-[.toast]:!bg-white group-[.toast]:!text-muted-foreground group-[.toast]:border-none group-[.toast]:!shadow-lg 
            group-[.toast]:!start-auto group-[.toast]:!end-0 group-[.toast]:!translate-x-[35%] group-[.toast]:!translate-y-[-35%]`,
        },
      }}
      // From https://github.com/shadcn-ui/ui/issues/2254#issuecomment-2221240785
      icons={{
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        loading: <Loader className="h-5 w-5 text-gray-500 animate-spin" />,
    }}
      {...props} />)
  );
}

export { Toaster }
