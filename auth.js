// Authentication JavaScript
let googleUserData = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    setupEventListeners();
});

// Check if user is already authenticated
async function checkAuthState() {
    const user = await db.getCurrentUser();
    if (user) {
        // Check if profile exists
        const { data: profile } = await db.getProfile(user.id);
        if (profile) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'profile-setup.html';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Sign In Form
    document.getElementById('loginForm').addEventListener('submit', handleSignIn);
    
    // Sign Up Form
    document.getElementById('registerForm').addEventListener('submit', handleSignUp);
    
    // Google User Details Form
    document.getElementById('googleUserForm').addEventListener('submit', handleGoogleUserDetails);
}

// Handle sign in
async function handleSignIn(e) {
    e.preventDefault();
    showLoading(true);
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const { data, error } = await db.signIn(email, password);
        
        if (error) {
            showError(error.message);
            return;
        }
        
        // Check if profile exists
        const { data: profile } = await db.getProfile(data.user.id);
        if (profile) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'profile-setup.html';
        }
        
    } catch (error) {
        showError('Sign in failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Handle sign up
async function handleSignUp(e) {
    e.preventDefault();
    showLoading(true);
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        showLoading(false);
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        showLoading(false);
        return;
    }
    
    try {
        const { data, error } = await db.signUp(email, password, {
            username,
            phone,
            full_name: username
        });
        
        if (error) {
            showError(error.message);
            return;
        }
        
        // Create profile
        await db.createProfile(data.user.id, {
            username,
            phone,
            email,
            full_name: username
        });
        
        showSuccess('Account created successfully! Please check your email to verify your account.');
        
        // Redirect to profile setup after a delay
        setTimeout(() => {
            window.location.href = 'profile-setup.html';
        }, 2000);
        
    } catch (error) {
        showError('Sign up failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Sign in with Google
async function signInWithGoogle() {
    showLoading(true);
    
    try {
        const { data, error } = await db.signInWithGoogle();
        
        if (error) {
            showError(error.message);
            return;
        }
        
        // Check if this is a new Google user
        if (data.user && data.user.app_metadata.provider === 'google') {
            const { data: profile } = await db.getProfile(data.user.id);
            
            if (!profile) {
                // New Google user - show additional details form
                googleUserData = data.user;
                showGoogleDetailsForm();
            } else {
                // Existing user
                window.location.href = 'dashboard.html';
            }
        }
        
    } catch (error) {
        showError('Google sign in failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Sign up with Google
async function signUpWithGoogle() {
    await signInWithGoogle(); // Same flow as sign in
}

// Handle Google user additional details
async function handleGoogleUserDetails(e) {
    e.preventDefault();
    showLoading(true);
    
    const username = document.getElementById('googleUsername').value;
    const phone = document.getElementById('googlePhone').value;
    const password = document.getElementById('googlePassword').value;
    
    try {
        // Create profile for Google user
        await db.createProfile(googleUserData.id, {
            username,
            phone,
            email: googleUserData.email,
            full_name: googleUserData.user_metadata.full_name || username,
            avatar_url: googleUserData.user_metadata.avatar_url
        });
        
        showSuccess('Profile completed successfully!');
        
        setTimeout(() => {
            window.location.href = 'profile-setup.html';
        }, 1500);
        
    } catch (error) {
        showError('Failed to complete profile. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Show Google details form
function showGoogleDetailsForm() {
    document.getElementById('signInForm').classList.remove('active');
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('googleDetailsForm').style.display = 'block';
    
    // Pre-fill email if available
    if (googleUserData && googleUserData.email) {
        // Show email in a read-only field or just display it
        const form = document.getElementById('googleDetailsForm');
        const emailDisplay = document.createElement('p');
        emailDisplay.innerHTML = `<strong>Email:</strong> ${googleUserData.email}`;
        emailDisplay.style.marginBottom = '20px';
        emailDisplay.style.color = '#666';
        form.insertBefore(emailDisplay, form.querySelector('form'));
    }
}

// Toggle between sign in and sign up
function showSignIn() {
    document.getElementById('signInForm').classList.add('active');
    document.getElementById('signUpForm').classList.remove('active');
    clearMessages();
}

function showSignUp() {
    document.getElementById('signInForm').classList.remove('active');
    document.getElementById('signUpForm').classList.add('active');
    clearMessages();
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show/hide loading
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

// Show error message
function showError(message) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form.active') || document.querySelector('.auth-form[style*="block"]');
    if (activeForm) {
        activeForm.insertBefore(errorDiv, activeForm.querySelector('form'));
    }
}

// Show success message
function showSuccess(message) {
    clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form.active') || document.querySelector('.auth-form[style*="block"]');
    if (activeForm) {
        activeForm.insertBefore(successDiv, activeForm.querySelector('form'));
    }
}

// Clear messages
function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (Indian format)
function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}