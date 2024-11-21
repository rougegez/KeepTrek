import { ModernSidebar } from "./Sidebar/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex h-screen">
            <ModernSidebar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

