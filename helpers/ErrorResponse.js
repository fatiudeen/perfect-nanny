class ErrorResponse extends Error{
    constructor(message, statusCode){
    super(message)
    this.statusCode = statusCode
    }
}

export default ErrorResponse

//return next(new ErrorResponse('error', 200))