import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser({ username, password }) {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    returning *
    `;

  // creating hash the password and save into Database

  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function login({ username, password }) {
  const sql = `
  SELECT * FROM users
  WHERE username = $1
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return null;
  return user;
}

export async function getUserById(id) {
  const sql = `SELECT * FROM users WHERE id = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
