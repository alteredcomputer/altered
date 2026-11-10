import { setClientPreference } from "./set"

function toggleClientColorScheme() {
    setClientPreference({
        name: "color-scheme",

        value: ({ currentValue: colorScheme }) => {
            if (colorScheme === "light dark") {
                const isSystemSchemeDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches

                return isSystemSchemeDark ? "light" : "dark"
            }

            return colorScheme === "dark" ? "light" : "dark"
        }
    })
}

export { toggleClientColorScheme }
