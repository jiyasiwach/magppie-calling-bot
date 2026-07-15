import { Sidebar } from '@/components/shell/sidebar'
import { Topbar } from '@/components/shell/topbar'
import { MobileNav } from '@/components/shell/mobile-nav'
import { CommandPalette } from '@/components/shell/command-palette'
import { Toaster } from '@/components/ui/toaster'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-6 md:pb-8">
          <div className="mx-auto w-full max-w-[1400px] animate-fade-slide-in">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <CommandPalette />
      <Toaster />
    </div>
  )
}
