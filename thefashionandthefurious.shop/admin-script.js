// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        this.customers = JSON.parse(localStorage.getItem('adminCustomers')) || [];
        this.isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        this.init();
    }

    init() {
        if (this.isLoggedIn) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
        
        this.bindEvents();
        this.loadMockData();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Modal close
        document.querySelectorAll('.modal-close').forEach(close => {
            close.addEventListener('click', (e) => this.closeModal(e));
        });

        // Window click to close modal
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Refresh orders
        const refreshOrders = document.getElementById('refreshOrders');
        if (refreshOrders) {
            refreshOrders.addEventListener('click', () => this.refreshOrders());
        }

        // Export functions
        const exportOrders = document.getElementById('exportOrders');
        if (exportOrders) {
            exportOrders.addEventListener('click', () => this.exportOrders());
        }

        const exportCustomers = document.getElementById('exportCustomers');
        if (exportCustomers) {
            exportCustomers.addEventListener('click', () => this.exportCustomers());
        }

        // Search and filters
        const searchOrders = document.getElementById('searchOrders');
        if (searchOrders) {
            searchOrders.addEventListener('input', (e) => this.filterOrders(e.target.value));
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.filterOrdersByStatus(e.target.value));
        }

        // Settings forms
        document.querySelectorAll('.settings-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleSettingsUpdate(e));
        });
    }

    handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        if (password === 'Batman@312618') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            this.isLoggedIn = true;
            this.showDashboard();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.style.display = 'block';
            document.getElementById('password').value = '';
        }
    }

    handleLogout() {
        sessionStorage.removeItem('adminLoggedIn');
        this.isLoggedIn = false;
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'grid';
        this.updateDashboardStats();
        this.renderRecentOrders();
    }

    handleNavigation(e) {
        const section = e.currentTarget.dataset.section;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        // Show corresponding section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section + 'Section').classList.add('active');

        this.currentSection = section;

        // Load section-specific data
        switch(section) {
            case 'orders':
                this.renderOrders();
                break;
            case 'customers':
                this.renderCustomers();
                break;
            case 'dashboard':
                this.updateDashboardStats();
                this.renderRecentOrders();
                break;
        }
    }

    loadMockData() {
        // Load mock orders if none exist
        if (this.orders.length === 0) {
            this.orders = [
                {
                    id: 'ORD001',
                    customerName: 'John Doe',
                    email: 'john@example.com',
                    phone: '+8801234567890',
                    address: 'Dhaka, Bangladesh',
                    items: [
                        { name: 'Red Bull Racing Tee', price: 649, size: 'M', quantity: 1 }
                    ],
                    subtotal: 649,
                    deliveryCharge: 70,
                    total: 719,
                    status: 'pending',
                    deliveryLocation: 'Inside Dhaka',
                    timestamp: new Date().toISOString(),
                    paymentMethod: 'Cash on Delivery'
                },
                {
                    id: 'ORD002',
                    customerName: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '+8801234567891',
                    address: 'Chittagong, Bangladesh',
                    items: [
                        { name: 'Ferrari Classic Edition', price: 649, size: 'L', quantity: 2 }
                    ],
                    subtotal: 1298,
                    deliveryCharge: 140,
                    total: 1438,
                    status: 'processing',
                    deliveryLocation: 'Outside Dhaka',
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    paymentMethod: 'Cash on Delivery'
                }
            ];
            localStorage.setItem('adminOrders', JSON.stringify(this.orders));
        }

        // Load mock customers
        if (this.customers.length === 0) {
            this.customers = [
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+8801234567890',
                    totalOrders: 1,
                    totalSpent: 719,
                    lastOrder: new Date().toISOString()
                },
                {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '+8801234567891',
                    totalOrders: 1,
                    totalSpent: 1438,
                    lastOrder: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            localStorage.setItem('adminCustomers', JSON.stringify(this.customers));
        }
    }

    updateDashboardStats() {
        const totalOrders = this.orders.length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        const totalCustomers = this.customers.length;

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalRevenue').textContent = `${totalRevenue} Taka`;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('ordersBadge').textContent = this.orders.filter(o => o.status === 'pending').length;
    }

    renderRecentOrders() {
        const tbody = document.getElementById('recentOrdersTable');
        const recentOrders = this.orders.slice(-5).reverse();

        if (recentOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No recent orders</td></tr>';
            return;
        }

        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</td>
                <td>${order.total} Taka</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    renderOrders() {
        const tbody = document.getElementById('ordersTable');

        if (this.orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>
                    <div><strong>${order.customerName}</strong></div>
                    <div style="font-size: 0.9em; color: #666;">${order.email}</div>
                    <div style="font-size: 0.9em; color: #666;">${order.phone}</div>
                </td>
                <td>
                    ${order.items.map(item => `
                        <div>${item.name} (${item.size}) x${item.quantity}</div>
                    `).join('')}
                </td>
                <td>${order.total} Taka</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.viewOrder('${order.id}')">View</button>
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.updateOrderStatus('${order.id}')">Update</button>
                </td>
            </tr>
        `).join('');
    }

    renderCustomers() {
        const tbody = document.getElementById('customersTable');

        if (this.customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No customers found</td></tr>';
            return;
        }

        tbody.innerHTML = this.customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalOrders}</td>
                <td>${customer.totalSpent} Taka</td>
                <td>${new Date(customer.lastOrder).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary">View Details</button>
                </td>
            </tr>
        `).join('');
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderModal');
        const content = document.getElementById('orderDetailsContent');
        
        content.innerHTML = `
            <div class="order-details">
                <div class="detail-section">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Phone:</strong> ${order.phone}</p>
                    <p><strong>Address:</strong> ${order.address}</p>
                    <p><strong>Delivery Location:</strong> ${order.deliveryLocation}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Order Items</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} (Size: ${item.size})</span>
                            <span>Qty: ${item.quantity}</span>
                            <span>${item.price * item.quantity} Taka</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="detail-section">
                    <h4>Order Summary</h4>
                    <p><strong>Subtotal:</strong> ${order.subtotal} Taka</p>
                    <p><strong>Delivery Charge:</strong> ${order.deliveryCharge} Taka</p>
                    <p><strong>Total:</strong> ${order.total} Taka</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                </div>
            </div>
        `;

        document.getElementById('orderStatusSelect').value = order.status;
        modal.style.display = 'block';
        
        // Store current order ID for status update
        modal.dataset.orderId = orderId;
    }

    updateOrderStatus(orderId) {
        this.viewOrder(orderId);
    }

    refreshOrders() {
        // Simulate refreshing orders from server
        const btn = document.getElementById('refreshOrders');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<div class="loading"></div> Refreshing...';
        btn.disabled = true;

        setTimeout(() => {
            this.renderOrders();
            this.updateDashboardStats();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1000);
    }

    exportOrders() {
        const csvContent = this.generateOrdersCSV();
        this.downloadCSV(csvContent, 'orders.csv');
    }

    exportCustomers() {
        const csvContent = this.generateCustomersCSV();
        this.downloadCSV(csvContent, 'customers.csv');
    }

    generateOrdersCSV() {
        const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Products', 'Total', 'Status', 'Date'];
        const rows = this.orders.map(order => [
            order.id,
            order.customerName,
            order.email,
            order.phone,
            order.items.map(item => `${item.name} (${item.size}) x${item.quantity}`).join('; '),
            order.total,
            order.status,
            new Date(order.timestamp).toLocaleDateString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateCustomersCSV() {
        const headers = ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Last Order'];
        const rows = this.customers.map(customer => [
            customer.name,
            customer.email,
            customer.phone,
            customer.totalOrders,
            customer.totalSpent,
            new Date(customer.lastOrder).toLocaleDateString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    filterOrders(searchTerm) {
        const filteredOrders = this.orders.filter(order => 
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredOrders(filteredOrders);
    }

    filterOrdersByStatus(status) {
        const filteredOrders = status === 'all' ? this.orders : this.orders.filter(order => order.status === status);
        this.renderFilteredOrders(filteredOrders);
    }

    renderFilteredOrders(orders) {
        const tbody = document.getElementById('ordersTable');

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>
                    <div><strong>${order.customerName}</strong></div>
                    <div style="font-size: 0.9em; color: #666;">${order.email}</div>
                    <div style="font-size: 0.9em; color: #666;">${order.phone}</div>
                </td>
                <td>
                    ${order.items.map(item => `
                        <div>${item.name} (${item.size}) x${item.quantity}</div>
                    `).join('')}
                </td>
                <td>${order.total} Taka</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.viewOrder('${order.id}')">View</button>
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.updateOrderStatus('${order.id}')">Update</button>
                </td>
            </tr>
        `).join('');
    }

    closeModal(e) {
        e.target.closest('.modal').style.display = 'none';
    }

    handleSettingsUpdate(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Simulate saving settings
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Saving...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Saved!';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        }, 500);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Handle order status updates
document.addEventListener('click', (e) => {
    if (e.target.id === 'updateOrderStatus') {
        const modal = document.getElementById('orderModal');
        const orderId = modal.dataset.orderId;
        const newStatus = document.getElementById('orderStatusSelect').value;
        
        if (orderId && newStatus) {
            const order = window.adminPanel.orders.find(o => o.id === orderId);
            if (order) {
                order.status = newStatus;
                localStorage.setItem('adminOrders', JSON.stringify(window.adminPanel.orders));
                window.adminPanel.renderOrders();
                window.adminPanel.updateDashboardStats();
                modal.style.display = 'none';
                
                // Show success message
                alert(`Order ${orderId} status updated to ${newStatus}`);
            }
        }
    }
});