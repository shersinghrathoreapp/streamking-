import './globals.css'

export const metadata = {
  title: 'StreamKing - YouTube 24x7 Live',
  description: 'YouTube video ko 24x7 live karo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
