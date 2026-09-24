import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { pool } from "../db.js"
import { errorResponse } from "./serverResponse.js"

const secretKey = process.env.JWT_SECRET || crypto.randomBytes(48).toString("hex")
const sessions = new Map()

export function generateAccessToken(id, email, role) {
    const sessionid = createSession(id)
    const tokenPayload = { id, email, role, sessionid }

    return {
        encoded_token: jwt.sign({ id, email, role }, secretKey, { expiresIn: "1d" }),
        public_token: jwt.sign(tokenPayload, secretKey, { expiresIn: "1d" })
    }
}

export function validatetoken(token) {
    return jwt.verify(token, secretKey)
}

export function isAdminMiddleware(request, response, next) {
    if (response.locals.role !== "admin") {
        errorResponse(response, 403, "user not authorized")
        return
    }
    next()
}

export async function authMiddleware(request, response, next) {
    const authHeader = request.headers.authorization || request.query.token
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader

    if (!token) {
        errorResponse(response, 401, "token not found")
        return
    }

    try {
        const decoded = jwt.verify(token, secretKey)
        if (!decoded.role || !decoded.email) {
            errorResponse(response, 401, "user not authorized")
            return
        }

        const [sessions] = await pool.query(
            "SELECT session_id FROM auth_sessions WHERE session_id = ? AND user_id = ? AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1",
            [decoded.sessionid, decoded.id]
        )
        if (!sessions[0]) {
            errorResponse(response, 401, "session expired or revoked")
            return
        }

        response.locals.id = decoded.id
        response.locals.role = decoded.role
        response.locals.email = decoded.email
        response.locals.sessionid = decoded.sessionid
        request.authToken = decoded
        next()
    } catch (error) {
        errorResponse(response, 401, "user not authorized")
    }
}

export function bcryptPassword(password) {
    return bcrypt.hashSync(password, 10)
}

export function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}

export function createSession(id) {
    const sessionId = uuidv4()
    sessions.set(id, sessionId)
    return sessionId
}

export function getSessionData(id) {
    return sessions.get(id) || null
}

export function deleteSession(id) {
    return sessions.delete(id)
}

export async function Admin() {
    await pool.query("SELECT 1")
}

export default async function getnumber(id) {
    return id
}
