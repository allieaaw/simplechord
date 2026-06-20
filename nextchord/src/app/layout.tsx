import type { Metadata } from "next"
import { Navbar } from '@/features/components/Navbar'
import "@/shared/styles/styles.css"


export const metadata: Metadata = {
  title: "Simple Chord",
  description: "Simple Chord in a Next.js wrapper",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Jockey+One&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700&display=swap" rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js" />
    </head>
    
      <body>
        <Navbar />
          {children}
      </body>
    </html>
  )
}
