document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const totalRevenueEl = document.getElementById('total-revenue');
  const totalSalesEl = document.getElementById('total-sales');
  const productCountEl = document.getElementById('product-count');
  const totalStockEl = document.getElementById('total-stock');

  // --- Load data from localStorage ---
  const sales = JSON.parse(localStorage.getItem('sales')) || [];
  const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

  // --- Calculate Sales Metrics ---
  const calculateSalesSummary = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    totalRevenueEl.textContent = `₦${totalRevenue.toFixed(2)}`;
    totalSalesEl.textContent = sales.length;
  };

  // --- Calculate Inventory Metrics ---
  const calculateInventorySummary = () => {
    const productCount = inventory.length;
    const totalStock = inventory.reduce((sum, product) => sum + product.stock, 0);
    productCountEl.textContent = productCount;
    totalStockEl.textContent = totalStock;
  };

  // --- Initial data load and render ---
  const initializeDashboard = () => {
    // A small check to ensure elements exist before trying to update them
    if (totalRevenueEl && totalSalesEl && productCountEl && totalStockEl) {
      calculateSalesSummary();
      calculateInventorySummary();
    }
  };

  initializeDashboard();
});