class ValidationError extends Error{
    constructor(message){
        super(message);
        this.name = "VALIDATION_ERROR";
        this.httpStatusCode = 400
    }
}

class EntryExistError extends Error{
    constructor(message){
        super(message);
        this.name = "ENTRY_EXISTS";
        this.httpStatusCode = 409
    }
}

class EntryNotFoundError extends Error{
    constructor(message){
        super(message);
        this.name = "ENTRY_NOT_FOUND";
        this.httpStatusCode = 404
    }
}

class AuthenticationError extends Error{
    constructor(message){
        super(message);
        this.name = "AUTHENTICATION_ERROR";
        this.httpStatusCode = 401
    }
}

class AuthorizationError extends Error{
    constructor(message){
        super(message);
        this.name = "AUTHORISATION_ERROR";
        this.httpStatusCode = 403
    }
} 

class TokenExpiredError extends Error{
    constructor(message){
        super(message);
        this.name = "TOKEN_EXPIRED";
        this.httpStatusCode = 401
    }
}

class InvalidTokenError extends Error{
    constructor(message){
        super(message);
        this.name = "TOKEN_INVALID";
        this.httpStatusCode = 401
    }
}

class PaymentRequiredError extends Error{
    constructor(message){
        super(message);
        this.name = "PAYMENT_REQUIRED";
        this.httpStatusCode = 402
    }
}

const HTTP_STATUS_CODE_ERROR = {
    "400" : "VALIDATION_ERROR",
    "401" : "AUTHENTICATION_ERROR",
    "402" : "PAYMENT_REQUIRED_ERROR",
    "403" : "AUTHORISATION_ERROR",
    "404" : "ENTRY_NOT_FOUND",
    "409" : "ENTRY_EXISTS",
    "500" : "FATAL_ERROR",
}

module.exports = {
    InvalidTokenError, TokenExpiredError, AuthenticationError, AuthorizationError,EntryExistError, EntryNotFoundError,ValidationError, PaymentRequiredError, HTTP_STATUS_CODE_ERROR
}