document.addEventListener('DOMContentLoaded', () => {
    const cartItemsElement = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const paymentDetailsElement = document.getElementById('paymentDetails');
    const confirmPurchaseButton = document.getElementById('confirmPurchase');

    // Cargar carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('cart')) || []; // Unificación de clave
    const metodoDePago = JSON.parse(localStorage.getItem('metodoDePago'));

    // Mostrar los productos del carrito
    function mostrarCarrito() {
        if (carrito.length === 0) {
            cartItemsElement.innerHTML = '<p>El carrito está vacío.</p>';
            confirmPurchaseButton.disabled = true;
            return;
        }

        cartItemsElement.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');

            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;

            const details = document.createElement('div');
            details.classList.add('item-details');
            details.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <p>Cantidad: ${item.quantity}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}€</p>
            `;

            li.appendChild(img);
            li.appendChild(details);
            cartItemsElement.appendChild(li);

            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = `${total.toFixed(2)}€`;
        confirmPurchaseButton.disabled = !metodoDePago; // Habilita si hay método de pago
    }

    // Mostrar método de pago
    function mostrarMetodoDePago() {
        if (!metodoDePago) {
            paymentDetailsElement.innerHTML = `
                <p>No hay método de pago configurado.</p>
                <button id="addPaymentMethod">Agregar Método de Pago</button>
            `;

            document.getElementById('addPaymentMethod').addEventListener('click', () => {
                window.location.href = 'payment.html';
            });
        } else {
            paymentDetailsElement.innerHTML = `
                <p><strong>Nombre del titular:</strong> ${metodoDePago.name}</p>
                <p><strong>Número de tarjeta:</strong> **** **** **** ${metodoDePago.cardNumber.slice(-4)}</p>
                <button id="changePaymentMethod">Cambiar Método de Pago</button>
            `;

            document.getElementById('changePaymentMethod').addEventListener('click', () => {
                window.location.href = 'payment.html';
            });
        }

        confirmPurchaseButton.disabled = carrito.length === 0 || !metodoDePago;
    }

    // Confirmar compra
    confirmPurchaseButton.addEventListener('click', () => {
        if (!metodoDePago || carrito.length === 0) {
            alert('Por favor, asegúrate de que el carrito y el método de pago estén configurados.');
            return;
        }

        alert('Compra realizada con éxito. Gracias por tu pedido.');
        localStorage.removeItem('cart'); // Vaciar el carrito
        window.location.href = 'index.html'; // Redirigir a la página principal
    });

    // Inicializar
    mostrarCarrito();
    mostrarMetodoDePago();
});
