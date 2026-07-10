import express from "express";
import userRoutes from "#api/user";
import taskRoutes from "#api/task";
import getUserFromToken from "#middleware/getUserFromToken";

//express
const app = express();

//body parser
app.use(express.json());

// user from token
app.use(getUserFromToken);

// users route
app.use("/users", userRoutes);
// tasks route
app.use("/tasks", taskRoutes);

// error handler
app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
