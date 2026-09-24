export default class ApiError extends Error{
    constructor(statusCode,message,data=null){
        super(message);
        this.statusCode=statusCode;
        this.data=data;
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor)
    }
    
  static badRequest(msg = "Bad Request", data = null) {
    return new ApiError(400, msg, data);
  }
  static notFound(msg = "Resource not found") {
    return new ApiError(404, msg);
  }
  static conflict(msg = "Conflict") {
    return new ApiError(409, msg);
  }
  static internal(msg = "Internal Server Error") {
    return new ApiError(500, msg);
  }
}