type APIRequestContext = {
    request: {
        headers: Headers
    }
}

// biome-ignore lint/complexity/noBannedTypes: Placeholder.
type APIAuthContext = {}

type APIContext = APIRequestContext & APIAuthContext

export type { APIAuthContext, APIContext, APIRequestContext }
