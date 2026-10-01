import { RequestHandler, Router } from "express";
import { AppError } from "../../domain/errors";
import { UserService } from "../../services/user.service";
import { AuthRequest } from "./auth.routes";

export function createUsersRouter(
  userService: UserService,
  auth: RequestHandler
): Router {
  const router = Router();

  router.get("/users/all", auth, async (request: AuthRequest, response) => {
    try {
      if (!request.user) {
        response.status(401).json({ message: "Unauthorized" });

        return;
      }
      response.json(await userService.list(request.user));
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message });

        return;
      }

      throw error;
    }
  });

  router.patch("/users/update/:id", auth, async (request: AuthRequest, response) => {
    try {
      if (!request.user) {
        response.status(401).json({ message: "Unauthorized" });
        return;
      }

      const id = Number(request.params.id);
      const updated = await userService.update(id, request.user, request.body);

      response.json(updated);
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message });

        return;
      }

      throw error;
    }
  });

  router.delete("/users/:id", auth, async (request: AuthRequest, response) => {
    try {
      if (!request.user) {
        response.status(401).json({ message: "Unauthorized" });

        return;
      }

      const id = Number(request.params.id);
      await userService.delete(id, request.user);

      response.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message });

        return;
      }

      throw error;
    }
  });

  router.post("/users/create", auth, async (request: AuthRequest, response) => {
    try {
      if (!request.user) {
        response.status(401).json({ message: "Unauthorized" });

        return;
      }

      await userService.create(request.body, request.user);

      response.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message });

        return;
      }

      throw error;
    }
  });

  return router;
}
