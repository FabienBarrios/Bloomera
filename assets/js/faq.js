// ================================
// FAQ Accordion Functionality
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Get all FAQ question buttons
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other items in the same category (optional - remove to allow multiple open)
            // const category = faqItem.closest('.faq-category');
            // category.querySelectorAll('.faq-item').forEach(item => {
            //     item.classList.remove('active');
            // });

            // Toggle current item
            if (isActive) {
                faqItem.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            } else {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Add scroll animation for FAQ items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all FAQ items and categories
    const faqItems = document.querySelectorAll('.faq-item, .faq-category');
    faqItems.forEach(item => {
        item.classList.add('fade-in-element');
        observer.observe(item);
    });
});

// Smooth scroll for anchor links (if any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
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
