// Orders JavaScript
let currentUser = null;
let allOrders = [];
let filteredOrders = [];

// Initialize orders page
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuth();
    await loadOrders();
    setupFilters();
    updateCartCount();
});

// Check authentication
async function checkAuth() {
    currentUser = await db.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
}

// Load orders from database
async function loadOrders() {
    try {
        const { data: orders, error } = await db.getOrders(currentUser.id);
        
        if (error) {
            console.error('Error loading orders:', error);
            showEmptyState();
            return;
        }
        
        allOrders = orders || [];
        filteredOrders = [...allOrders];
        
        if (allOrders.length === 0) {
            showEmptyState();
        } else {
            displayOrders(filteredOrders);
        }
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showEmptyState();
    }
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('ordersList');
    const emptyState = document.getElementById('emptyOrders');
    
    if (orders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = orders.map(order => `
        <div class="order-card ${order.status}" onclick="showOrderDetails('${order.id}')">
            <div class="order-header">
                <div class="order-id">#${order.order_number}</div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
            
            <div class="order-info">
                <div class="info-item">
                    <i class="fas fa-calendar info-icon"></i>
                    <span>${new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-truck info-icon"></i>
                    <span>${getDeliveryStatus(order)}</span>
                </div>
            </div>
            
            <div class="order-items">
                <h4>Items (${getItemCount(order.items)})</h4>
                <div class="items-preview">
                    ${getItemsPreview(order.items)}
                </div>
            </div>
            
            <div class="order-actions">
                <div class="order-total">₹${order.total_amount}</div>
                <div class="order-buttons">
                    ${getOrderButtons(order)}
                </div>
            </div>
        </div>
    `).join('');
}

// Get item count
function getItemCount(items) {
    return Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
}

// Get items preview
function getItemsPreview(items) {
    if (!Array.isArray(items)) return '';
    
    return items.slice(0, 3).map(item => `
        <div class="item-preview" title="${item.title || item.name}">
            ${getProductEmoji(item.category || 'general')}
        </div>
    `).join('');
}

// Get product emoji based on category
function getProductEmoji(category) {
    const emojis = {
        feeding: '🍼',
        clothes: '👕',
        toys: '🧸',
        diapers: '🚼',
        nursery: '🏡',
        general: '📦'
    };
    return emojis[category] || emojis.general;
}

// Get delivery status
function getDeliveryStatus(order) {
    switch (order.status) {
        case 'processing': return 'Processing';
        case 'confirmed': return 'Confirmed';
        case 'shipped': return order.tracking_number ? `Tracking: ${order.tracking_number}` : 'Shipped';
        case 'delivered': return order.delivered_at ? `Delivered ${new Date(order.delivered_at).toLocaleDateString()}` : 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return 'Unknown';
    }
}

// Get order buttons based on status
function getOrderButtons(order) {
    let buttons = '';
    
    if (order.status === 'shipped' || order.status === 'delivered') {
        buttons += `<button class="order-btn track-btn" onclick="event.stopPropagation(); trackOrder('${order.id}')">Track</button>`;
    }
    
    if (order.status === 'delivered') {
        buttons += `<button class="order-btn reorder-btn" onclick="event.stopPropagation(); reorderItems('${order.id}')">Reorder</button>`;
    }
    
    buttons += `<button class="order-btn help-btn" onclick="event.stopPropagation(); getHelp('${order.id}')">Help</button>`;
    
    return buttons;
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter orders
            const status = btn.dataset.status;
            if (status === 'all') {
                filteredOrders = [...allOrders];
            } else {
                filteredOrders = allOrders.filter(order => order.status === status);
            }
            
            displayOrders(filteredOrders);
        });
    });
}

// Show empty state
function showEmptyState() {
    document.getElementById('ordersList').style.display = 'none';
    document.getElementById('emptyOrders').style.display = 'block';
}

// Show order details modal
function showOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const detailsContainer = document.getElementById('orderDetails');
    
    detailsContainer.innerHTML = `
        <div class="order-detail-header">
            <h2>Order #${order.order_number}</h2>
            <p>Placed on ${new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        
        <div class="order-timeline">
            <h3>Order Status</h3>
            ${generateOrderTimeline(order)}
        </div>
        
        <div class="order-items-detail">
            <h3>Items Ordered</h3>
            ${generateItemsDetail(order.items)}
        </div>
        
        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>₹${order.shipping_cost || 0}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>₹${order.tax_amount || 0}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>₹${order.total_amount}</span>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Generate order timeline
function generateOrderTimeline(order) {
    const timeline = [
        { status: 'processing', label: 'Order Placed', completed: true },
        { status: 'confirmed', label: 'Order Confirmed', completed: ['confirmed', 'shipped', 'delivered'].includes(order.status) },
        { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status) },
        { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
    ];
    
    return timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : ''}">
            <div class="timeline-icon">
                <i class="fas ${item.completed ? 'fa-check' : 'fa-circle'}"></i>
            </div>
            <div class="timeline-content">
                <h4>${item.label}</h4>
                <p>${item.completed ? 'Completed' : 'Pending'}</p>
            </div>
        </div>
    `).join('');
}

// Generate items detail
function generateItemsDetail(items) {
    if (!Array.isArray(items)) return '<p>No items found</p>';
    
    return items.map(item => `
        <div class="item-detail">
            <div class="item-image">
                ${getProductEmoji(item.category || 'general')}
            </div>
            <div class="item-info">
                <div class="item-name">${item.title || item.name}</div>
                <div class="item-details">Qty: ${item.quantity || 1}</div>
            </div>
            <div class="item-price">₹${(item.price || 0) * (item.quantity || 1)}</div>
        </div>
    `).join('');
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Track order
function trackOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (order && order.tracking_number) {
        alert(`Tracking Number: ${order.tracking_number}\n\nYou can track your order on the courier website.`);
    } else {
        alert('Tracking information will be available once your order is shipped.');
    }
}

// Reorder items
async function reorderItems(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order || !order.items) return;
    
    try {
        // Add items to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        order.items.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
            } else {
                cart.push({ ...item, quantity: item.quantity || 1 });
            }
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        alert('Items added to cart successfully!');
        
    } catch (error) {
        console.error('Error reordering items:', error);
        alert('Failed to add items to cart. Please try again.');
    }
}

// Get help
function getHelp(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    const message = `Hi, I need help with my order #${order.order_number}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}