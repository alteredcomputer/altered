import {
    BadRequestAPIError,
    InternalServerAPIError,
    UnauthorizedAPIError
} from "./definitions.ts"

const apiErrorMap = {
    [InternalServerAPIError.code]: InternalServerAPIError,
    [BadRequestAPIError.code]: BadRequestAPIError,
    [UnauthorizedAPIError.code]: UnauthorizedAPIError
}

export { apiErrorMap }
