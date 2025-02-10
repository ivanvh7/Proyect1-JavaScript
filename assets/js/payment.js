document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const cancelPaymentForm = document.getElementById('cancelPaymentForm');

    // Manejar envío del formulario
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!validateForm(name, cardNumber, expiryDate, cvv)) {
            return;
        }

        const metodoDePago = { name, cardNumber, expiryDate, cvv };
        localStorage.setItem('metodoDePago', JSON.stringify(metodoDePago));
        alert('Método de pago guardado exitosamente.');
        window.location.href = 'checkout.html'; // Redirige al proceso de pago
    });

    // Manejar cancelación
    cancelPaymentForm.addEventListener('click', () => {
        window.location.href = 'index.html'; // Regresa a la página principal
    });

    function validateForm(name, cardNumber, expiryDate, cvv) {
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert('Por favor, ingresa un nombre válido.');
            return false;
        }
        if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
            alert('El número de tarjeta debe tener 16 dígitos.');
            return false;
        }
        if (!/^\d{3}$/.test(cvv)) {
            alert('El CVV debe tener 3 dígitos.');
            return false;
        }
        return true;
    }

});
