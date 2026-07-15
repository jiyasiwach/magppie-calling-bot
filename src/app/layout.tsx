import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Magppie Voice — Calling Bot Console',
  description:
    'Command center for Magppie’s AI automated calling bot: live monitoring, agent builder, campaigns, analytics and compliance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/*
          Fonts loaded via <link> (progressive enhancement) rather than
          next/font/google, so the build never blocks on a font fetch. The page
          renders instantly with the fallbacks in the CSS var chain and swaps in
          the web fonts when they arrive. Font CSS vars are defined in globals.css.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Public+Sans:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
