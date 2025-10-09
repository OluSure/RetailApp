document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productSelect = document.getElementById('product-select');
    const addToCartForm = document.getElementById('add-to-cart-form');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const checkoutButton = document.getElementById('checkout-button');
    const receiptModal = document.getElementById('receipt-modal');
    const receiptContent = document.getElementById('receipt-content');
    const closeModalButton = document.querySelector('.close-button');

    // State
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    let cart = [];
    const TAX_RATE = 0.05;

    // --- FUNCTIONS ---

    const populateProducts = () => {
        productSelect.innerHTML = '<option value="" disabled selected>Select a product</option>';
        inventory.forEach(product => {
            if (product.stock > 0) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - ₦${product.price.toFixed(2)} (In stock: ${product.stock})`;
                productSelect.appendChild(option);
            }
        });
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Cart is empty.</p>';
            checkoutButton.disabled = true;
        } else {
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `<span>${item.name} (x${item.quantity})</span><span>₦${(item.price * item.quantity).toFixed(2)}</span>`;
                cartItemsContainer.appendChild(itemEl);
            });
            checkoutButton.disabled = false;
        }
        updateTotals();
    };

    const updateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        subtotalEl.textContent = `₦${subtotal.toFixed(2)}`;
        taxEl.textContent = `₦${tax.toFixed(2)}`;
        totalEl.textContent = `₦${total.toFixed(2)}`;
    };

    const generateReceipt = (sale) => {
        let receiptText = `Sale ID: ${sale.id}\n`;
        receiptText += `Date: ${new Date(sale.date).toLocaleString()}\n`;
        receiptText += '--------------------------------\n';
        receiptText += 'Items:\n';
        sale.items.forEach(item => {
            receiptText += `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        receiptText += '--------------------------------\n';
        receiptText += `Subtotal: ₦${sale.subtotal.toFixed(2)}\n`;
        receiptText += `Tax: ₦${sale.tax.toFixed(2)}\n`;
        receiptText += `Total: ₦${sale.total.toFixed(2)}\n`;

        receiptContent.textContent = receiptText;
        receiptModal.style.display = 'block';
    };

    // --- EVENT LISTENERS ---

    addToCartForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = parseInt(productSelect.value, 10);
        const quantity = parseInt(document.getElementById('quantity-input').value, 10);

        const product = inventory.find(p => p.id === productId);

        if (!product) {
            alert('Please select a product.');
            return;
        }
        if (quantity > product.stock) {
            alert(`Not enough stock. Only ${product.stock} available.`);
            return;
        }

        const existingCartItem = cart.find(item => item.id === productId);
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        renderCart();
        addToCartForm.reset();
        productSelect.focus();
    });

    checkoutButton.addEventListener('click', () => {
        // Update inventory
        cart.forEach(cartItem => {
            const productInInventory = inventory.find(p => p.id === cartItem.id);
            productInInventory.stock -= cartItem.quantity;
        });
        localStorage.setItem('inventory', JSON.stringify(inventory));

        // Create and save sale record
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * TAX_RATE;
        const newSale = {
            id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1,
            date: new Date().toISOString(),
            items: cart,
            subtotal: subtotal,
            tax: tax,
            total: subtotal + tax
        };
        sales.push(newSale);
        localStorage.setItem('sales', JSON.stringify(sales));

        generateReceipt(newSale);

        // Reset state
        cart = [];
        renderCart();
        populateProducts();
    });

    closeModalButton.addEventListener('click', () => {
        receiptModal.style.display = 'none';
    });

    // --- INITIALIZATION ---
    populateProducts();
    renderCart();
});