// ================================
// Mobile Menu Toggle
// ================================
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Toggle menu icon animation
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (menuToggle.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        });
    });
}

// ================================
// Sticky Header on Scroll
// ================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajouter la classe "scrolled" quand on descend de plus de 50px
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ================================
// Smooth Scroll for Navigation Links
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Check if it's not just "#"
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ================================
// Active Navigation Link on Scroll
// ================================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-list a');

function activateNavLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ================================
// Testimonials Slider
// ================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentTestimonial = 0;

function showTestimonial(index) {
    // Remove active class from all
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current
    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextTestimonial);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevTestimonial);
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-play testimonials
let testimonialInterval = setInterval(nextTestimonial, 5000);

// Pause auto-play on hover
const testimonialsSection = document.querySelector('.testimonials');
if (testimonialsSection) {
    testimonialsSection.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });

    testimonialsSection.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    });
}

// ================================
// Scroll Animations
// ================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animateOnScroll = document.querySelectorAll(
    '.benefit-card, .pricing-card, .class-card, .section-header'
);

animateOnScroll.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ================================
// Contact Form Handling
// ================================
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Simple validation
        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        // Simulate form submission
        console.log('Form submitted:', { name, email, phone, message });

        // Show success message
        alert('Merci pour votre message ! Nous vous contacterons bientôt.');

        // Reset form
        contactForm.reset();

        // In a real application, you would send this data to a server:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, message })
        })
        .then(response => response.json())
        .then(data => {
            alert('Message envoyé avec succès !');
            contactForm.reset();
        })
        .catch(error => {
            alert('Une erreur est survenue. Veuillez réessayer.');
        });
        */
    });
}

// ================================
// Newsletter Form Handling
// ================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        // Simulate newsletter subscription
        console.log('Newsletter subscription:', email);
        alert('Merci de vous être abonné à notre newsletter !');
        newsletterForm.reset();

        // In a real application:
        /*
        fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            alert('Abonnement réussi !');
            newsletterForm.reset();
        })
        .catch(error => {
            alert('Une erreur est survenue.');
        });
        */
    });
}

// ================================
// Add mobile menu styles dynamically
// ================================
if (window.innerWidth <= 768) {
    const style = document.createElement('style');
    style.textContent = `
        .nav-list {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background-color: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: left 0.3s ease;
            z-index: 999;
        }

        .nav-list.active {
            left: 0;
        }

        .nav-list li {
            margin: 1rem 0;
        }

        .nav-list a {
            font-size: 1.2rem;
            display: block;
            padding: 0.5rem 0;
        }
    `;
    document.head.appendChild(style);
}

// ================================
// Counter Animation for Stats
// ================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.stats-number');
            if (number && !number.classList.contains('counted')) {
                number.classList.add('counted');
                animateCounter(number, 332);
            }
        }
    });
}, { threshold: 0.5 });

const statsBadge = document.querySelector('.stats-badge');
if (statsBadge) {
    statsObserver.observe(statsBadge);
}

// ================================
// Pricing Card Hover Effect Enhancement
// ================================
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color');
    });

    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('featured')) {
            this.style.borderColor = '';
        }
    });
});

// ================================
// Initialize on page load
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Mantra Yoga Website - Loaded Successfully');

    // Show first testimonial
    showTestimonial(0);

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ================================
// Handle window resize
// ================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reset mobile menu if window is resized to desktop
        if (window.innerWidth > 768) {
            navList.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }, 250);
});