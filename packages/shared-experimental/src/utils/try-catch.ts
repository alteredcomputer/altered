type TryCatchSuccess<Data> = { data: Data; error?: never }

type TryCatchFailure<_Error extends Error = Error> = {
    data?: never
    error: _Error
}

type TryCatchResult<Data, _Error extends Error = Error> =
    | TryCatchSuccess<Data>
    | TryCatchFailure<_Error>

type Thenable<Data, _Promise extends Promise<Data> = Promise<Data>> =
    | Data
    | _Promise

type Callable<Data, _Function extends () => Data = () => Data> =
    | Data
    | _Function

function isThenable<Data, _Promise extends Promise<Data>>(
    value: Thenable<Data>
): value is _Promise {
    if (value instanceof Promise) return true

    const isNonNativePromise =
        value !== null &&
        (typeof value === "object" || typeof value === "function") &&
        "then" in value &&
        typeof (value as { then: unknown }).then === "function"

    return isNonNativePromise
}

function isCallable<Data, _Function extends () => Data>(
    _function: Callable<Data>
): _function is _Function {
    return typeof _function === "function" && !isThenable(_function)
}

/**
 * @remarks Legacy helper, logic may need some tweaking.
 */
async function tryCatch<Data, _Error extends Error = Error>(
    _function: Callable<Thenable<Data>>
): Promise<TryCatchResult<Data, _Error>> {
    try {
        if (isCallable(_function)) {
            const result = _function()

            return isThenable(result)
                ? { data: await result }
                : { data: result }
        }

        return isThenable(_function)
            ? { data: await _function }
            : { data: _function }
    } catch (error) {
        return { error: error as _Error }
    }
}

export {
    type Callable as Unstable_Callable,
    isCallable as unstable_isCallable,
    isThenable as unstable_isThenable,
    type Thenable as Unstable_Thenable,
    type TryCatchFailure as Unstable_TryCatchFailure,
    type TryCatchResult as Unstable_TryCatchResult,
    type TryCatchSuccess as Unstable_TryCatchSuccess,
    tryCatch as unstable_tryCatch
}
