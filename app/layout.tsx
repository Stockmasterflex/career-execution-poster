import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Career OS - Career Execution Platform',
  description: 'Your personal career execution and tracking platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <div className="min-h-screen bg-bg-primary">
          {children}
        </div>
      </body>
    </html>
  )
}
