// Birthday pack data
let babyProfile = {};
let selectedGifts = [];
let selectedServices = [];
let birthdayWish = '';
let packData = {};

// Sample birthday wishes
const birthdayWishes = [
    {
        title: "A Year of Wonder",
        text: "Happy 1st Birthday to our little miracle! This year has been filled with first smiles, first laughs, and countless precious moments. May your journey ahead be filled with joy, discovery, and endless love. You've brought so much happiness into our lives, and we can't wait to see all the amazing things you'll do!",
        signature: "With all our love ❤️"
    },
    {
        title: "Growing So Fast",
        text: "One whole year of pure joy! From tiny fingers to first steps, you've amazed us every single day. Your giggles light up our world and your curiosity inspires us. Here's to another year of adventures, learning, and growing together. Happy Birthday, sweet little one!",
        signature: "Forever yours 💕"
    },
    {
        title: "Our Little Star",
        text: "365 days ago, you came into our world and made everything brighter! Your first year has been a beautiful journey of milestones and memories. As you blow out your first candle, know that you are loved beyond measure. May this new year bring you health, happiness, and wonderful discoveries!",
        signature: "With endless love 🌟"
    }
];

// Age-appropriate gifts
const giftsByAge = {
    12: [ // 1 year
        { id: 1, name: "Soft Stacking Rings", price: 299, emoji: "🔴" },
        { id: 2, name: "Musical Activity Cube", price: 899, emoji: "🎵" },
        { id: 3, name: "Push & Pull Toy", price: 599, emoji: "🚂" },
        { id: 4, name: "Soft Building Blocks", price: 449, emoji: "🧱" },
        { id: 5, name: "Shape Sorter Toy", price: 399, emoji: "🔷" },
        { id: 6, name: "Baby's First Book Set", price: 349, emoji: "📚" }
    ],
    24: [ // 2 years
        { id: 7, name: "Wooden Puzzle Set", price: 499, emoji: "🧩" },
        { id: 8, name: "Ride-On Toy Car", price: 1299, emoji: "🚗" },
        { id: 9, name: "Art & Craft Kit", price: 699, emoji: "🎨" },
        { id: 10, name: "Musical Instruments Set", price: 799, emoji: "🎼" },
        { id: 11, name: "Pretend Play Kitchen", price: 1599, emoji: "👩‍🍳" },
        { id: 12, name: "Balance Bike", price: 2299, emoji: "🚲" }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadBabyProfile();
    generateBirthdayWish();
    updateCartCount();
});

// Load baby profile
function loadBabyProfile() {
    const savedProfile = localStorage.getItem('babyProfile');
    if (savedProfile) {
        babyProfile = JSON.parse(savedProfile);
        updateAgeDisplay();
    } else {
        // Redirect to onboarding if no profile
        window.location.href = 'onboarding.html';
    }
}

// Update age display
function updateAgeDisplay() {
    const ageInMonths = calculateAgeInMonths(babyProfile.dob);
    document.getElementById('ageDisplay').textContent = `${ageInMonths} months`;
    
    // Load appropriate gifts
    loadGifts(ageInMonths);
}

// Calculate age in months
function calculateAgeInMonths(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                   (today.getMonth() - birthDate.getMonth());
    return Math.max(0, months);
}

// Generate birthday wish
function generateBirthdayWish() {
    // Simulate AI generation with loading
    setTimeout(() => {
        const randomWish = birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)];
        birthdayWish = randomWish;
        
        // Personalize with baby's name
        const personalizedText = randomWish.text.replace(/little one|sweet little one|our little miracle/g, babyProfile.name || 'little one');
        
        document.getElementById('wishPreview').innerHTML = `
            <div class="wish-content">
                <h3>${randomWish.title}</h3>
                <p class="wish-text">${personalizedText}</p>
                <p class="wish-signature">${randomWish.signature}</p>
            </div>
        `;
        
        document.getElementById('wishActions').style.display = 'flex';
    }, 2000);
}

