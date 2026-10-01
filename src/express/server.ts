import cors from "cors";
import express from "express";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware,
  createAuthRouter,
} from "./routes/auth.routes";
import { createUsersRouter } from "./routes/users.routes";

const app = express();

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

const repo = new PrismaUserRepository();
const userService = new UserService(repo);
const authService = new AuthService(repo);
const auth = createAuthMiddleware(repo);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(createAuthRouter(authService));
app.use(createUsersRouter(userService, auth));

app.listen(3000, () => {
  console.log("API on http://localhost:3000");
});
