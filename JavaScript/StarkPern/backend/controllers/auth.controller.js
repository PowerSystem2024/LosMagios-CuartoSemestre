import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import md5 from "md5";
import joi from "joi";


const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const signupSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

  if (result.rowCount === 0) {
    return res.status(400).json({ message: "El correo no está registrado" });
  }

  const validPassword = await bcrypt.compare(password, result.rows[0].password);

  if (!validPassword) {
    return res.status(400).json({ message: "La contraseña es incorrecta" });
  }

  const token = await createAccessToken({ id: result.rows[0].id });
  console.log(result);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 24 * 1000, // 1 día
  });

  return res.json(result.rows[0]);
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const gravatar = `https://gravatar.com/avatar/${md5(email)}`;

    const result = await pool.query(
      "INSERT INTO usuarios (name, email, password, gravatar) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, gravatar]
    );

    const token = await createAccessToken({ id: result.rows[0].id });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 24 * 1000,
    });

    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Sesión cerrada" });
};

export const profile = async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [req.usuarioId]);
  return res.json(result.rows[0]);
};

