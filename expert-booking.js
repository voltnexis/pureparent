// Expert data
const experts = {
    pediatrician: [
        {
            id: 1,
            name: "Dr. Priya Sharma",
            specialty: "Pediatrician",
            rating: 4.9,
            fee: 499,
            qualifications: ["MBBS, MD Pediatrics", "15+ years experience", "Apollo Hospital"],
            nextAvailable: "Today 2:00 PM",
            avatar: "PS"
        },
        {
            id: 2,
            name: "Dr. Rajesh Kumar",
            specialty: "Child Specialist",
            rating: 4.8,
            fee: 599,
            qualifications: ["MBBS, DCH", "12+ years experience", "Max Hospital"],
            nextAvailable: "Tomorrow 10:00 AM",
            avatar: "RK"
        }
    ],
    lactation: [
        {
            id: 3,
            name: "Meera Patel",
            specialty: "Lactation Consultant",
            rating: 4.9,
            fee: 299,
            qualifications: ["IBCLC Certified", "8+ years experience", "Breastfeeding Support"],
            nextAvailable: "Today 4:00 PM",
            avatar: "MP"
        },
        {
            id: 4,
            name: "Anjali Singh",
            specialty: "Lactation Expert",
            rating: 4.7,
            fee: 349,
            qualifications: ["CLC Certified", "6+ years experience", "New Mom Support"],
            nextAvailable: "Tomorrow 11:00 AM",
            avatar: "AS"
        }
    ],
    sleep: [
        {
            id: 5,
            name: "Dr. Kavita Jain",
            specialty: "Sleep Coach",
            rating: 4.8,
            fee: 399,
            qualifications: ["Sleep Consultant Certified", "10+ years experience", "Gentle Sleep Methods"],
            nextAvailable: "Today 6:00 PM",
            avatar: "KJ"
        }
    ]
};

// Booking state
let selectedExpert = null;
let selectedDate = null;
let selectedTime = null;
let bookingData = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const expertType = localStorage.getItem('selectedExpertType') || 'pediatrician';
    loadExperts(expertType);
    updateCartCount();
});

// Load experts based on type
function loadExperts(expertType) {
    const expertsGrid = document.getElementById('expertsGrid');
    const expertsList = experts[expertType] || experts.pediatrician;
    
    expertsGrid.innerHTML = expertsList.map(expert => `
        <div class="expert-card" onclick="selectExpert(${expert.id}, '${expertType}')">
            <div class="expert-avatar">
                <span>${expert.avatar}</span>
            </div>
            <h3>${expert.name}</h3>
            <p class="expert-specialty">${expert.specialty}</p>
            <div class="expert-rating">
                <span>${'⭐'.repeat(Math.floor(expert.rating))} ${expert.rating}</span>
                <span class="expert-fee">₹${expert.fee}</span>
            </div>
            <div class="expert-qualifications">
                <h4>Qualifications</h4>
                <ul>
                    ${expert.qualifications.map(qual => `<li>${qual}</li>`).join('')}
                </ul>
            </div>
            <div class="next-available">Next: ${expert.nextAvailable}</div>
            <button class="book-expert-btn">Book Consultation</button>
        </div>
    `).join('');
}

// Select expert and open booking modal
function selectExpert(expertId, expertType) {
    const expertsList = experts[expertType];
    selectedExpert = expertsList.find(expert => expert.id === expertId);
    
    if (selectedExpert) {
        openBookingModal();
        updateExpertInfo();
    }
}

// Open booking modal
function openBookingModal() {
    document.getElementById('bookingModal').style.display = 'flex';
    showBookingStep(1);
}

// Close booking modal
function closeBooking() {
    document.getElementById('bookingModal').style.display = 'none';
    resetBookingData();
}

// Reset booking data
function resetBookingData() {
    selectedExpert = null;
    selectedDate = null;
    selectedTime = null;
    bookingData = {};
}

// Update expert info in modal
function updateExpertInfo() {
    document.getElementById('expertInitial').textContent = selectedExpert.avatar;
    document.getElementById('expertName').textContent = selectedExpert.name;
    document.getElementById('expertSpecialty').textContent = selectedExpert.specialty;
    document.getElementById('expertRating').textContent = `${'⭐'.repeat(Math.floor(selectedExpert.rating))} ${selectedExpert.rating}`;
    document.getElementById('expertFee').textContent = `₹${selectedExpert.fee}`;
}

