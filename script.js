// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// WhatsApp booking function - redirect to booking form
function bookService(serviceName) {
    // Scroll to booking section
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Pre-select the service in the dropdown
        setTimeout(() => {
            const serviceSelect = document.getElementById('service-select');
            if (serviceSelect) {
                // Find the option that contains the service name
                const options = serviceSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].text.includes(serviceName)) {
                        serviceSelect.value = options[i].value;
                        selectedService = options[i].value;
                        updateCheckButton();
                        
                        // Add a highlight effect to show the form
                        const bookingForm = document.querySelector('.booking-form');
                        if (bookingForm) {
                            bookingForm.style.boxShadow = '0 0 20px rgba(172, 152, 144, 0.3)';
                            bookingForm.style.transform = 'scale(1.02)';
                            bookingForm.style.transition = 'all 0.3s ease';
                            
                            setTimeout(() => {
                                bookingForm.style.boxShadow = '';
                                bookingForm.style.transform = '';
                            }, 2000);
                        }
                        break;
                    }
                }
            }
        }, 500);
    }
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service categories and contact items
document.addEventListener('DOMContentLoaded', () => {
    const serviceCategories = document.querySelectorAll('.service-category');
    const contactItems = document.querySelectorAll('.contact-item');
    
    serviceCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(category);
    });
    
    contactItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Booking System
let selectedService = '';
let selectedDate = '';
let selectedTime = '';

// Simulated busy slots (in real app, this would come from a database)
const busySlots = {
    '2024-12-20': ['10:00', '14:00', '16:00'],
    '2024-12-21': ['09:00', '15:00'],
    '2024-12-22': ['11:00', '17:00', '18:00']
};

function initializeBookingSystem() {
    const serviceSelect = document.getElementById('service-select');
    const dateSelect = document.getElementById('date-select');
    const timeSelect = document.getElementById('time-select');
    const checkBtn = document.getElementById('check-availability');
    const whatsappBtn = document.getElementById('book-whatsapp');
    const availabilityResult = document.getElementById('availability-result');
    
    // Set minimum date to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateSelect.min = tomorrow.toISOString().split('T')[0];
    
    // Service selection handler
    serviceSelect.addEventListener('change', function() {
        selectedService = this.value;
        updateCheckButton();
    });
    
    // Date selection handler
    dateSelect.addEventListener('change', function() {
        selectedDate = this.value;
        updateCheckButton();
        // Reset time selection when date changes
        timeSelect.value = '';
        selectedTime = '';
        availabilityResult.innerHTML = '';
        availabilityResult.className = 'availability-result';
        whatsappBtn.disabled = true;
    });
    
    // Time selection handler
    timeSelect.addEventListener('change', function() {
        selectedTime = this.value;
        updateCheckButton();
        // Reset availability when time changes
        availabilityResult.innerHTML = '';
        availabilityResult.className = 'availability-result';
        whatsappBtn.disabled = true;
    });
    
    // Check availability handler
    checkBtn.addEventListener('click', function() {
        if (!selectedService || !selectedDate || !selectedTime) {
            availabilityResult.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Veuillez remplir tous les champs';
            availabilityResult.className = 'availability-result unavailable';
            return;
        }
        
        // Simulate checking availability
        checkBtn.disabled = true;
        checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification...';
        
        setTimeout(() => {
            const isAvailable = checkAvailability(selectedDate, selectedTime);
            
            if (isAvailable) {
                availabilityResult.innerHTML = '<i class="fas fa-check-circle"></i> Créneau disponible ! Vous pouvez confirmer votre réservation.';
                availabilityResult.className = 'availability-result available';
                whatsappBtn.disabled = false;
            } else {
                availabilityResult.innerHTML = '<i class="fas fa-times-circle"></i> Créneau non disponible. Veuillez choisir une autre heure.';
                availabilityResult.className = 'availability-result unavailable';
                whatsappBtn.disabled = true;
            }
            
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Vérifier la disponibilité';
        }, 1500);
    });
    
    // WhatsApp booking handler
    whatsappBtn.addEventListener('click', function() {
        if (selectedService && selectedDate && selectedTime) {
            const phoneNumber = '212691326107';
            const formattedDate = new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const message = `Bonjour ZINDODO,\n\nJe souhaite réserver :\n\n🎯 Service : ${selectedService}\n📅 Date : ${formattedDate}\n🕐 Heure : ${selectedTime}\n\nMerci de confirmer ma réservation.`;
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    });
}

function updateCheckButton() {
    const checkBtn = document.getElementById('check-availability');
    const whatsappBtn = document.getElementById('book-whatsapp');
    
    if (selectedService && selectedDate && selectedTime) {
        checkBtn.disabled = false;
        checkBtn.style.opacity = '1';
    } else {
        checkBtn.disabled = true;
        checkBtn.style.opacity = '0.6';
        whatsappBtn.disabled = true;
    }
}

function checkAvailability(date, time) {
    // Simulate availability check
    // In real app, this would make an API call to check database
    
    // Check if the selected slot is in busy slots
    if (busySlots[date] && busySlots[date].includes(time)) {
        return false;
    }
    
    // Random availability for demonstration (80% chance of being available)
    return Math.random() > 0.2;
}

// Service booking function - automatically selects most expensive service in category
function bookService(category) {
    const serviceSelect = document.getElementById('service-select');
    
    // Define most expensive service for each category
    const mostExpensiveServices = {
        'Maquillage': 'Maquillage mariée - 500 MAD',
        'Coiffure': 'Lissage brésilien - 800 MAD',
        'Soins du Visage': 'Soin anti-âge - 350 MAD',
        'Épilation': 'Épilation jambes complètes - 200 MAD',
        'Manucure & Pédicure': 'Pose vernis semi-permanent - 150 MAD',
        'Massages': 'Massage aux pierres chaudes - 350 MAD'
    };
    
    // Select the most expensive service for the category
    const selectedServiceValue = mostExpensiveServices[category];
    if (selectedServiceValue && serviceSelect) {
        serviceSelect.value = selectedServiceValue;
        selectedService = selectedServiceValue;
        updateCheckButton();
        
        // Scroll to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Add visual feedback
        serviceSelect.style.border = '2px solid #AC9890';
        setTimeout(() => {
            serviceSelect.style.border = '';
        }, 2000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add initial loading state
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Initialize booking system
    initializeBookingSystem();
    
    // Preload critical elements
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
});