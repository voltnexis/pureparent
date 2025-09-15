let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
});

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-badges">
                    ${item.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
                <div class="item-price">₹${item.price}</div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>Qty: ${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
            <div class="item-total">
                ₹${item.price * item.quantity}
            </div>
        </div>
    `).join('');
    
    updateSummary();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Update cart summary
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('delivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
    document.getElementById('total').textContent = `₹${total}`;
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Checkout functionality - now redirects to place_order.html
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Store cart data for place_order.html
    sessionStorage.setItem('currentOrder', JSON.stringify({
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }));
    
    window.location.href = 'place_order.html';
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

