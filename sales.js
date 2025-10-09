document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const salesListContainer = document.getElementById('sales-list');
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalSalesCountEl = document.getElementById('total-sales-count');

    // Load sales from localStorage
    let sales = JSON.parse(localStorage.getItem('sales')) || [];

    const renderSales = () => {
        salesListContainer.innerHTML = '';

        if (sales.length === 0) {
            salesListContainer.innerHTML = '<p>No sales have been recorded yet.</p>';
            return;
        }

        // Sort sales by most recent date first
        const sortedSales = sales.sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedSales.forEach(sale => {
            const saleRecordEl = document.createElement('div');
            saleRecordEl.className = 'sale-record';

            let itemsHtml = '<ul>';
            sale.items.forEach(item => {
                itemsHtml += `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`;
            });
            itemsHtml += '</ul>';

            saleRecordEl.innerHTML = `
                <div class="sale-record-header">
                    <h3>Sale ID: ${sale.id}</h3>
                    <div class="sale-header-right">
                        <span>${new Date(sale.date).toLocaleString()}</span>
                        <button class="action-btn delete-sale-btn" data-id="${sale.id}" title="Delete and Restock">Delete</button>
                    </div>
                </div>
                <p><strong>Total: ₦${sale.total.toFixed(2)}</strong> (Sub: ₦${sale.subtotal.toFixed(2)}, Tax: ₦${sale.tax.toFixed(2)})</p>
                <h4>Items Purchased:</h4>
                ${itemsHtml}
            `;
            salesListContainer.appendChild(saleRecordEl);
        });
    };

    const calculateSummary = () => {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
        totalSalesCountEl.textContent = sales.length;
    };

    const handleDeleteSale = (saleId) => {
        if (!confirm('Are you sure you want to delete this sale? This will restock the items in inventory.')) {
            return;
        }

        // Find the sale to be deleted
        const saleIndex = sales.findIndex(s => s.id === saleId);
        if (saleIndex === -1) return;

        const saleToDelete = sales[saleIndex];

        // Load inventory to update stock
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        saleToDelete.items.forEach(soldItem => {
            const productInInventory = inventory.find(p => p.id === soldItem.id);
            if (productInInventory) {
                productInInventory.stock += soldItem.quantity;
            }
        });
        localStorage.setItem('inventory', JSON.stringify(inventory));

        // Remove the sale from the sales array
        sales.splice(saleIndex, 1);
        localStorage.setItem('sales', JSON.stringify(sales));

        // Re-render the UI
        calculateSummary();
        renderSales();
    };

    salesListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-sale-btn')) {
            const saleId = parseInt(e.target.getAttribute('data-id'), 10);
            handleDeleteSale(saleId);
        }
    });

    // Initial render
    calculateSummary();
    renderSales();
});