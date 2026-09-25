export function successResponse(res, message, data = null) {
  return res.status(200).json({
    status: 200,
    error: false,
    message,
    data,
  });
}

export function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    status: statusCode,
    error: true,
    message,
    data: null,
  });
}