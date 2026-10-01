import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { AppError } from "../../domain/errors";
import { User } from "../../domain/types";
import { verifyToken } from "../../lib/jwt";
import { UserRepository } from "../../repositories/user.repository";
import { AuthService } from "../../services/auth.service";

export interface AuthRequest extends Request {
  user?: User;
}

export function createAuthMiddleware(
  repo: UserRepository
): RequestHandler {
  return async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    const token = header.slice("Bearer ".length);

    try {
      const payload = verifyToken(token);
      const user = await repo.findById(payload.userId);

      if (!user) {
        next(new AppError("Unauthorized", 401));
        return;
      }

      req.user = user;
      next();
    } catch {
      next(new AppError("Unauthorized", 401));
    }
  };
}

export function createAuthRouter(authService: AuthService): Router {
  const router = Router();

  router.post("/auth/login", async (req, res) => {
    try {
      const result = await authService.login(
        req.body.email as string | undefined,
        req.body.password as string | undefined
      );
      res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      throw error;
    }
  });

  router.post("/auth/register", async (req, res) => {
    try {
      const result = await authService.register(
          req.body.name as string | undefined,
          req.body.email as string | undefined,
          req.body.password as string | undefined
      );
      res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      throw error;
    }
  });

  return router;
}
