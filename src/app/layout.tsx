
import "./globals.css";
import { Cascadia_Mono } from 'next/font/google' // Use underscores for names with spaces
import Navbar from '@/components/Navbar'
import 'katex/dist/katex.min.css';

const cascadia = Cascadia_Mono({
  subsets: ['latin'],
  display: 'swap',

  variable: '--font-cascadia',
})

export const metadata = {
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cascadia.variable}>
      <body className={cascadia.className} suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
