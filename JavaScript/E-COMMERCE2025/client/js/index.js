const shopContent = document.getElementById('shopContent');

productos.forEach((product) => {
    const content = document.createElement('div');
    content.innerHTML = `
    <img src="${product.img}" alt="">
    <h3>${product.producName}</h3>
    <p>${product.price}</p>
    `;
    shopContent.append(content);
})