// Instancias de gráficos
let monthlySalesChart, topProductsChart, paymentMethodsChart, regionSalesChart;

// Configuración de colores
const chartColors = {
    primary: '#2563eb',
    secondary: '#1e40af',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6'
};

const colorPalette = [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.danger,
    chartColors.purple,
    chartColors.pink,
    chartColors.teal,
    chartColors.secondary
];

// Actualizar todos los gráficos
function updateCharts() {
    updateMonthlySalesChart();
    updateTopProductsChart();
    updatePaymentMethodsChart();
    updateRegionSalesChart();
}

// Gráfico de ventas mensuales
function updateMonthlySalesChart() {
    const salesByMonth = getSalesByMonth();
    const labels = Object.keys(salesByMonth);
    const data = Object.values(salesByMonth);
    
    const ctx = document.getElementById('monthlySalesChart').getContext('2d');
    
    if (monthlySalesChart) {
        monthlySalesChart.destroy();
    }
    
    monthlySalesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas ($)',
                data: data,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primary + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de top productos
function updateTopProductsChart() {
    const topProducts = getTopProducts(5);
    const labels = topProducts.map(p => p[0]);
    const data = topProducts.map(p => p[1]);
    
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    
    if (topProductsChart) {
        topProductsChart.destroy();
    }
    
    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ingresos ($)',
                data: data,
                backgroundColor: colorPalette,
                borderColor: colorPalette.map(c => c),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ingresos: $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de métodos de pago
function updatePaymentMethodsChart() {
    const paymentMethods = getPaymentMethods();
    const labels = Object.keys(paymentMethods);
    const data = Object.values(paymentMethods);
    
    const ctx = document.getElementById('paymentMethodsChart').getContext('2d');
    
    if (paymentMethodsChart) {
        paymentMethodsChart.destroy();
    }
    
    paymentMethodsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colorPalette,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de ventas por región
function updateRegionSalesChart() {
    const regionSales = getSalesByRegion();
    const labels = Object.keys(regionSales);
    const data = Object.values(regionSales);
    
    const ctx = document.getElementById('regionSalesChart').getContext('2d');
    
    if (regionSalesChart) {
        regionSalesChart.destroy();
    }
    
    regionSalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas por Región ($)',
                data: data,
                backgroundColor: chartColors.success,
                borderColor: chartColors.success,
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y', // Barras horizontales
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: $' + context.parsed.x.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}