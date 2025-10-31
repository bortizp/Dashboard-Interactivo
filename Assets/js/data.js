// Datos globales
let rawData = [];
let filteredData = [];

// Función para cargar datos desde CSV
async function loadCSV() {
    try {
        // Cargar el archivo CSV real
        const response = await fetch('Assets/Data/CSV/datos taller de software-1.csv');
        const csvText = await response.text();
        
        rawData = parseCSV(csvText);
        filteredData = [...rawData];
        
        populateFilters();
        updateDashboard();
        
        console.log('Datos cargados:', rawData.length, 'registros');
        console.log('Muestra de datos:', rawData.slice(0, 3));
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos. Verifica la ruta del archivo CSV.');
    }
}

// Parser CSV simple
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Saltar líneas vacías
        
        const values = lines[i].split(',');
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index]?.trim();
        });
        
        // Convertir tipos de datos según el CSV real
        row.Cantidad = parseInt(row.Cantidad);
        row.Precio_Unitario = parseFloat(row.Precio_Unitario);
        row.Total_Venta = parseFloat(row.Total_Venta);
        row.Fecha = new Date(row.Fecha);
        
        // Agregar propiedades normalizadas para compatibilidad
        row.cantidad = row.Cantidad;
        row.precio_unitario = row.Precio_Unitario;
        row.total = row.Total_Venta;
        row.fecha = row.Fecha;
        row.producto = row.Nombre_Producto;
        row.categoria = row.Categoria;
        row.metodo_pago = row.Metodo_Pago;
        row.region = row.Pais; // Usando país como región
        
        data.push(row);
    }
    
    return data;
}

// Generar datos de ejemplo
function generateSampleData() {
    const productos = [
        {nombre: 'Auriculares Bluetooth', categoria: 'Audio', precio: 45.99},
        {nombre: 'Mouse Gaming RGB', categoria: 'Periféricos', precio: 35.50},
        {nombre: 'Teclado Mecánico', categoria: 'Periféricos', precio: 89.99},
        {nombre: 'Webcam HD', categoria: 'Video', precio: 65.00},
        {nombre: 'Cable USB-C', categoria: 'Accesorios', precio: 12.99},
        {nombre: 'Cargador Rápido', categoria: 'Accesorios', precio: 25.00},
        {nombre: 'Funda Laptop', categoria: 'Protección', precio: 30.00},
        {nombre: 'Hub USB', categoria: 'Conectividad', precio: 28.50}
    ];
    
    const metodosPago = ['Tarjeta', 'PayPal', 'Transferencia', 'Efectivo'];
    const regiones = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];
    
    let csv = 'fecha,producto,categoria,cantidad,precio_unitario,metodo_pago,region\n';
    
    for (let i = 0; i < 100; i++) {
        const producto = productos[Math.floor(Math.random() * productos.length)];
        const fecha = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const cantidad = Math.floor(Math.random() * 5) + 1;
        const metodoPago = metodosPago[Math.floor(Math.random() * metodosPago.length)];
        const region = regiones[Math.floor(Math.random() * regiones.length)];
        
        csv += `${fecha.toISOString().split('T')[0]},${producto.nombre},${producto.categoria},${cantidad},${producto.precio},${metodoPago},${region}\n`;
    }
    
    return csv;
}

// Poblar filtros dinámicamente
function populateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(rawData.map(d => d.categoria))];
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// Aplicar filtros
function applyFilters() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const category = document.getElementById('categoryFilter').value;
    
    filteredData = rawData.filter(row => {
        let matches = true;
        
        if (dateFrom && row.fecha < new Date(dateFrom)) matches = false;
        if (dateTo && row.fecha > new Date(dateTo)) matches = false;
        if (category !== 'all' && row.categoria !== category) matches = false;
        
        return matches;
    });
    
    updateDashboard();
}

// Resetear filtros
function resetFilters() {
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('categoryFilter').value = 'all';
    
    filteredData = [...rawData];
    updateDashboard();
}

// Calcular métricas
function calculateMetrics() {
    const totalSales = filteredData.reduce((sum, row) => sum + row.total, 0);
    const totalProducts = filteredData.reduce((sum, row) => sum + row.cantidad, 0);
    const totalTransactions = filteredData.length;
    const avgTicket = totalSales / totalTransactions || 0;
    
    return { totalSales, totalProducts, totalTransactions, avgTicket };
}

// Ventas por mes
function getSalesByMonth() {
    const salesByMonth = {};
    
    filteredData.forEach(row => {
        const month = row.fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
        salesByMonth[month] = (salesByMonth[month] || 0) + row.total;
    });
    
    // Ordenar por fecha
    const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
        return new Date(a) - new Date(b);
    });
    
    const sortedSales = {};
    sortedMonths.forEach(month => {
        sortedSales[month] = salesByMonth[month];
    });
    
    return sortedSales;
}

// Top productos
function getTopProducts(limit = 5) {
    const productSales = {};
    
    filteredData.forEach(row => {
        productSales[row.producto] = (productSales[row.producto] || 0) + row.total;
    });
    
    return Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

// Métodos de pago
function getPaymentMethods() {
    const paymentCounts = {};
    
    filteredData.forEach(row => {
        paymentCounts[row.metodo_pago] = (paymentCounts[row.metodo_pago] || 0) + 1;
    });
    
    return paymentCounts;
}

// Ventas por región
function getSalesByRegion() {
    const regionSales = {};
    
    filteredData.forEach(row => {
        regionSales[row.region] = (regionSales[row.region] || 0) + row.total;
    });
    
    return regionSales;
}

// Actualizar dashboard
function updateDashboard() {
    updateKPIs();
    updateCharts();
}

// Actualizar KPIs
function updateKPIs() {
    const metrics = calculateMetrics();
    
    document.getElementById('totalSales').textContent = `$${metrics.totalSales.toFixed(2)}`;
    document.getElementById('totalProducts').textContent = metrics.totalProducts;
    document.getElementById('totalTransactions').textContent = metrics.totalTransactions;
    document.getElementById('avgTicket').textContent = `$${metrics.avgTicket.toFixed(2)}`;
}

// Event Listeners
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);

// Inicializar al cargar la página
window.addEventListener('DOMContentLoaded', loadCSV);