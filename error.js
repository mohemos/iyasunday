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
        this.httpStatusCode = 401
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
        this.name = "INVALID_TOKEN";
        this.httpStatusCode = 401
    }
}

module.exports = {
    InvalidTokenError, TokenExpiredError, AuthenticationError, AuthorizationError,EntryExistError, EntryNotFoundError,ValidationError
}