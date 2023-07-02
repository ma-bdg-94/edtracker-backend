import { sign, verify } from 'jsonwebtoken'

export const signToken = (payload: any) => {
  return new Promise((resolve, reject) => {
    sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: process.env.NODE_ENV === 'development' ? '1h' : '24h' },
      (error, token) => {
        if (error) reject(error)
        resolve(token)
      }
    )
  })
}

export const verifyToken = (payload: any) => {
  return verify(payload, process.env.JWT_SECRET!)
}
