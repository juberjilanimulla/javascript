export function successResponse(response, message, data = null) {
    response.status(200).json({
        status: 200,
        error: false,
        message,
        data
    })
}

export function errorResponse(response, statusCode, message) {
    response.status(statusCode).json({
        status: statusCode,
        error: true,
        message,
        data: null
    })
}