const shopContent = document.getElementById('shopContent');
const navItems = document.querySelectorAll('.nav-list li');
const cart = []; // carrito

// Función para mostrar los productos (todos o filtrados)
function mostrarProductos(filtro = "todos") {
  shopContent.innerHTML = ""; // limpiar contenido
  const portada = document.querySelector('.portada');
  if (filtro !== 'todos') {
    portada.style.display = 'none';
  }else{
    portada.style.display = 'block';
  }

  const productosFiltrados =
    filtro === "todos"
      ? productos
      : productos.filter((prod) => prod.categoria === filtro);

  productosFiltrados.forEach((product) => {
    const content = document.createElement('div');
    content.classList.add('card');
    content.innerHTML = `
      <img src="${product.img}" alt="${product.productName}">
      <h3>${product.productName}</h3>
      <p>$${product.price}</p>
    `;
    shopContent.append(content);

    const buyButton = document.createElement('button');
    buyButton.innerText = "Comprar";
    content.append(buyButton);

    buyButton.addEventListener('click', () => {
      const repeat = cart.some((item) => item.id === product.id);
      if (repeat) {
        cart.map((item) => {
          if (item.id === product.id) {
            item.quanty++;
            displayCartCounter();
          }
        });
      } else {
        cart.push({
          id: product.id,
          productName: product.productName,
          price: product.price,
          quanty: product.quanty,
          img: product.img,
        });
        displayCartCounter();
      }
    });
  });
}

// Mostrar todos los productos al cargar la página
mostrarProductos();

// Escuchar clics en el menú de categorías
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const categoria = e.target.textContent.toLowerCase(); // ejemplo: "remeras"
    if (categoria === "inicio") {
      mostrarProductos("todos");
    } else {
      mostrarProductos(categoria);
    }

  });
});
