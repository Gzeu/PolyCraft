import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/components/query-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PolyCraft - AI-Powered Multi-Modal Generation',
  description: 'Craft the Future with AI-Powered Multi-Modal Generation. Create text, images, and audio with cutting-edge AI technology.',
  keywords: ['AI', 'generation', 'multi-modal', 'text', 'image', 'audio', 'pollinations'],
  authors: [{ name: 'PolyCraft Team' }],
  creator: 'PolyCraft',
  publisher: 'PolyCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://poly-craft.vercel.app',
    siteName: 'PolyCraft',
    title: 'PolyCraft - AI-Powered Multi-Modal Generation',
    description: 'Craft the Future with AI-Powered Multi-Modal Generation',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PolyCraft - AI-Powered Generation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PolyCraft - AI-Powered Multi-Modal Generation',
    description: 'Craft the Future with AI-Powered Multi-Modal Generation',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
