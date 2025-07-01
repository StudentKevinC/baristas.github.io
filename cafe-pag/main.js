document.addEventListener('DOMContentLoaded', function() {
    let cartCount = 0;
    const cartNumber = document.querySelector('.content-shopping-cart .number');
    const addCartButtons = document.querySelectorAll('.add-cart');
    const cartPanel = document.getElementById('cart-panel');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    function updateCartTotal() {
        let total = 0;
        document.querySelectorAll('.cart-item-price').forEach(priceEl => {
            // Extrae solo el primer número (el precio actual, no el tachado)
            const priceText = priceEl.textContent.trim().split(' ')[0].replace(/[^\d,\.]/g, '').replace('.', '').replace(',', '.');
            total += parseFloat(priceText) || 0;
        });
        cartTotalAmount.textContent = `$${total.toLocaleString()}`;
    }

    addCartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            cartCount++;
            cartNumber.textContent = `(${cartCount})`;

            // Obtener info del producto
            const card = btn.closest('.card-product');
            const img = card.querySelector('.container-img img');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').childNodes[0].nodeValue.trim();

            // Crear item en el carrito
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <img src="${img.src}" alt="${title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${title}</div>
                    <div class="cart-item-price">${price}</div>
                </div>
                <button class="remove-cart-item" title="Quitar">&times;</button>
            `;

            // Quitar mensaje de vacío si es el primer producto
            const emptyMsg = cartItems.querySelector('.empty-cart');
            if (emptyMsg) emptyMsg.remove();
            cartItems.appendChild(item);

            // Evento para quitar el producto
            item.querySelector('.remove-cart-item').addEventListener('click', function() {
                item.remove();
                cartCount--;
                cartNumber.textContent = `(${cartCount})`;
                updateCartTotal();
                if (cartItems.children.length === 0) {
                    cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío.</p>';
                    cartTotalAmount.textContent = '$0';
                }
            });

            cartPanel.classList.add('open');
            updateCartTotal();
        });
    });

    // Cerrar carrito
    closeCartBtn.addEventListener('click', function() {
        cartPanel.classList.remove('open');
    });

    // Abrir carrito al hacer click en el ícono del carrito en la cabecera
document.querySelector('.container-user .fa-basket-shopping').addEventListener('click', function() {
    cartPanel.classList.add('open');
});

document.querySelectorAll('.card-product').forEach(card => {
    // Favoritos (corazón)
    card.querySelector('.fa-heart')?.addEventListener('click', function(e) {
        e.target.classList.toggle('favorito');
    });
});

    // Abrir carrito al hacer click en el icono del carrito
    document.querySelector('.content-shopping-cart').addEventListener('click', function() {
        cartPanel.classList.add('open');
    });
});