// Baby growth tracking functionality
let babyData = JSON.parse(localStorage.getItem('babyData')) || {
    name: 'Your Little One',
    birthDate: null,
    gender: '',
    measurements: []
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBabyInfo();
    loadMilestones();
    loadProductSuggestions();
    updateCartCount();
});

// Load baby information
function loadBabyInfo() {
    document.getElementById('babyName').textContent = babyData.name;
    
    if (babyData.birthDate) {
        const birthDate = new Date(babyData.birthDate);
        const age = calculateAge(birthDate);
        document.getElementById('babyAge').textContent = age;
        document.getElementById('birthDate').textContent = formatDate(birthDate);
    }
    
    // Load latest measurements
    if (babyData.measurements.length > 0) {
        const latest = babyData.measurements[babyData.measurements.length - 1];
        if (latest.height) document.getElementById('currentHeight').textContent = latest.height + ' cm';
        if (latest.weight) document.getElementById('currentWeight').textContent = latest.weight + ' kg';
        if (latest.head) document.getElementById('currentHead').textContent = latest.head + ' cm';
    }
}

// Calculate age from birth date
function calculateAge(birthDate) {
    const now = new Date();
    const diffTime = Math.abs(now - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
        return `${diffDays} days old`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;
        if (remainingDays < 7) {
            return `${months} months old`;
        } else {
            return `${months} months, ${remainingDays} days old`;
        }
    } else {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        return `${years} year${years > 1 ? 's' : ''}, ${months} months old`;
    }
}

