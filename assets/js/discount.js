document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('discountedProducts');
    const productosConDescuento = JSON.parse(localStorage.getItem('productosConDescuento')) || [];

    if (productosConDescuento.length === 0) {
        productsContainer.innerHTML = '<p>No hay productos con descuento.</p>';
        return;
    }

    productosConDescuento.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('splide__slide');

        const precioConDescuento = producto.price - (producto.price * producto.discount / 100);

        li.innerHTML = `
            <div class="card" data-name="${producto.name}" data-price="${precioConDescuento}" data-img="${producto.img}" data-discount="${producto.discount}">
                <img src="${producto.img}" alt="${producto.name}">
                <h2>${producto.name}</h2>
                <p>Precio original: <del>${producto.price.toFixed(2)}€</del></p>
                <p>Precio con descuento: <strong>${precioConDescuento.toFixed(2)}€</strong></p>
                <button class="buy-button">Añadir al carrito</button>
                </br>
                </br>
                </br>
            </div>
        `;
        productsContainer.appendChild(li);
    });

    // Inicializar Splide.js
    new Splide('.splide', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        padding: '1rem',
        rewind: false,
        arrows: true,
        breakpoints: {
            768: { perPage: 2 },
            480: { perPage: 1 },
        },
    }).mount();

    // Delegación de eventos para manejar el clic en "Añadir al carrito"
    productsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('buy-button')) {
            const card = event.target.closest('.card');
            if (card) {
                const item = {
                    name: card.dataset.name,
                    price: parseFloat(card.dataset.price),
                    img: card.dataset.img,
                };

                // Añadir al carrito
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(cartItem => cartItem.name === item.name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ ...item, quantity: 1 });
                }

                // Guardar el carrito en localStorage
                localStorage.setItem('cart', JSON.stringify(cart));

                // Renderizar el carrito dinámicamente
                renderCart();
            }
        }
    });

    // Botón para volver a la página principal
    document.getElementById('back-to-home').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Función para renderizar el carrito dinámicamente
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsList = document.getElementById('cartItems');
        const totalPriceElement = document.getElementById('totalPrice');

        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                <div>
                    <div>
                        <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                        <span>${item.name} - ${item.quantity} x ${item.price.toFixed(2)}€</span>
                        <button class="remove-button" style="margin-left: 170px;">Eliminar</button>
                    </div>
                </div>
            `;
 
             cartItemsList.appendChild(li);
         });

            // Calcular el total
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            if (totalPriceElement) {
                totalPriceElement.textContent = `${total.toFixed(2)}€`;
            }
        }

        // Delegar evento para botones "Eliminar"
        cartItemsList.addEventListener('click', event => {
            if (event.target.classList.contains('remove-button')) {
                const index = event.target.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        });
    }

    // Renderizar el carrito al cargar la página
    renderCart();
});
