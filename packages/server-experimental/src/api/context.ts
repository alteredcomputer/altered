/**
 * @remarks The initial/base context provided by the handler. Specialize later.
 */
type APIContext = {
    request: {
        headers: Headers
    }
}

export type { APIContext }