// Format date for display
function formatDate(date) {
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Load age-appropriate milestones
function loadMilestones() {
    const container = document.getElementById('milestonesGrid');
    
    if (!babyData.birthDate) {
        container.innerHTML = '<p class="no-data">Set your baby\'s birth date to see milestones</p>';
        return;
    }
    
    const ageInMonths = getAgeInMonths(new Date(babyData.birthDate));
    const milestones = getMilestonesForAge(ageInMonths);
    
    container.innerHTML = milestones.map(milestone => `
        <div class="milestone-card ${milestone.achieved ? 'achieved' : ''}">
            <div class="milestone-icon">${milestone.icon}</div>
            <div class="milestone-info">
                <h3>${milestone.title}</h3>
                <p>${milestone.description}</p>
                <div class="milestone-age">${milestone.expectedAge}</div>
            </div>
            <button class="milestone-toggle" onclick="toggleMilestone('${milestone.id}')">
                <i class="fas ${milestone.achieved ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
        </div>
    `).join('');
}

// Get age in months
function getAgeInMonths(birthDate) {
    const now = new Date();
    const diffTime = Math.abs(now - birthDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
}

// Get milestones for specific age
function getMilestonesForAge(ageInMonths) {
    const allMilestones = [
        // 0-3 months
        { id: 'smile', icon: '😊', title: 'First Smile', description: 'Smiles in response to you', expectedAge: '2-3 months', minAge: 0, maxAge: 3 },
        { id: 'head_up', icon: '👶', title: 'Lifts Head', description: 'Lifts head when on tummy', expectedAge: '1-2 months', minAge: 0, maxAge: 3 },
        { id: 'follows_objects', icon: '👀', title: 'Follows Objects', description: 'Follows moving objects with eyes', expectedAge: '2-3 months', minAge: 0, maxAge: 3 },
        
        // 4-6 months
        { id: 'rolls_over', icon: '🔄', title: 'Rolls Over', description: 'Rolls from tummy to back', expectedAge: '4-6 months', minAge: 4, maxAge: 6 },
        { id: 'sits_support', icon: '🪑', title: 'Sits with Support', description: 'Sits with support', expectedAge: '4-6 months', minAge: 4, maxAge: 6 },
        { id: 'reaches_toys', icon: '🧸', title: 'Reaches for Toys', description: 'Reaches for and grabs toys', expectedAge: '4-5 months', minAge: 4, maxAge: 6 },
        
        // 7-12 months
        { id: 'sits_alone', icon: '🧘', title: 'Sits Alone', description: 'Sits without support', expectedAge: '6-8 months', minAge: 7, maxAge: 12 },
        { id: 'crawls', icon: '🐛', title: 'Crawls', description: 'Crawls on hands and knees', expectedAge: '7-10 months', minAge: 7, maxAge: 12 },
        { id: 'first_words', icon: '🗣️', title: 'First Words', description: 'Says "mama" or "dada"', expectedAge: '8-12 months', minAge: 7, maxAge: 12 },
        { id: 'stands_support', icon: '🧍', title: 'Stands with Support', description: 'Pulls to standing position', expectedAge: '8-10 months', minAge: 7, maxAge: 12 },
        
        // 12+ months
        { id: 'first_steps', icon: '👣', title: 'First Steps', description: 'Takes first independent steps', expectedAge: '9-15 months', minAge: 12, maxAge: 24 },
        { id: 'waves_bye', icon: '👋', title: 'Waves Bye-bye', description: 'Waves goodbye', expectedAge: '10-12 months', minAge: 12, maxAge: 24 },
        { id: 'drinks_cup', icon: '🥤', title: 'Drinks from Cup', description: 'Drinks from a cup', expectedAge: '12-15 months', minAge: 12, maxAge: 24 }
    ];
    
    // Filter milestones based on age
    const relevantMilestones = allMilestones.filter(milestone => 
        ageInMonths >= milestone.minAge && ageInMonths <= milestone.maxAge + 6
    );
    
    // Add achieved status from localStorage
    const achievedMilestones = JSON.parse(localStorage.getItem('achievedMilestones')) || [];
    
    return relevantMilestones.map(milestone => ({
        ...milestone,
        achieved: achievedMilestones.includes(milestone.id)
    }));
}

// Toggle milestone achievement
function toggleMilestone(milestoneId) {
    let achievedMilestones = JSON.parse(localStorage.getItem('achievedMilestones')) || [];
    
    if (achievedMilestones.includes(milestoneId)) {
        achievedMilestones = achievedMilestones.filter(id => id !== milestoneId);
    } else {
        achievedMilestones.push(milestoneId);
    }
    
    localStorage.setItem('achievedMilestones', JSON.stringify(achievedMilestones));
    loadMilestones();
    
    // Show celebration for new achievement
    if (achievedMilestones.includes(milestoneId)) {
        showCelebration();
    }
}

// Show celebration animation
function showCelebration() {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--gradient-primary);
        color: white;
        padding: 20px 30px;
        border-radius: 20px;
        font-size: 18px;
        font-weight: 600;
        z-index: 1000;
        animation: celebrationPop 2s ease;
    `;
    celebration.innerHTML = '🎉 Milestone Achieved! 🎉';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

// Edit baby info
function editBabyInfo() {
    document.getElementById('babyNameInput').value = babyData.name;
    document.getElementById('birthDateInput').value = babyData.birthDate || '';
    document.getElementById('genderInput').value = babyData.gender || '';
    document.getElementById('babyInfoModal').style.display = 'block';
}

// Close baby info modal
function closeBabyInfoModal() {
    document.getElementById('babyInfoModal').style.display = 'none';
}

// Save baby info
document.getElementById('babyInfoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    babyData.name = document.getElementById('babyNameInput').value || 'Your Little One';
    babyData.birthDate = document.getElementById('birthDateInput').value;
    babyData.gender = document.getElementById('genderInput').value;
    
    localStorage.setItem('babyData', JSON.stringify(babyData));
    loadBabyInfo();
    loadMilestones();
    closeBabyInfoModal();
    
    showNotification('Baby information updated!');
});

// Add measurement
function addMeasurement() {
    document.getElementById('measurementDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('measurementModal').style.display = 'block';
}

// Close measurement modal
function closeMeasurementModal() {
    document.getElementById('measurementModal').style.display = 'none';
}

// Save measurement
document.getElementById('measurementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const measurement = {
        date: document.getElementById('measurementDate').value,
        height: parseFloat(document.getElementById('heightInput').value) || null,
        weight: parseFloat(document.getElementById('weightInput').value) || null,
        head: parseFloat(document.getElementById('headInput').value) || null
    };
    
    babyData.measurements.push(measurement);
    localStorage.setItem('babyData', JSON.stringify(babyData));
    
    loadBabyInfo();
    closeMeasurementModal();
    
    // Clear form
    document.getElementById('measurementForm').reset();
    
    showNotification('Measurement added successfully!');
});

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// Load age-appropriate product suggestions
function loadProductSuggestions() {
    const container = document.getElementById('suggestionsGrid');
    
    if (!babyData.birthDate) {
        container.innerHTML = '<p class="no-data">Set your baby\'s birth date to see product recommendations</p>';
        return;
    }
    
    const ageInMonths = getAgeInMonths(new Date(babyData.birthDate));
    const suggestions = getAgeAppropriateProducts(ageInMonths);
    const filteredSuggestions = filterUnpurchasedProducts(suggestions);
    
    if (filteredSuggestions.length === 0) {
        container.innerHTML = '<p class="no-data">Great! You have all the essentials for this age group</p>';
        return;
    }
    
    container.innerHTML = filteredSuggestions.map(product => `
        <div class="suggestion-card" onclick="goToProduct('${product.id}')">
            <div class="suggestion-badge">${product.priority}</div>
            <img src="${product.image}" alt="${product.name}" class="suggestion-image">
            <div class="suggestion-info">
                <h3>${product.name}</h3>
                <p class="suggestion-reason">${product.reason}</p>
                <div class="suggestion-price">₹${product.price}</div>
                <div class="suggestion-age">${product.ageRange}</div>
            </div>
            <button class="suggestion-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `).join('');
}

// Get age-appropriate products
function getAgeAppropriateProducts(ageInMonths) {
    const productDatabase = [
        // 0-3 months
        { id: 101, name: 'Newborn Swaddle Blanket', price: 599, image: 'https://via.placeholder.com/150x150/FFB6C1/FFFFFF?text=Swaddle', reason: 'Helps baby sleep better', ageRange: '0-3 months', minAge: 0, maxAge: 3, priority: 'Essential', category: 'sleep' },
        { id: 102, name: 'Anti-Colic Baby Bottle', price: 799, image: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=Bottle', reason: 'Reduces gas and colic', ageRange: '0-6 months', minAge: 0, maxAge: 6, priority: 'Essential', category: 'feeding' },
        { id: 103, name: 'Baby Carrier Wrap', price: 1299, image: 'https://via.placeholder.com/150x150/98FB98/FFFFFF?text=Carrier', reason: 'Bonding and hands-free carrying', ageRange: '0-12 months', minAge: 0, maxAge: 12, priority: 'Recommended', category: 'transport' },
        
        // 4-6 months
        { id: 201, name: 'High Chair for Feeding', price: 3999, image: 'https://via.placeholder.com/150x150/DDA0DD/FFFFFF?text=High+Chair', reason: 'Starting solid foods', ageRange: '4-24 months', minAge: 4, maxAge: 24, priority: 'Essential', category: 'feeding' },
        { id: 202, name: 'Baby Food Maker', price: 2499, image: 'https://via.placeholder.com/150x150/F0E68C/FFFFFF?text=Food+Maker', reason: 'Make fresh purees at home', ageRange: '4-12 months', minAge: 4, maxAge: 12, priority: 'Recommended', category: 'feeding' },
        { id: 203, name: 'Teething Toys Set', price: 699, image: 'https://via.placeholder.com/150x150/FFE4E1/FFFFFF?text=Teething', reason: 'Soothe teething discomfort', ageRange: '4-12 months', minAge: 4, maxAge: 12, priority: 'Essential', category: 'toys' },
        
        // 7-12 months
        { id: 301, name: 'Baby Proofing Kit', price: 1599, image: 'https://via.placeholder.com/150x150/FFB347/FFFFFF?text=Safety+Kit', reason: 'Baby is becoming mobile', ageRange: '6-24 months', minAge: 6, maxAge: 24, priority: 'Essential', category: 'safety' },
        { id: 302, name: 'Push & Pull Toy', price: 899, image: 'https://via.placeholder.com/150x150/90EE90/FFFFFF?text=Push+Toy', reason: 'Encourages walking', ageRange: '8-18 months', minAge: 8, maxAge: 18, priority: 'Recommended', category: 'toys' },
        { id: 303, name: 'Sippy Cup Set', price: 499, image: 'https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=Sippy+Cup', reason: 'Transition from bottle', ageRange: '6-24 months', minAge: 6, maxAge: 24, priority: 'Essential', category: 'feeding' },
        
        // 12+ months
        { id: 401, name: 'Convertible Car Seat', price: 8999, image: 'https://via.placeholder.com/150x150/FFB6C1/FFFFFF?text=Car+Seat', reason: 'Growing out of infant seat', ageRange: '12-48 months', minAge: 12, maxAge: 48, priority: 'Essential', category: 'transport' },
        { id: 402, name: 'Educational Building Blocks', price: 1299, image: 'https://via.placeholder.com/150x150/DDA0DD/FFFFFF?text=Blocks', reason: 'Develops motor skills', ageRange: '12-36 months', minAge: 12, maxAge: 36, priority: 'Recommended', category: 'toys' },
        { id: 403, name: 'Toddler Bed Rails', price: 2499, image: 'https://via.placeholder.com/150x150/98FB98/FFFFFF?text=Bed+Rails', reason: 'Transitioning to big bed', ageRange: '18-48 months', minAge: 18, maxAge: 48, priority: 'Recommended', category: 'sleep' }
    ];
    
    // Filter products based on age with some buffer
    return productDatabase.filter(product => 
        ageInMonths >= product.minAge && ageInMonths <= product.maxAge + 3
    ).sort((a, b) => {
        // Sort by priority (Essential first) then by age relevance
        if (a.priority === 'Essential' && b.priority !== 'Essential') return -1;
        if (b.priority === 'Essential' && a.priority !== 'Essential') return 1;
        return Math.abs(ageInMonths - a.minAge) - Math.abs(ageInMonths - b.minAge);
    });
}

// Filter out products purchased in last 2 years
function filterUnpurchasedProducts(products) {
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    const recentPurchases = purchaseHistory.filter(purchase => 
        new Date(purchase.date) > twoYearsAgo
    ).map(purchase => purchase.productId);
    
    return products.filter(product => 
        !recentPurchases.includes(product.id)
    ).slice(0, 6); // Limit to 6 suggestions
}

// Navigate to product
function goToProduct(productId) {
    localStorage.setItem('selectedProduct', productId);
    window.location.href = 'product.html';
}

// Add to cart functionality
function addToCart(productId) {
    const suggestions = getAgeAppropriateProducts(getAgeInMonths(new Date(babyData.birthDate)));
    const product = suggestions.find(p => p.id == productId);
    
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Added to cart!');
}



// Add celebration animation CSS
if (!document.getElementById('celebrationStyles')) {
    const style = document.createElement('style');
    style.id = 'celebrationStyles';
    style.textContent = `
        @keyframes celebrationPop {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}