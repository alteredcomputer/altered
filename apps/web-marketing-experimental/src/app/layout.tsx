import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import { viewOptionsScript } from "~/view-options/options"
import "./globals.css"

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono"
})

export const metadata: Metadata = {
    title: {
        template: "%s — ALTERED",
        default: "ALTERED: Knowledge Orchestration Infrastructure"
    },

    description: "The data control platform for humans in the AI era."
}

export const viewport: Viewport = {
    /**
     * @remarks Intentionally unset, since our `color-scheme` override would not line up with the media queries used to set these colors.
     */
    themeColor: []
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html className={geistMono.variable} lang="en" suppressHydrationWarning>
            <head>
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Constant script.
                    dangerouslySetInnerHTML={{ __html: viewOptionsScript }}
                />
            </head>
            <body>{children}</body>
        </html>
    )
}
