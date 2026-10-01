import jwt from "jsonwebtoken";

export const JWT_SECRET = "adminpanel-dev-secret";

interface TokenPayload {
  userId: number;
}

export function signToken(userId: number): string {
  return jwt.sign({ userId } satisfies TokenPayload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
