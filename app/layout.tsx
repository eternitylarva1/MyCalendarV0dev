import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CalendarSettingsProvider } from "@/context/CalendarSettingsContext" // 导入 CalendarSettingsProvider
import { HolidayProvider } from "@/context/HolidayContext" // 导入 HolidayProvider

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <CalendarSettingsProvider>
          <HolidayProvider>{children}</HolidayProvider>
        </CalendarSettingsProvider>
      </body>
    </html>
  )
}
