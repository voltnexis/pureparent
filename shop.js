// Products will be loaded from Supabase
let allProducts = [];
let filteredProducts = [];

// Sample fallback data
const fallbackProducts = [
    {
        id: 1,
        name: "Organic Baby Food Jar",
        price: 299,
        rating: 4.8,
        image: "img/apple-puree.jpg",
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
    },
    {
        id: 7,
        name: "Organic Baby Shampoo",
        price: 249,
        rating: 4.5,
        image: "https://via.placeholder.com/250x200/FFE4E1/FFFFFF?text=Baby+Shampoo",
        badges: ["🌱 Organic", "👶 Gentle"],
        category: "nursery",
        age: "0-6",
        isEco: true,
        isOrganic: true
    },
    {
        id: 8,
        name: "Colorful Stacking Rings",
        price: 329,
        rating: 4.4,
        image: "https://via.placeholder.com/250x200/FFB347/FFFFFF?text=Stacking+Rings",
        badges: ["🧸 Educational", "🎨 Colorful"],
        category: "toys",
        age: "1-2",
        isEco: false,
        isOrganic: false
    },
    {
        id: 9,
        name: "Premium Baby Gift Set",
        price: 1299,
        rating: 4.9,
        image: "https://via.placeholder.com/250x200/DDA0DD/FFFFFF?text=Gift+Set",
        badges: ["🎁 Premium", "✅ Complete Set"],
        category: "gifts",
        age: "0-6",
        isEco: true,
        isOrganic: true
    },
    {
        id: 10,
        name: "Bamboo Feeding Spoons",
        price: 199,
        rating: 4.6,
        image: "https://via.placeholder.com/250x200/90EE90/FFFFFF?text=Bamboo+Spoons",
        badges: ["🌱 Bamboo", "🍼 Safe"],
        category: "feeding",
        age: "6-12",
        isEco: true,
        isOrganic: true
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    updateCartCount();
    await loadProducts();
    checkUrlParams();
    setupFilters();
    setupSearch();
    displayProducts(filteredProducts);
});

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            if (query.length > 0) {
                filterBySearch(query);
                document.getElementById('sectionTitle').textContent = `Search Results for "${query}"`;
            } else {
                filteredProducts = [...allProducts];
                displayProducts(filteredProducts);
                document.getElementById('sectionTitle').textContent = 'All Products';
            }
        });
    }
}

// Load products from Supabase
async function loadProducts() {
    try {
        // Check if db is available
        if (typeof db !== 'undefined' && db.getProducts) {
            const { data: products, error } = await db.getProducts();
            
            if (error) {
                console.warn('Supabase error, using fallback:', error);
                allProducts = fallbackProducts;
            } else if (products && products.length > 0) {
                allProducts = products;
            } else {
                console.warn('No products from Supabase, using fallback');
                allProducts = fallbackProducts;
            }
        } else {
            console.warn('Supabase not available, using fallback products');
            allProducts = fallbackProducts;
        }
        
        filteredProducts = [...allProducts];
        console.log(`Loaded ${allProducts.length} products`);
        
    } catch (error) {
        console.error('Error loading products:', error);
        allProducts = fallbackProducts;
        filteredProducts = [...allProducts];
    }
}

// Check URL parameters and localStorage for filters
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const selectedCategory = localStorage.getItem('selectedCategory');
    
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
        }
        document.getElementById('sectionTitle').textContent = `Search Results for "${searchQuery}"`;
        filterBySearch(searchQuery);
        return; // Don't apply other filters if searching
    }
    
    if (selectedCategory) {
        document.getElementById('categoryFilter').value = selectedCategory;
        document.getElementById('sectionTitle').textContent = `${getCategoryName(selectedCategory)} Products`;
        localStorage.removeItem('selectedCategory');
    }
    
    applyFilters();
}

function getCategoryName(category) {
    const names = {
        'clothes': '👕 Clothes',
        'feeding': '🍼 Feeding',
        'diapers': '🚼 Diapers',
        'toys': '🧸 Toys',
        'nursery': '🏡 Nursery',
        'gifts': '🎁 Gifts'
    };
    return names[category] || category;
}

