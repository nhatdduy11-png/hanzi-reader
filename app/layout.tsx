import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { SettingsProvider } from '@/components/settings-provider'
import { AuroraBackground } from '@/components/aurora-background'
import { SiteHeader } from '@/components/site-header'
import { BottomNav } from '@/components/bottom-nav'
import { ScrollWatcher } from '@/components/scroll-watcher'
import './globals.css'

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans-ui',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Hanzi Studio — Học tiếng Trung giản thể, phồn thể & tiếng Anh',
    template: '%s · Hanzi Studio',
  },
  description:
    'Học tiếng Trung (giản thể và phồn thể), tiếng Anh và tiếng Việt qua truyện đọc, giọng AI, từ vựng từ cơ bản đến bản địa và kiểm tra chính tả bằng AI.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#0d1022',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var n=navigator,c=n.connection;if((n.deviceMemory&&n.deviceMemory<=4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(c&&c.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('lite')}catch(e){}",
          }}
        />
      </head>
      <body className={`${sans.variable} antialiased`}>
        <SettingsProvider>
          <AuroraBackground />
          <ScrollWatcher />
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 sm:px-6 md:pb-20 md:pt-10">
            {children}
          </main>
          <BottomNav />
        </SettingsProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
