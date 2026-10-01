import { RequestHandler, Router } from "express";
import { AppError } from "../../domain/errors";
import { UserService } from "../../services/user.service";
import { AuthRequest } from "./auth.routes";

export function createUsersRouter(
  userService: UserService,
  auth: RequestHandler
): Router {
  const router = Router();

  router.get("/users", auth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      res.json(await userService.list(req.user));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      throw error;
    }
  });

  router.patch("/users/:id", auth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const id = Number(req.params.id);
      const updated = await userService.update(id, req.user, req.body);
      res.json(updated);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      throw error;
    }
  });

  router.delete("/users/:id", auth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const id = Number(req.params.id);
      await userService.delete(id, req.user);
      res.status(204).send();
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
