import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mercadopago from "mercadopago";
import path from "path";
import { fileURLToPath } from "url";

import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "admin",
  port: 5432,
});

const JWT_SECRET = "clave_secreta_segura"

const app = express();
const PORT = 8080;

// 🔧 Necesario para usar __dirname con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔹 Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../client")));
// Configuración de Mercado Pago
mercadopago.configure({
  access_token: "APP_USR-1974533276585591-100711-b432f49c23ae54a798eacc96f6e74bde-2911062078"
});

// Ruta para crear preferencia
app.post("/create_preference", async (req, res) => {
  try {
    const { description, quantity, price } = req.body;
    const preference = {
      items: [{ title: description, quantity, currency_id: "ARS", unit_price: price }],
      back_urls: {
        success: "http://localhost:8080/success",
        failure: "http://localhost:8080/failure",
        pending: "http://localhost:8080/pending"
      },
      
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

// 🔹 Rutas para manejar redirecciones de éxito o fallo
app.get("/success", (req, res) => res.send("✅ Pago exitoso"));
app.get("/failure", (req, res) => res.send("❌ Pago fallido"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});


// 🟢 REGISTRO
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // verificar si ya existe
    const userCheck = await pool.query("SELECT * FROM usersecommerce WHERE username = $1", [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usersecommerce (username, password) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el registro" });
  }
});

// 🔵 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usersecommerce WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "2h" });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el inicio de sesión" });
  }
});