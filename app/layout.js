export const metadata = {
  title: 'StreamKing - YouTube 24x7 Live Stream Service',
  description: 'Apne YouTube video ko 24x7 live karo. ₹499 se start',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0, fontFamily:'system-ui'}}>{children}</body>
    </html>
  )
}
