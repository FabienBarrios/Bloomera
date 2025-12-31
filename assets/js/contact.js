// ========================================
// CONFIGURATION EMAILJS
// ========================================
// À REMPLACER avec vos vraies valeurs depuis https://dashboard.emailjs.com
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'DAp8CbSI_mpL7QKhT',      // Ex: 'abc123xyz'
    SERVICE_ID: 'service_site_web',      // Ex: 'service_abc123'
    TEMPLATE_ID: 'template_2mmclje'     // Ex: 'template_xyz789'
};

// Initialiser EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// ========================================
// REVEAL ANIMATION
// ========================================
function reveal() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);

// Trigger on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(reveal, 100);
});

// ========================================
// GESTION DU FORMULAIRE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        console.error('Formulaire de contact non trouvé');
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Désactiver le bouton et changer le texte
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.style.opacity = '0.7';

        // Récupérer la date et l'heure actuelles
        const now = new Date();
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const currentDate = now.toLocaleDateString('fr-FR', dateOptions);
        const currentTime = now.toLocaleTimeString('fr-FR', timeOptions);

        // Mapper le service pour un affichage plus joli
        const serviceMap = {
            'hypnose': 'Hypnose SAJECE',
            'coaching': 'Coaching Symbolique',
            'formation': 'Formation',
            'entreprise': 'Intervention en Entreprise',
            'autre': 'Autre demande'
        };

        // Préparer les paramètres pour EmailJS
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || 'Non renseigné',
            service: serviceMap[document.getElementById('service').value] || document.getElementById('service').value,
            message: document.getElementById('message').value,
            date: currentDate,
            time: currentTime
        };

        // Envoyer l'email via EmailJS
        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        )
        .then(function(response) {
            console.log('✅ Email envoyé avec succès!', response.status, response.text);

            // Message de succès
            submitBtn.textContent = '✓ Message envoyé !';
            submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

            // Afficher un message de confirmation
            showNotification('Merci pour votre message ! Je vous répondrai dans les 24-48 heures.', 'success');

            // Réinitialiser le formulaire après 2 secondes
            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
            }, 2000);

        }, function(error) {
            console.error('❌ Erreur lors de l\'envoi:', error);

            // Message d'erreur
            submitBtn.textContent = '✗ Erreur d\'envoi';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

            // Afficher un message d'erreur
            showNotification('Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.', 'error');

            // Réactiver le bouton après 3 secondes
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
            }, 3000);
        });
    });
});

// ========================================
// SYSTÈME DE NOTIFICATION
// ========================================
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Ajouter l'animation CSS si elle n'existe pas déjà
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Retirer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