// Regenerate wish
function regenerateWish() {
    document.getElementById('wishPreview').innerHTML = `
        <div class="generating">
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
            <p>Generating new wish...</p>
        </div>
    `;
    
    document.getElementById('wishActions').style.display = 'none';
    generateBirthdayWish();
}

// Load gifts based on age
function loadGifts(ageInMonths) {
    let giftAge = 12;
    if (ageInMonths >= 24) giftAge = 24;
    
    const gifts = giftsByAge[giftAge] || giftsByAge[12];
    const giftsGrid = document.getElementById('giftsGrid');
    
    giftsGrid.innerHTML = gifts.map(gift => `
        <div class="gift-card" onclick="toggleGift(${gift.id})">
            <div class="gift-image">${gift.emoji}</div>
            <div class="gift-name">${gift.name}</div>
            <div class="gift-price">₹${gift.price}</div>
        </div>
    `).join('');
}

// Toggle gift selection
function toggleGift(giftId) {
    const giftCard = event.target.closest('.gift-card');
    const allGifts = [...Object.values(giftsByAge).flat()];
    const gift = allGifts.find(g => g.id === giftId);
    
    if (!gift) return;
    
    const isSelected = selectedGifts.find(g => g.id === giftId);
    
    if (isSelected) {
        // Remove gift
        selectedGifts = selectedGifts.filter(g => g.id !== giftId);
        giftCard.classList.remove('selected');
    } else {
        // Add gift
        selectedGifts.push(gift);
        giftCard.classList.add('selected');
    }
    
    updateSelectedGifts();
}

// Update selected gifts display
function updateSelectedGifts() {
    const container = document.getElementById('selectedGifts');
    const countElement = document.getElementById('selectedCount');
    const totalElement = document.getElementById('giftsTotal');
    
    countElement.textContent = selectedGifts.length;
    
    if (selectedGifts.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No gifts selected</p>';
        totalElement.textContent = '0';
        document.getElementById('giftsNext').disabled = true;
    } else {
        container.innerHTML = selectedGifts.map(gift => `
            <div class="selected-item">
                <span>${gift.emoji} ${gift.name}</span>
                <span class="remove-gift" onclick="removeGift(${gift.id})">×</span>
            </div>
        `).join('');
        
        const total = selectedGifts.reduce((sum, gift) => sum + gift.price, 0);
        totalElement.textContent = total;
        document.getElementById('giftsNext').disabled = false;
    }
}

// Remove gift
function removeGift(giftId) {
    selectedGifts = selectedGifts.filter(g => g.id !== giftId);
    
    // Update UI
    const giftCards = document.querySelectorAll('.gift-card');
    giftCards.forEach(card => {
        const cardGiftId = parseInt(card.onclick.toString().match(/\d+/)[0]);
        if (cardGiftId === giftId) {
            card.classList.remove('selected');
        }
    });
    
    updateSelectedGifts();
}

