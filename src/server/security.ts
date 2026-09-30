import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'trilha_sonora_crato_ce_jwt_secure_super_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  isGuest?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Hash a plain password with bcrypt using 10 salt rounds
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare plain password with stored bcrypt hash
 */
export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Generate a signed JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware: Extract and verify Bearer token from Authorization header
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Acesso não autorizado: token não fornecido' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(403).json({ error: 'Token inválido ou expirado' });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Optional authentication: attaches user if token provided, but doesn't block guests
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

/**
 * Middleware: Require ADMIN or OPERATOR role
 */
export function requireAdminOrOperator(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Autenticação necessária' });
    return;
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'OPERATOR') {
    res.status(403).json({ error: 'Permissão insuficiente. Requer privilégios administrativos da Trilha Sonora.' });
    return;
  }

  next();
}

/**
 * Middleware: Require strict ADMIN role
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acesso restrito exclusivamente a Administradores' });
    return;
  }
  next();
}

/**
 * In-memory IP rate limiter for brute-force mitigation on auth endpoints
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(windowMs: number = 60000, maxRequests: number = 30) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({
        error: 'Muitas requisições. Por favor, aguarde alguns instantes por segurança.',
      });
      return;
    }

    entry.count++;
    next();
  };
}
