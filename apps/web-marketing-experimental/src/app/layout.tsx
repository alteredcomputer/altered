import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import { applyStoredClientPreferencesScript } from "~/domains/preferences/client/apply-stored"
import { getDefaultClientPreferenceHtmlAttributes } from "~/domains/preferences/client/get-default-html-attributes"
import { MarkdownWatcher } from "~/markdown/watcher/component"
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
        <html
            className={geistMono.variable}
            lang="en"
            suppressHydrationWarning
            {...getDefaultClientPreferenceHtmlAttributes()}
        >
            <head>
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Constant script.
                    dangerouslySetInnerHTML={{
                        __html: applyStoredClientPreferencesScript
                    }}
                />
            </head>
            <body>
                {children}

                <MarkdownWatcher />
            </body>
        </html>
    )
}
