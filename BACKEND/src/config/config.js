const isProduction = process.env.NODE_ENV === 'production' || process.env.FRONTEND_URL?.startsWith('https://');

export const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60,
}