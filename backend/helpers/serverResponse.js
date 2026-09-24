export function successResponse(response, statusCode = 200, message = "Success", data = null) {
  return response.status(statusCode).json({
    status: statusCode,
    error: false,
    message,
    data,
  });
}

export function errorResponse(response, statusCode = 500, message = "Something went wrong", data = null) {
  return response.status(statusCode).json({
    status: statusCode,
    error: true,
    message,
    data,
  });
}

export default function sendResponse(response, statusCode = 200, message = "Success", data = null) {
  return successResponse(response, statusCode, message, data);
}