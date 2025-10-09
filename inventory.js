document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const inventoryTableBody = document.getElementById('inventory-table-body');
    const formHeader = document.querySelector('#add-product-form h2');
    const formSubmitButton = document.querySelector('#product-form button');

    // Load inventory from localStorage or use a default set
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [
        { id: 1, name: 'Laptop', price: 1200.00, stock: 15 },
        { id: 2, name: 'Mouse', price: 25.50, stock: 50 },
        { id: 3, name: 'Keyboard', price: 75.00, stock: 30 }
    ];

    // To track if we are editing an existing product
    let editingProductId = null;

    // Function to save inventory to localStorage
    const saveInventory = () => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    };

    // Function to render the inventory table
    const renderInventory = () => {
        inventoryTableBody.innerHTML = ''; // Clear existing table
        if (inventory.length === 0) {
            inventoryTableBody.innerHTML = '<tr><td colspan="5">No products in inventory.</td></tr>';
            return;
        }

        inventory.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });
    };

    // Handle form submission to add a new product
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value, 10);

        if (editingProductId) {
            // Update existing product
            const product = inventory.find(p => p.id === editingProductId);
            product.name = name;
            product.price = price;
            product.stock = stock;
            editingProductId = null; // Reset editing state
        } else {
            // Add new product
            const newProduct = {
                id: inventory.length > 0 ? Math.max(...inventory.map(p => p.id)) + 1 : 1,
                name,
                price,
                stock
            };
            inventory.push(newProduct);
        }

        saveInventory();
        renderInventory();
        productForm.reset();
        formHeader.textContent = 'Add New Product';
        formSubmitButton.textContent = 'Add Product';
    });

    // Handle clicks on Edit and Delete buttons using event delegation
    inventoryTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = parseInt(target.getAttribute('data-id'), 10);

        if (target.classList.contains('delete-btn')) {
            handleDelete(id);
        } else if (target.classList.contains('edit-btn')) {
            handleEdit(id);
        }
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            inventory = inventory.filter(product => product.id !== id);
            saveInventory();
            renderInventory();
        }
    };

    const handleEdit = (id) => {
        const product = inventory.find(p => p.id === id);
        if (!product) return;

        // Set editing state
        editingProductId = id;

        // Populate form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;

        // Update form UI for editing
        formHeader.textContent = `Editing: ${product.name}`;
        formSubmitButton.textContent = 'Update Product';

        // Scroll to the form for better UX
        productForm.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('product-name').focus();
    };

    // Initial render of the inventory
    renderInventory();
});