// Navigate between steps
function nextStep(stepNumber) {
    if (stepNumber === 3) {
        // Set minimum delivery date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('deliveryDate').min = tomorrow.toISOString().split('T')[0];
        document.getElementById('deliveryDate').value = tomorrow.toISOString().split('T')[0];
        
        // Setup service listeners
        setupServiceListeners();
    }
    
    if (stepNumber === 4) {
        updateFinalSummary();
    }
    
    // Hide current step
    document.querySelectorAll('.pack-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show next step
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// Setup service listeners
function setupServiceListeners() {
    const serviceOptions = document.querySelectorAll('.service-option input');
    serviceOptions.forEach(option => {
        option.addEventListener('change', updateServices);
    });
}

// Update selected services
function updateServices() {
    selectedServices = [];
    const checkedServices = document.querySelectorAll('.service-option input:checked');
    
    checkedServices.forEach(service => {
        selectedServices.push({
            name: service.parentElement.querySelector('.service-name').textContent,
            price: parseInt(service.dataset.price),
            value: service.value
        });
    });
}

// Update final summary
function updateFinalSummary() {
    // Child info
    const ageInMonths = calculateAgeInMonths(babyProfile.dob);
    const ageInYears = Math.floor(ageInMonths / 12);
    document.getElementById('childName').textContent = babyProfile.name;
    document.getElementById('childAge').textContent = `Turning ${ageInYears + 1}`;
    
    // Birthday wish
    document.getElementById('finalWish').innerHTML = `
        <h4>${birthdayWish.title}</h4>
        <p style="margin: 10px 0; color: #666; font-style: italic;">${birthdayWish.text}</p>
        <p style="text-align: right; color: #999; font-size: 14px;">${birthdayWish.signature}</p>
    `;
    
    // Selected gifts
    const finalGifts = document.getElementById('finalGifts');
    finalGifts.innerHTML = selectedGifts.map(gift => `
        <div class="final-gift-item">
            <div class="gift-info">
                <span class="gift-emoji">${gift.emoji}</span>
                <span>${gift.name}</span>
            </div>
            <span>₹${gift.price}</span>
        </div>
    `).join('');
    
    // Delivery date
    const deliveryDate = document.getElementById('deliveryDate').value;
    document.getElementById('finalDeliveryDate').textContent = new Date(deliveryDate).toLocaleDateString();
    
    // Services
    const finalServices = document.getElementById('finalServices');
    if (selectedServices.length === 0) {
        finalServices.innerHTML = '<p style="color: #666; font-style: italic;">No additional services</p>';
    } else {
        finalServices.innerHTML = selectedServices.map(service => `
            <div class="service-item">
                <span>${service.name}</span>
                <span>₹${service.price}</span>
            </div>
        `).join('');
    }
    
    // Totals
    const giftsTotal = selectedGifts.reduce((sum, gift) => sum + gift.price, 0);
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    const grandTotal = giftsTotal + servicesTotal;
    
    document.getElementById('finalGiftsTotal').textContent = giftsTotal;
    document.getElementById('finalServicesTotal').textContent = servicesTotal;
    document.getElementById('grandTotal').textContent = grandTotal;
}

// Create birthday pack
function createBirthdayPack() {
    const deliveryDate = document.getElementById('deliveryDate').value;
    const customMessage = document.getElementById('customMessage').value;
    
    // Create pack data
    packData = {
        id: 'BP' + Date.now(),
        babyName: babyProfile.name,
        babyAge: calculateAgeInMonths(babyProfile.dob),
        birthdayWish: birthdayWish,
        gifts: selectedGifts,
        services: selectedServices,
        deliveryDate: deliveryDate,
        customMessage: customMessage,
        total: selectedGifts.reduce((sum, gift) => sum + gift.price, 0) + 
               selectedServices.reduce((sum, service) => sum + service.price, 0),
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const birthdayPacks = JSON.parse(localStorage.getItem('birthdayPacks')) || [];
    birthdayPacks.push(packData);
    localStorage.setItem('birthdayPacks', JSON.stringify(birthdayPacks));
    
    // Add to orders
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders.push({
        id: packData.id,
        type: 'birthday-pack',
        date: new Date().toLocaleDateString(),
        total: packData.total,
        status: 'Processing',
        items: packData.gifts
    });
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    
    // Show success modal
    showSuccessModal();
}

// Show success modal
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
    document.getElementById('packId').textContent = packData.id;
}

// Download e-card
function downloadECard() {
    // Create a simple e-card content
    const eCardContent = `
🎂 Happy Birthday ${babyProfile.name}! 🎂

${birthdayWish.title}

${birthdayWish.text}

${birthdayWish.signature}

---
Created with love by PureParent
Pack ID: ${packData.id}
    `;
    
    // Create and download file
    const blob = new Blob([eCardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${babyProfile.name}_Birthday_Card.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('E-card downloaded! 📱');
}

// Go to orders
function goToOrders() {
    window.location.href = 'login.html'; // Orders are in login/account page
}

// Go to dashboard
function goToDashboard() {
    window.location.href = 'onboarding.html';
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
        z-index: 3000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const successModal = document.getElementById('successModal');
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
}