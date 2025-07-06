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
            const priceText = priceEl.textContent.trim().split(' ')[0].replace(/[^\d,\.]/g, '').replace('.', '').replace(',', '.');
            total += parseFloat(priceText) || 0;
        });
        if (cartTotalAmount) cartTotalAmount.textContent = `$${total.toLocaleString()}`;
    }

    // Cambiar color al seleccionar opción de productos
const options = document.querySelectorAll('.container-options span');
if (options.length > 0) {
options.forEach(option => {
    option.addEventListener('click', function() {
    options.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
        });
    });
}

  // Búsqueda de productos (resultados aparte)
const searchForm = document.querySelector('.search-form');
const searchInput = searchForm ? searchForm.querySelector('input[type="search"]') : null;
const allProducts = document.querySelectorAll('.card-product');
const resultsContainer = document.getElementById('search-results');

if (searchForm && searchInput && allProducts.length > 0 && resultsContainer) {
    searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = searchInput.value.trim().toLowerCase();
      resultsContainer.innerHTML = ''; // Limpia resultados anteriores

    if (texto === '') {
        resultsContainer.innerHTML = '';
        return;
    }

    let encontrados = [];
    allProducts.forEach(card => {
        const nombre = card.querySelector('h3').textContent.toLowerCase();
        if (nombre.includes(texto)) {
        encontrados.push(nombre);
        }
    });

    if (encontrados.length > 0) {
        resultsContainer.innerHTML = `<p>Resultados encontrados:</p><ul>${encontrados.map(n => `<li>${n}</li>`).join('')}</ul>`;
    } else {
        resultsContainer.innerHTML = '<p>No se encontraron productos.</p>';
    }
    });

    // Limpia resultados si el campo se vacía
    searchInput.addEventListener('input', function() {
    if (this.value.trim() === '') {
        resultsContainer.innerHTML = '';
    }
    });
}

    // Agregar productos al carrito
    addCartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            cartCount++;
            if (cartNumber) cartNumber.textContent = `(${cartCount})`;

            const card = btn.closest('.card-product');
            const img = card.querySelector('.container-img img');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').childNodes[0].nodeValue.trim();

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

            const emptyMsg = cartItems.querySelector('.empty-cart');
            if (emptyMsg) emptyMsg.remove();
            cartItems.appendChild(item);

            // Eliminar producto sin cerrar el carrito
            item.querySelector('.remove-cart-item').addEventListener('click', function(e) {
                e.stopPropagation();
                item.remove();
                cartCount--;
                if (cartNumber) cartNumber.textContent = `(${cartCount})`;
                updateCartTotal();
                if (cartItems.children.length === 0) {
                    cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío.</p>';
                    if (cartTotalAmount) cartTotalAmount.textContent = '$0';
                }
            });

            // Abrir el carrito al agregar producto
            if (cartPanel && !cartPanel.classList.contains('open')) {
                cartPanel.classList.add('open');
            }
            updateCartTotal();
        });
    });

    // Cerrar carrito solo con la X
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            if (cartPanel) cartPanel.classList.remove('open');
        });
    }

    // Abrir carrito desde el icono de usuario
    const basketIcon = document.querySelector('.container-user .fa-basket-shopping');
    if (basketIcon && cartPanel) {
        basketIcon.addEventListener('click', function() {
            cartPanel.classList.add('open');
        });
    }

    // Abrir carrito al hacer click en el icono del carrito
    const shoppingCart = document.querySelector('.content-shopping-cart');
    if (shoppingCart && cartPanel) {
        shoppingCart.addEventListener('click', function() {
            cartPanel.classList.add('open');
        });
    }

    // Corazón de favoritos
    document.querySelectorAll('.card-product').forEach(card => {
        const heart = card.querySelector('.fa-heart');
        if (heart) {
            heart.addEventListener('click', function(e) {
                e.target.classList.toggle('favorito');
            });
        }
    });

    // Mostrar/ocultar contenido adicional al hacer click en "Leer más"
    document.querySelectorAll('.btn-read-more').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const masContenido = this.parentElement.querySelector('.mas-contenido');
            if (masContenido && (masContenido.style.display === "none" || masContenido.style.display === "")) {
                masContenido.style.display = "inline";
                this.textContent = "Leer menos";
            } else if (masContenido) {
                masContenido.style.display = "none";
                this.textContent = "Leer más";
            }
        });
    });

    // Modal para imagen ampliada
    

    // Finalizar compra: redirige a pago.html si hay productos
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartCount > 0) {
                window.location.href = "pago.html";
            } else {
                alert('El carrito está vacío. Agrega productos para continuar.');
            }
        });

        checkoutBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#28a745';
        });
        checkoutBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '';
        });
        checkoutBtn.addEventListener('mousedown', function() {
            this.style.backgroundColor = '#218838';
        });
        checkoutBtn.addEventListener('mouseup', function() {
            this.style.backgroundColor = '#28a745';
        });
    }

  // Lupa y ojo para ampliar imagen
document.querySelectorAll('.fa-magnifying-glass, .fa-eye').forEach(function(icono) {
    icono.addEventListener('click', function(e) {
    e.stopPropagation();
      // Busca la imagen asociada al producto/blog
    let card = icono.closest('.card-blog') || icono.closest('.card-product');
    let img = card ? card.querySelector('img') : null;
    if (img) {
        document.getElementById('modal-img-content').src = img.src;
        document.getElementById('modal-img').style.display = 'flex';
    }
    });
});

  // Cerrar modal al hacer click en la X o fuera de la imagen
document.getElementById('close-modal-img').addEventListener('click', function() {
    document.getElementById('modal-img').style.display = 'none';
    document.getElementById('modal-img-content').src = '';
});
document.getElementById('modal-img').addEventListener('click', function(e) {
    if (e.target === this) {
    this.style.display = 'none';
    document.getElementById('modal-img-content').src = '';
    }
});
});
