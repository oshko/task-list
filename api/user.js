import express from "express";
import { createUser, login } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const userInfo = await createUser({ username, password });
    const token = createToken({ id: userInfo.id });
    res.status(201).send(token);
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const userInfo = await login({ username, password });
    if (!userInfo) return res.status(401).send("Invalid username or password");
    const token = createToken({ id: userInfo.id });
    res.send(userInfo.username);
  },
);

export default router;
