// ================================
// Load Header and Footer
// ================================
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// Load header and footer when DOM is loaded
async function loadHeaderAndFooter() {
    await loadComponent('header-placeholder', 'header.html');
    await loadComponent('footer-placeholder', 'footer.html');

    // Re-initialize header-dependent scripts after header is loaded
    initHeaderScripts();
    // Initialize footer-dependent scripts after footer is loaded
    initFooterScripts();
}

// Initialize scripts that depend on header being loaded
function initHeaderScripts() {
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initActiveNavLink();
}

// Initialize scripts that depend on footer being loaded
function initFooterScripts() {
    initNewsletterForm();
    decodeEmail();
}

// ================================
// Mobile Menu Toggle
// ================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const dropdownParents = document.querySelectorAll('.has-dropdown');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Handle dropdown toggle on mobile
        dropdownParents.forEach(parent => {
            const link = parent.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    // Only toggle dropdown on mobile
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        parent.classList.toggle('active');
                    }
                });
            }
        });

        // Close menu when clicking on dropdown links (not parent)
        const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                dropdownParents.forEach(parent => parent.classList.remove('active'));
            });
        });
    }
}

// ================================
// Sticky Header on Scroll
// ================================
function initStickyHeader() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Ajouter la classe "scrolled" quand on descend de plus de 50px
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// ================================
// Smooth Scroll for Navigation Links
// ================================
function initSmoothScroll() {
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
}

// ================================
// Active Navigation Link on Scroll
// ================================
function initActiveNavLink() {
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
}

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
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animateOnScroll = document.querySelectorAll(
    '.benefit-card, .pricing-card, .class-card, .section-header'
);

animateOnScroll.forEach(element => {
    element.classList.add('animate-on-scroll');
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
function initNewsletterForm() {
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

            // Show success message
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
// Initialize on page load
// ================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load header and footer first
    await loadHeaderAndFooter();

    // Show first testimonial
    showTestimonial(0);

    // Add loading animation
    document.body.classList.add('loading');
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
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
            const navList = document.querySelector('.nav-list');
            const menuToggle = document.querySelector('.menu-toggle');
            const dropdownParents = document.querySelectorAll('.has-dropdown');

            if (navList) navList.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            dropdownParents.forEach(parent => parent.classList.remove('active'));
        }
    }, 250);
});

// ================================
// Email Obfuscation (Anti-Spam)
// ================================
function decodeEmail() {
    // Email encoded in base64 to avoid spam bots
    const encoded = 'bGF1cmllZHVkb3V0LnByb0BnbWFpbC5jb20=';
    const decoded = atob(encoded);

    // List of all possible email element IDs
    const emailIds = [
        'email-contact',
        'email-legal',
        'email-director',
        'email-gdpr',
        'email-privacy',
        'email-rights',
        'email-contact-legal',
        'email-contact-privacy'
    ];

    // Decode email for all elements that exist on the page
    emailIds.forEach(id => {
        const emailElement = document.getElementById(id);
        if (emailElement) {
            // Create mailto link
            const link = document.createElement('a');
            link.href = `mailto:${decoded}`;
            link.textContent = decoded;
            link.className = 'email-link';

            emailElement.appendChild(link);
        }
    });
}

// ================================
// Cookie Consent Management (RGPD)
// ================================
async function initCookieBanner() {
    try {
        // Load cookie banner HTML
        const response = await fetch('cookie-banner.html');
        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);

        // Check if user has already made a choice (localStorage ou cookie fallback)
        let cookieConsent = null;

        try {
            cookieConsent = localStorage.getItem('cookieConsent');
            console.log('📦 localStorage cookieConsent:', cookieConsent);
        } catch (e) {
            console.warn('⚠️ localStorage inaccessible, essai du cookie fallback');
            // Fallback: lire le cookie
            const cookies = document.cookie.split(';');
            const consentCookie = cookies.find(c => c.trim().startsWith('cookieConsent='));
            if (consentCookie) {
                cookieConsent = consentCookie.split('=')[1];
                console.log('🍪 Cookie fallback trouvé:', cookieConsent);
            }
        }

        if (!cookieConsent) {
            console.log('❌ Aucun consentement trouvé → Affichage bannière');
            // Show banner after 1 second if no consent recorded
            setTimeout(() => {
                const banner = document.getElementById('cookie-banner');
                if (banner) {
                    banner.classList.remove('hidden');
                    banner.classList.add('visible');
                    console.log('📢 Bannière cookies affichée');
                }
            }, 1000);
        } else {
            console.log('✅ Consentement trouvé → Bannière masquée');
            // S'assurer que la bannière et le modal restent cachés
            const banner = document.getElementById('cookie-banner');
            const modal = document.getElementById('cookie-settings-modal');

            if (banner) {
                banner.classList.add('hidden');
                banner.remove(); // Supprimer complètement du DOM
                console.log('🔒 Bannière supprimée du DOM');
            }

            if (modal) {
                modal.classList.add('hidden');
                modal.remove(); // Supprimer complètement du DOM
                console.log('🔒 Modal paramètres supprimé du DOM');
            }

            // Apply saved preferences
            applyCookiePreferences(JSON.parse(cookieConsent));
        }

        // Event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const refuseBtn = document.getElementById('cookie-refuse');
        const settingsBtn = document.getElementById('cookie-settings');
        const modalClose = document.getElementById('cookie-modal-close');
        const saveBtn = document.getElementById('cookie-save-settings');
        const acceptAllBtn = document.getElementById('cookie-accept-all');

        if (acceptBtn) acceptBtn.addEventListener('click', acceptAllCookies);
        if (refuseBtn) refuseBtn.addEventListener('click', refuseAllCookies);
        if (settingsBtn) settingsBtn.addEventListener('click', openCookieSettings);
        if (modalClose) modalClose.addEventListener('click', closeCookieSettings);
        if (saveBtn) saveBtn.addEventListener('click', saveCustomSettings);
        if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => {
            acceptAllCookies();
            closeCookieSettings();
        });
    } catch (error) {
        // Silently fail if cookie banner can't be loaded
    }
}

