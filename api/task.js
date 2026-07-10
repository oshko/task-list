import express from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
} from "#db/queries/tasks";

const router = express.Router();

// every route below requires a valid token
router.use(requireUser);

router
  .route("/")
  .get(async (req, res) => {
    const tasks = await getTasksByUserId(req.user.id);
    res.send(tasks);
  })
  .post(requireBody(["title", "done"]), async (req, res) => {
    const { title, done } = req.body;
    const task = await createTask({ title, done, user_id: req.user.id });
    res.status(201).send(task);
  });

// runs before any /:id handler — fetches the task and checks ownership
router.param("id", async (req, res, next, id) => {
  const task = await getTaskById(id);
  if (!task) return res.status(404).send("Task not found.");
  if (task.user_id !== req.user.id) return res.status(403).send("Forbidden");
  req.task = task;
  next();
});

router
  .route("/:id")
  .put(requireBody(["title", "done"]), async (req, res) => {
    const { title, done } = req.body;
    const task = await updateTask({ id: req.task.id, title, done });
    res.send(task);
  })
  .delete(async (req, res) => {
    await deleteTask(req.task.id);
    res.sendStatus(204);
  });

export default router;