// Navigate between booking steps
function nextBookingStep(stepNumber) {
    if (stepNumber === 2) {
        // Validate pre-consult form
        const concern = document.getElementById('concern').value.trim();
        if (!concern) {
            showNotification('Please describe your concern');
            return;
        }
        
        bookingData.concern = concern;
        bookingData.urgency = document.querySelector('input[name="urgency"]:checked').value;
        bookingData.photos = document.getElementById('photos').files;
        
        loadDateOptions();
    }
    
    if (stepNumber === 3) {
        if (!selectedDate || !selectedTime) {
            showNotification('Please select date and time');
            return;
        }
        
        updateBookingSummary();
    }
    
    showBookingStep(stepNumber);
}

// Show specific booking step
function showBookingStep(stepNumber) {
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`bookingStep${stepNumber}`).classList.add('active');
}

// Load date options
function loadDateOptions() {
    const dateOptions = document.getElementById('dateOptions');
    const dates = [];
    
    // Generate next 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }
    
    dateOptions.innerHTML = dates.map((date, index) => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateNum = date.getDate();
        const isToday = index === 0;
        
        return `
            <div class="date-option" onclick="selectDate('${date.toISOString()}')">
                <div class="day">${isToday ? 'Today' : dayName}</div>
                <div class="date">${dateNum}</div>
            </div>
        `;
    }).join('');
    
    // Load time slots for first date
    selectDate(dates[0].toISOString());
}

// Select date
function selectDate(dateString) {
    selectedDate = dateString;
    
    // Update UI
    document.querySelectorAll('.date-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.date-option').classList.add('selected');
    
    // Load time slots
    loadTimeSlots();
}

// Load time slots
function loadTimeSlots() {
    const timeSlots = document.getElementById('timeSlots');
    const slots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM', '07:00 PM'
    ];
    
    timeSlots.innerHTML = slots.map(slot => {
        const isAvailable = Math.random() > 0.3; // Random availability
        return `
            <div class="time-slot ${isAvailable ? '' : 'unavailable'}" 
                 onclick="${isAvailable ? `selectTime('${slot}')` : ''}">
                ${slot}
            </div>
        `;
    }).join('');
}

// Select time slot
function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Enable next button
    document.getElementById('slotNext').disabled = false;
}

// Update booking summary
function updateBookingSummary() {
    const date = new Date(selectedDate);
    const dateTimeString = `${date.toLocaleDateString()} at ${selectedTime}`;
    
    document.getElementById('summaryExpert').textContent = selectedExpert.name;
    document.getElementById('summaryDateTime').textContent = dateTimeString;
    document.getElementById('summaryTotal').textContent = `₹${selectedExpert.fee}`;
}

// Confirm booking
function confirmBooking() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Simulate payment processing
    showNotification('Processing payment...');
    
    setTimeout(() => {
        // Save booking
        const booking = {
            id: 'CONS' + Date.now(),
            expert: selectedExpert,
            date: selectedDate,
            time: selectedTime,
            concern: bookingData.concern,
            urgency: bookingData.urgency,
            paymentMethod: paymentMethod,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        const consultations = JSON.parse(localStorage.getItem('consultations')) || [];
        consultations.push(booking);
        localStorage.setItem('consultations', JSON.stringify(consultations));
        
        // Show success
        showSuccessModal();
    }, 2000);
}

// Show success modal
function showSuccessModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'flex';
    
    // Update success details
    const date = new Date(selectedDate);
    const dateTimeString = `${date.toLocaleDateString()} at ${selectedTime}`;
    
    document.getElementById('confirmedExpert').textContent = selectedExpert.name;
    document.getElementById('confirmedDateTime').textContent = dateTimeString;
}

// Add to calendar
function addToCalendar() {
    const date = new Date(selectedDate);
    const title = `Consultation with ${selectedExpert.name}`;
    const details = `Baby consultation - ${bookingData.concern}`;
    
    // Create calendar event (simplified)
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    
    window.open(calendarUrl, '_blank');
    showNotification('Calendar event created!');
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

// Close modals when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === bookingModal) {
        closeBooking();
    }
    
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
}