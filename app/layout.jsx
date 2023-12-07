// "use strict";
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

import Navbar from './components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'D.A.O.',
  description: 'A decentralized autonomous organization for everyone.',
}

export default function RootLayout({ children }) {
  return (
    // <React.StrictMode>
      <html lang="en">
        <body className={inter.className}>
          <link rel="icon" href="/icon.png" sizes="any" />
          <Navbar/>
          {children}
        </body>
      </html>
    // </React.StrictMode>
  )
}
