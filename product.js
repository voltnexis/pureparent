// Product data (same as in shop.js)
const allProducts = [
    {
        id: 1,
        name: "Organic Baby Food Jar",
        price: 299,
        rating: 4.8,
        image: "img/apple-puree.jpg",
        images: [
            "img/apple-puree.jpg",
            "https://via.placeholder.com/400x400/98FB98/FFFFFF?text=Front+View",
            "https://via.placeholder.com/400x400/90EE90/FFFFFF?text=Back+View",
            "https://via.placeholder.com/400x400/87CEEB/FFFFFF?text=Side+View",
            "https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Top+View"
        ],
        badges: ["🌱 Organic", "✅ Safe"],
        category: "feeding",
        age: "6-12",
        isEco: true,
        isOrganic: true
    },
    {
        id: 2,
        name: "BPA-Free Baby Bottle",
        price: 599,
        rating: 4.9,
        image: "https://via.placeholder.com/250x200/FFB6C1/FFFFFF?text=Baby+Bottle",
        images: [
            "https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Baby+Bottle",
            "https://via.placeholder.com/400x400/FFC0CB/FFFFFF?text=With+Cap",
            "https://via.placeholder.com/400x400/FFE4E1/FFFFFF?text=Side+View",
            "https://via.placeholder.com/400x400/F0E68C/FFFFFF?text=Bottom+View"
        ],
        badges: ["🍼 BPA-Free", "👩⚕️ Doctor Approved"],
        category: "feeding",
        age: "0-6",
        isEco: false,
        isOrganic: false
    },
    {
        id: 3,
        name: "Soft Cotton Onesie",
        price: 399,
        rating: 4.7,
        image: "https://via.placeholder.com/250x200/F0E68C/FFFFFF?text=Baby+Clothes",
        badges: ["🌱 Organic Cotton", "✅ Certified"],
        category: "clothes",
        age: "0-6",
        isEco: true,
        isOrganic: true
    },
    {
        id: 4,
        name: "Eco-Friendly Diapers",
        price: 899,
        rating: 4.6,
        image: "https://via.placeholder.com/250x200/DDA0DD/FFFFFF?text=Eco+Diapers",
        badges: ["🌱 Eco-Friendly", "🚼 Ultra Soft"],
        category: "diapers",
        age: "0-6",
        isEco: true,
        isOrganic: false
    },
    {
        id: 5,
        name: "Wooden Teething Toy",
        price: 449,
        rating: 4.8,
        image: "https://via.placeholder.com/250x200/98FB98/FFFFFF?text=Wooden+Toy",
        badges: ["🧸 Natural Wood", "✅ Safe"],
        category: "toys",
        age: "6-12",
        isEco: true,
        isOrganic: true
    },
    {
        id: 6,
        name: "Baby Sleep Monitor",
        price: 2999,
        rating: 4.9,
        image: "https://via.placeholder.com/250x200/87CEEB/FFFFFF?text=Sleep+Monitor",
        badges: ["📱 Smart", "🔒 Secure"],
        category: "nursery",
        age: "0-6",
        isEco: false,
        isOrganic: false
    }
];

// Sample reviews
const reviews = [
    {
        name: "Priya M.",
        rating: 5,
        comment: "Excellent quality! My baby loves it. Highly recommended for all moms.",
        date: "2 days ago"
    },
    {
        name: "Anjali S.",
        rating: 4,
        comment: "Good product, fast delivery. Will order again.",
        date: "1 week ago"
    },
    {
        name: "Meera K.",
        rating: 5,
        comment: "Safe and organic as promised. Great customer service too!",
        date: "2 weeks ago"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let quantity = 1;
let currentImageIndex = 0;
let productImages = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const productId = localStorage.getItem('selectedProduct');
    if (productId) {
        loadProduct(parseInt(productId));
        localStorage.removeItem('selectedProduct');
    } else {
        loadProduct(1); // Default to first product
    }
    updateCartCount();
    loadReviews();
    loadRelatedProducts();
});

