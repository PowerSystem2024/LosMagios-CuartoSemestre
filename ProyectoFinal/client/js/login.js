const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeMessage = document.getElementById("welcomeMessage");
const authModal = document.getElementById("authModal");
const closeModal = document.getElementById("closeModal");
const authTitle = document.getElementById("authTitle");
const authActionBtn = document.getElementById("authActionBtn");
const toggleAuth = document.getElementById("toggleAuth");
const switchToRegister = document.getElementById("switchToRegister");

let isRegister = false;

// Abrir modal
loginBtn.addEventListener("click", () => {
  authModal.style.display = "flex";
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  authModal.style.display = "none";
});

// Alternar entre login y registro
switchToRegister.addEventListener("click", () => {
  isRegister = !isRegister;
  if (isRegister) {
    authTitle.textContent = "Registro de Usuario";
    authActionBtn.textContent = "Registrar";
    switchToRegister.textContent = "Inicia sesión aquí";
  } else {
    authTitle.textContent = "Iniciar Sesión";
    authActionBtn.textContent = "Entrar";
    switchToRegister.textContent = "Regístrate aquí";
  }
});

// Acción principal (login o registro)
authActionBtn.addEventListener("click", async () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const url = isRegister ? "http://localhost:8080/register" : "http://localhost:8080/login";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    if (!isRegister) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username); 
      welcomeMessage.textContent = `Bienvenido, ${username}`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      alert("Usuario registrado con éxito, ahora puedes iniciar sesión.");
    }
    
    authModal.style.display = "none";
  } catch (error) {
    alert(error.message);
  } finally{
    usernameInput.value = "";
    passwordInput.value = "";
  }
});

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  welcomeMessage.textContent = "";
  logoutBtn.style.display = "none";
  loginBtn.style.display = "inline-block";
});


// Verificar si ya hay un token guardado al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      // Decodificar el payload del token (opcional, para mostrar el nombre)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const username = payload.username || "Usuario";

      welcomeMessage.textContent = `Bienvenido, ${username}`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } catch (err) {
      console.error("Token inválido o corrupto:", err);
      localStorage.removeItem("token"); // si hay error, lo eliminamos
    }
  }
});
