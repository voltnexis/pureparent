// Sample product data
const products = [
    {
        id: 1,
        name: "Organic Baby Food Jar",
        price: "₹299",
        rating: 4.8,
        image: "img/apple-puree.jpg",
        badges: ["🌱 Organic", "✅ Safe"]
    },
    {
        id: 2,
        name: "BPA-Free Baby Bottle",
        price: "₹599",
        rating: 4.9,
        image: "https://via.placeholder.com/250x200/FFB6C1/FFFFFF?text=Baby+Bottle",
        badges: ["🍼 BPA-Free", "👩⚕️ Doctor Approved"]
    },
    {
        id: 3,
        name: "Soft Cotton Onesie",
        price: "₹399",
        rating: 4.7,
        image: "https://via.placeholder.com/250x200/F0E68C/FFFFFF?text=Baby+Clothes",
        badges: ["🌱 Organic Cotton", "✅ Certified"]
    },
    {
        id: 4,
        name: "Eco-Friendly Diapers",
        price: "₹899",
        rating: 4.6,
        image: "https://via.placeholder.com/250x200/DDA0DD/FFFFFF?text=Eco+Diapers",
        badges: ["🌱 Eco-Friendly", "🚼 Ultra Soft"]
    },
    {
        id: 5,
        name: "Wooden Teething Toy",
        price: "₹449",
        rating: 4.8,
        image: "https://via.placeholder.com/250x200/98FB98/FFFFFF?text=Wooden+Toy",
        badges: ["🧸 Natural Wood", "✅ Safe"]
    },
    {
        id: 6,
        name: "Baby Sleep Monitor",
        price: "₹2999",
        rating: 4.9,
        image: "https://via.placeholder.com/250x200/87CEEB/FFFFFF?text=Sleep+Monitor",
        badges: ["📱 Smart", "🔒 Secure"]
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let slideIndex = 1;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBestSellers();
    updateCartCount();
    showSlides(slideIndex);
    startCarousel();
});

// Load best seller products
function loadBestSellers() {
    const container = document.getElementById('bestSellers');
    container.innerHTML = products.map(product => `
        <div class="product-card" onclick="goToProduct(${product.id})" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-badges">
                    ${product.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
                <div class="product-rating">
                    ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Navigate to product details
function goToProduct(productId) {
    localStorage.setItem('selectedProduct', productId);
    window.location.href = 'product.html';
}

// Carousel functionality
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName('carousel-item');
    const dots = document.getElementsByClassName('dot');
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

function startCarousel() {
    setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 4000);
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Product added to cart!');
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Navigation functions
function goToCategory(category) {
    // Store selected category and redirect
    localStorage.setItem('selectedCategory', category);
    window.location.href = 'shop.html';
}

function focusSearch() {
    document.getElementById('searchInput').focus();
}

// Search functionality
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
}

// Notification system
function showNotification(message) {
    // Create notification element
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
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Age filter data for future use
const ageFilters = [
    "0-6 months",
    "6-12 months", 
    "1-2 years",
    "2-3 years",
    "3+ years"
];

// Payment methods for checkout
const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
    { id: 'paytm', name: 'Paytm', icon: '💳' },
    { id: 'gpay', name: 'Google Pay', icon: '📲' }
];

// Trust badges data
const trustBadges = [
    { name: 'SSL Secure', icon: '🔒' },
    { name: 'Razorpay', icon: '💳' },
    { name: 'Paytm Secure', icon: '🛡️' },
    { name: '100% Safe', icon: '✅' }
];