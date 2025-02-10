document.addEventListener("DOMContentLoaded", () => {
    // Variables globales
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Selección de elementos
    const cartModal = document.getElementById("cartModal");
    const cartItemsList = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");
    const emptyCartButton = document.getElementById("emptyCartButton");
    const viewCartButton = document.querySelectorAll("#view-cart");
    const closeModal = document.getElementById("closeModal");
    const checkoutButton = document.getElementById("checkout-btn");
    const discountButton = document.getElementById("discount-btn");

    // Función para guardar el carrito en localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Función para calcular el total
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (totalPriceElement) {
            totalPriceElement.textContent = `${total.toFixed(2)}€`;
        }
    }

    // Función para renderizar el carrito
    function renderCart() {
        if (cartItemsList) {
            cartItemsList.innerHTML = "";
            cart.forEach((item, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px;">
                    <span>${item.name} - ${item.quantity} x ${item.price}€</span>
                `;
                const removeButton = document.createElement("button");
                removeButton.textContent = "Eliminar";
                removeButton.onclick = () => {
                    cart.splice(index, 1);
                    saveCart();
                    renderCart();
                    calculateTotal();
                };
                li.appendChild(removeButton);
                cartItemsList.appendChild(li);
            });
            calculateTotal();
            saveCart();
        }
    }

    // Función para añadir al carrito
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        renderCart();
    }

    // Eventos de visualización del carrito
    if (viewCartButton) {
        viewCartButton.forEach(btn =>
            btn.addEventListener("click", () => {
                if (cartModal) cartModal.style.display = "block";
            })
        );
    }

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            if (cartModal) cartModal.style.display = "none";
        });
    }

    if (emptyCartButton) {
        emptyCartButton.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
        });
    }

    // Asignar evento a los botones "Añadir al carrito"
    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", event => {
            const card = event.target.closest(".card");
            const item = {
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                img: card.dataset.img
            };
            addToCart(item);
        });
    });

    // Redirigir al pago si hay productos en el carrito
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("El carrito está vacío. Añade productos antes de realizar el pago.");
            } else {
                localStorage.setItem("cart", JSON.stringify(cart));
                window.location.href = "payment.html";
            }
        });
    }

    // Redirigir a productos con descuento
    if (discountButton) {
        discountButton.addEventListener("click", () => {
            // Lógica para recolectar productos con descuento
            const productos = Array.from(document.querySelectorAll(".card"));
            const productosConDescuento = productos
                .filter(card => card.hasAttribute("data-discount")) // Solo productos con descuento
                .map(card => ({
                    name: card.getAttribute("data-name"),
                    price: parseFloat(card.getAttribute("data-price")),
                    discount: parseFloat(card.getAttribute("data-discount")),
                    img: card.getAttribute("data-img"),
                }));

            // Guardar los productos con descuento en localStorage
            localStorage.setItem("productosConDescuento", JSON.stringify(productosConDescuento));

            // Redirigir a discount.html
            window.location.href = "discount.html";
        });
    }

    document.getElementById('searchInput').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const products = document.querySelectorAll('.card');
    
        products.forEach(product => {
            const name = product.querySelector('h2').textContent.toLowerCase();
            if (name.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
    

    // Renderizar el carrito al cargar la página
    renderCart();
});

