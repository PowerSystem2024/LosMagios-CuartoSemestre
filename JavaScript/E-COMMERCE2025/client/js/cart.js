const modalContainer = document.getElementById('modal-container');
const modalOverlay = document.getElementById('modal-overlay');

const cartBtn = document.getElementById('cart-btn');

function displayCart() {
    modalContainer.innerHTML = '';
    modalContainer.style.display = 'block';
    modalOverlay.style.display = 'block';

    //modal header
    const modalHeader = document.createElement('div');
    const modalClose = document.createElement('div');
    modalClose.innerText = '❌';
    modalClose.className = 'modal-close';
    
    modalClose.addEventListener('click', ()=>{
        modalContainer.style.display = 'none';
        modalOverlay.style.display = 'none';
    })

    modalHeader.append(modalClose);

    const modalTitle = document.createElement('div');
    modalTitle.innerText = 'Cart';
    modalTitle.className = 'modal-title';
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);
}

cartBtn.addEventListener('click', displayCart);