function acceptAllCookies() {
    const preferences = {
        necessary: true,
        analytics: true,
        marketing: true
    };

    saveCookiePreferences(preferences);
    hideCookieBanner();
    applyCookiePreferences(preferences);
}

function refuseAllCookies() {
    const preferences = {
        necessary: true,
        analytics: false,
        marketing: false
    };

    saveCookiePreferences(preferences);
    hideCookieBanner();
    applyCookiePreferences(preferences);
}

function openCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('visible');

        // Load current preferences if any
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (cookieConsent) {
            const prefs = JSON.parse(cookieConsent);
            const analyticsCheckbox = document.getElementById('cookie-analytics');
            const marketingCheckbox = document.getElementById('cookie-marketing');

            if (analyticsCheckbox) analyticsCheckbox.checked = prefs.analytics;
            if (marketingCheckbox) marketingCheckbox.checked = prefs.marketing;
        }
    }
}

function closeCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('visible');
    }
}

function saveCustomSettings() {
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    const marketingCheckbox = document.getElementById('cookie-marketing');

    const preferences = {
        necessary: true,
        analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
        marketing: marketingCheckbox ? marketingCheckbox.checked : false
    };

    saveCookiePreferences(preferences);
    hideCookieBanner();
    closeCookieSettings();
    applyCookiePreferences(preferences);
}

function saveCookiePreferences(preferences) {
    try {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        console.log('✅ Préférences cookies sauvegardées:', preferences);
    } catch (error) {
        console.error('❌ Erreur sauvegarde localStorage:', error);
        // Fallback: utiliser un cookie si localStorage ne marche pas
        document.cookie = `cookieConsent=${JSON.stringify(preferences)}; max-age=31536000; path=/; SameSite=Strict`;
        console.log('✅ Fallback: préférences sauvegardées en cookie');
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('visible');
    }
}

function applyCookiePreferences(preferences) {
    // Apply analytics cookies (Google Analytics, etc.)
    if (preferences.analytics) {
        // Uncomment when Google Analytics is set up:
        // loadGoogleAnalytics();
    }

    // Apply marketing cookies
    if (preferences.marketing) {
        // Uncomment when marketing scripts are needed:
        // loadMarketingScripts();
    }
}

// Initialize cookie banner
document.addEventListener('DOMContentLoaded', () => {
    initCookieBanner();
});

// Add event listener for cookies settings link in footer
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const cookiesSettingsLink = document.getElementById('cookies-settings-link');
        if (cookiesSettingsLink) {
            cookiesSettingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                openCookieSettings();
            });
        }
    }, 500); // Wait for footer to load
});

// ================================
// Lottie Animations
// ================================
function initLottieAnimations() {
    console.log('🎬 Initializing Lottie animations...');
    const lottieHypnose = document.getElementById('lottie-hypnose');

    console.log('🔍 lottie-hypnose element:', lottieHypnose);
    console.log('🔍 lottie library loaded:', typeof lottie !== 'undefined');

    if (lottieHypnose && typeof lottie !== 'undefined') {
        console.log('✅ Loading lotus animation...');
        const animation = lottie.loadAnimation({
            container: lottieHypnose,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/animations/lotus.json'
        });

        animation.addEventListener('DOMLoaded', () => {
            console.log('✅ Lotus animation loaded successfully');
        });

        animation.addEventListener('data_failed', () => {
            console.error('❌ Failed to load lotus.json');
        });
    } else {
        if (!lottieHypnose) console.error('❌ Element #lottie-hypnose not found');
        if (typeof lottie === 'undefined') console.error('❌ Lottie library not loaded');
    }
}

// Initialize Lottie animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the page to fully load
    setTimeout(() => {
        initLottieAnimations();
    }, 500);
});