// Setup filter event listeners
function setupFilters() {
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('ageFilter').addEventListener('change', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('ecoFilter').addEventListener('change', applyFilters);
    document.getElementById('organicFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
}

// Apply all filters
function applyFilters() {
    let filtered = [...allProducts];
    
    // Category filter
    const category = document.getElementById('categoryFilter').value;
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // Age filter
    const age = document.getElementById('ageFilter').value;
    if (age) {
        filtered = filtered.filter(product => product.age === age);
    }
    
    // Price filter
    const priceRange = document.getElementById('priceFilter').value;
    if (priceRange) {
        filtered = filtered.filter(product => {
            if (priceRange === '0-500') return product.price <= 500;
            if (priceRange === '500-1000') return product.price > 500 && product.price <= 1000;
            if (priceRange === '1000-2000') return product.price > 1000 && product.price <= 2000;
            if (priceRange === '2000+') return product.price > 2000;
            return true;
        });
    }
    
    // Eco-friendly filter
    if (document.getElementById('ecoFilter').checked) {
        filtered = filtered.filter(product => product.isEco);
    }
    
    // Organic filter
    if (document.getElementById('organicFilter').checked) {
        filtered = filtered.filter(product => product.isOrganic);
    }
    
    // Sort products
    const sortBy = document.getElementById('sortBy').value;
    filtered = sortProducts(filtered, sortBy);
    
    filteredProducts = filtered;
    displayProducts(filtered);
}

// Sort products
function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'rating':
            return products.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return products.sort((a, b) => b.id - a.id);
        default:
            return products.sort((a, b) => b.rating - a.rating);
    }
}

// Filter by search query
function filterBySearch(query) {
    const searchTerm = query.toLowerCase();
    filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.badges && product.badges.some(badge => badge.toLowerCase().includes(searchTerm)))
    );
    displayProducts(filteredProducts);
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!container) {
        console.error('Products grid container not found');
        return;
    }
    
    if (!products || products.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    try {
        container.innerHTML = products.map(product => {
            if (!product) return '';
            
            const productName = (product.title || product.name || 'Product Name').replace(/'/g, '&apos;');
            const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/250x200/E8E8E8/999999?text=No+Image';
            const productPrice = Math.round(product.price || 0);
            const qualityScore = product.quality_score || Math.floor(Math.random() * 20) + 80;
            const rating = parseFloat(product.rating || (4.0 + Math.random() * 1.0)).toFixed(1);
            const badges = product.certifications || product.badges || ['✅ Safe', '🌟 Quality'];
            
            return `
            <div class="product-card" onclick="goToProduct('${product.id}')">
                <img src="${productImage}" alt="${productName}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/250x200/E8E8E8/999999?text=No+Image';" 
                     loading="lazy">
                <div class="product-info">
                    <div class="product-name" title="${productName}">${productName}</div>
                    <div class="product-badges">
                        ${badges.slice(0,2).map(cert => `<span class="badge">${cert}</span>`).join('')}
                    </div>
                    <div class="product-rating">
                        <span class="rating-stars">${'⭐'.repeat(Math.floor(parseFloat(rating)))}</span>
                        <span class="rating-text">${rating} (${Math.floor(Math.random() * 500) + 50})</span>
                    </div>
                    <div class="product-price">
                        ₹${productPrice.toLocaleString()}
                        <span class="price-original">₹${Math.floor(productPrice * 1.2).toLocaleString()}</span>
                        <span class="price-discount">20% off</span>
                    </div>
                </div>
            </div>
            `;
        }).filter(html => html).join('');
    } catch (error) {
        console.error('Error displaying products:', error);
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Error loading products. Please refresh the page.</div>';
    }
}

// Cart functionality
function addToCart(productId) {
    try {
        const product = allProducts.find(p => p.id == productId);
        if (!product) {
            showNotification('Product not found!', 'error');
            return;
        }
        
        const existingItem = cart.find(item => item.id == productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                id: product.id,
                name: product.title || product.name,
                price: product.price,
                image: product.images?.[0] || product.image,
                quantity: 1 
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Added to cart!', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Navigation
function goToProduct(productId) {
    localStorage.setItem('selectedProduct', productId);
    window.location.href = 'product.html';
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const bgColor = type === 'success' ? '#4CAF50' : '#f44336';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 2500);
}

// Add CSS animations
if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}