// Load product details
function loadProduct(productId) {
    currentProduct = allProducts.find(p => p.id === productId);
    if (!currentProduct) return;

    // Load product images
    productImages = currentProduct.images || [currentProduct.image || 'img/placeholder.jpg'];
    currentImageIndex = 0;
    loadProductImages();
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `₹${currentProduct.price}`;
    document.getElementById('totalPrice').textContent = currentProduct.price;
    
    // Update badges
    document.getElementById('productBadges').innerHTML = 
        currentProduct.badges.map(badge => `<span class="badge-premium">${badge}</span>`).join('');
    
    // Update rating
    document.getElementById('productRating').innerHTML = 
        `<div class="stars">${'⭐'.repeat(Math.floor(currentProduct.rating))}</div>
         <span class="rating-text">${currentProduct.rating} (${Math.floor(Math.random() * 500) + 100} reviews)</span>`;
    
    // Update quality score
    const qualityScore = Math.floor(Math.random() * 20) + 80;
    document.getElementById('qualityScoreInline').textContent = qualityScore;
    
    // Update buy now price
    document.getElementById('buyNowPrice').textContent = currentProduct.price;
    
    // Set up add to cart button
    document.getElementById('addToCartBtn').onclick = () => addToCart();
}

// Quantity controls
function changeQuantity(change) {
    quantity = Math.max(1, quantity + change);
    document.getElementById('quantity').textContent = quantity;
    document.getElementById('totalPrice').textContent = currentProduct.price * quantity;
    document.getElementById('buyNowPrice').textContent = currentProduct.price * quantity;
}

// Buy Now functionality
function buyNow() {
    if (!currentProduct) return;
    
    // Store order data in sessionStorage
    const orderData = {
        items: [{ ...currentProduct, quantity: quantity }],
        total: currentProduct.price * quantity
    };
    
    sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // Redirect to place order page
    window.location.href = 'place_order.html';
}

// Load product images
function loadProductImages() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailsContainer = document.getElementById('imageThumbnails');
    const totalImagesSpan = document.getElementById('totalImages');
    
    // Set main image
    mainImage.src = productImages[currentImageIndex];
    mainImage.onerror = function() {
        this.src = 'img/placeholder.jpg';
    };
    
    // Update counter
    document.getElementById('currentImageIndex').textContent = currentImageIndex + 1;
    totalImagesSpan.textContent = productImages.length;
    
    // Load thumbnails
    thumbnailsContainer.innerHTML = productImages.map((img, index) => `
        <div class="thumbnail ${index === currentImageIndex ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${img}" alt="Product view ${index + 1}">
        </div>
    `).join('');
}

// Navigate images
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    loadProductImages();
}

function previousImage() {
    currentImageIndex = currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1;
    loadProductImages();
}

function selectImage(index) {
    currentImageIndex = index;
    loadProductImages();
}

// Image zoom functionality
function zoomImage() {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    zoomedImg.src = productImages[currentImageIndex];
    modal.style.display = 'block';
}

function closeZoom() {
    document.getElementById('imageZoomModal').style.display = 'none';
}

// Add to cart
function addToCart() {
    if (!currentProduct) return;
    
    const existingItem = cart.find(item => item.id === currentProduct.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...currentProduct, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${quantity} item(s) added to cart!`);
}

// Load reviews
function loadReviews() {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = reviews.map(review => `
        <div class="review-item-premium">
            <div class="review-header-premium">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.name.charAt(0)}</div>
                    <div>
                        <span class="reviewer-name">${review.name}</span>
                        <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                    </div>
                </div>
                <small class="review-date">${review.date}</small>
            </div>
            <p class="review-comment">${review.comment}</p>
        </div>
    `).join('');
}

// Add to wishlist
function addToWishlist() {
    if (!currentProduct) return;
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = wishlist.find(item => item.id === currentProduct.id);
    
    if (!exists) {
        wishlist.push(currentProduct);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!');
    } else {
        showNotification('Already in wishlist!');
    }
}

// Load related products
function loadRelatedProducts() {
    if (!currentProduct) return;
    
    const related = allProducts
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 4);
    
    const container = document.getElementById('relatedProducts');
    container.innerHTML = related.map(product => `
        <div class="product-card" onclick="loadProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-badges">
                    ${product.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="product-rating">
                    ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
                    Quick Add
                </button>
            </div>
        </div>
    `).join('');
}

// Quick add to cart for related products
function quickAddToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
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

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
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