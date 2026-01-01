// ========================================
// CONFIGURATION EMAILJS
// ========================================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'DAp8CbSI_mpL7QKhT',
    SERVICE_ID: 'service_site_web',
    TEMPLATE_ID: 'template_2mmclje'
};

// ========================================
// CONFIGURATION SÉCURITÉ
// ========================================
const SECURITY_CONFIG = {
    // Temps minimum entre deux soumissions (en millisecondes)
    MIN_SUBMIT_INTERVAL: 60000, // 1 minute
    // Nombre maximum de soumissions par jour
    MAX_DAILY_SUBMISSIONS: 5,
    // Durée de validité du compteur quotidien (en millisecondes)
    DAILY_RESET_INTERVAL: 24 * 60 * 60 * 1000 // 24 heures
};

// Initialiser EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// ========================================
// FONCTIONS DE VALIDATION
// ========================================

/**
 * Valide une adresse email avec regex stricte
 */
function validateEmail(email) {
    // Regex stricte RFC 5322 simplifié
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valide un numéro de téléphone français
 */
function validatePhone(phone) {
    if (!phone) return true; // Champ optionnel

    // Nettoyer le numéro (enlever espaces, points, tirets)
    const cleanPhone = phone.replace(/[\s.\-]/g, '');

    // Regex pour numéros français :
    // - Format: 0X XX XX XX XX ou +33 X XX XX XX XX
    // - Accepte 06, 07 (mobiles), 01-05, 09 (fixes)
    const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:\d{8})$/;

    return phoneRegex.test(cleanPhone);
}

/**
 * Valide la longueur d'un texte
 */
function validateLength(text, minLength, maxLength) {
    const length = text.trim().length;
    return length >= minLength && length <= maxLength;
}

/**
 * Sanitize input pour prévenir XSS
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    // Créer un élément temporaire pour encoder les entités HTML
    const temp = document.createElement('div');
    temp.textContent = input;

    // Retourner le texte sanitizé
    return temp.innerHTML
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Détecte les contenus suspects (spam patterns)
 */
function detectSpam(text) {
    const spamPatterns = [
        /viagra/i,
        /cialis/i,
        /casino/i,
        /lottery/i,
        /\bcrypto\b/i,
        /bitcoin/i,
        /click here/i,
        /\bseo\b/i,
        /(http|https):\/\/.*\.(ru|cn|tk)/i, // Domaines suspects
        /\[url=/i,
        /\[link=/i,
        /<a href/i
    ];

    return spamPatterns.some(pattern => pattern.test(text));
}

// ========================================
// RATE LIMITING
// ========================================

/**
 * Vérifie si l'utilisateur peut soumettre le formulaire
 */
function canSubmitForm() {
    const now = Date.now();
    const lastSubmit = parseInt(localStorage.getItem('lastFormSubmit') || '0');
    const dailyCount = parseInt(localStorage.getItem('dailySubmitCount') || '0');
    const dailyResetTime = parseInt(localStorage.getItem('dailyResetTime') || '0');

    // Réinitialiser le compteur quotidien si 24h sont passées
    if (now > dailyResetTime) {
        localStorage.setItem('dailySubmitCount', '0');
        localStorage.setItem('dailyResetTime', (now + SECURITY_CONFIG.DAILY_RESET_INTERVAL).toString());
        return true;
    }

    // Vérifier le nombre de soumissions quotidiennes
    if (dailyCount >= SECURITY_CONFIG.MAX_DAILY_SUBMISSIONS) {
        return {
            allowed: false,
            reason: `Vous avez atteint le nombre maximum de ${SECURITY_CONFIG.MAX_DAILY_SUBMISSIONS} messages par jour. Veuillez réessayer demain ou me contacter directement.`
        };
    }

    // Vérifier l'intervalle minimum entre soumissions
    const timeSinceLastSubmit = now - lastSubmit;
    if (timeSinceLastSubmit < SECURITY_CONFIG.MIN_SUBMIT_INTERVAL) {
        const remainingSeconds = Math.ceil((SECURITY_CONFIG.MIN_SUBMIT_INTERVAL - timeSinceLastSubmit) / 1000);
        return {
            allowed: false,
            reason: `Veuillez attendre ${remainingSeconds} secondes avant de soumettre un nouveau message.`
        };
    }

    return { allowed: true };
}

/**
 * Enregistre une soumission de formulaire
 */
function recordFormSubmission() {
    const now = Date.now();
    const dailyCount = parseInt(localStorage.getItem('dailySubmitCount') || '0');
    const dailyResetTime = parseInt(localStorage.getItem('dailyResetTime') || '0');

    localStorage.setItem('lastFormSubmit', now.toString());
    localStorage.setItem('dailySubmitCount', (dailyCount + 1).toString());

    // Initialiser le temps de reset si nécessaire
    if (!dailyResetTime || now > dailyResetTime) {
        localStorage.setItem('dailyResetTime', (now + SECURITY_CONFIG.DAILY_RESET_INTERVAL).toString());
    }
}

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

        // ========================================
        // 1. VÉRIFICATION HONEYPOT
        // ========================================
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value !== '') {
            console.warn('Spam détecté via honeypot');
            // Ne pas montrer d'erreur pour ne pas alerter le bot
            // Simuler un succès
            showNotification('Message envoyé avec succès !', 'success');
            contactForm.reset();
            return;
        }

        // ========================================
        // 2. RATE LIMITING
        // ========================================
        const rateLimitCheck = canSubmitForm();
        if (rateLimitCheck.allowed === false) {
            showNotification(rateLimitCheck.reason, 'error');
            return;
        }

        // ========================================
        // 3. RÉCUPÉRATION ET SANITIZATION DES DONNÉES
        // ========================================
        const nameInput = document.getElementById('name').value.trim();
        const emailInput = document.getElementById('email').value.trim();
        const phoneInput = document.getElementById('phone').value.trim();
        const serviceInput = document.getElementById('service').value;
        const messageInput = document.getElementById('message').value.trim();

        // Sanitize inputs
        const name = sanitizeInput(nameInput);
        const email = sanitizeInput(emailInput);
        const phone = sanitizeInput(phoneInput);
        const message = sanitizeInput(messageInput);

        // ========================================
        // 4. VALIDATION DES CHAMPS
        // ========================================

        // Validation du nom
        if (!validateLength(name, 2, 100)) {
            showNotification('Le nom doit contenir entre 2 et 100 caractères.', 'error');
            document.getElementById('name').focus();
            return;
        }

        // Validation de l'email
        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            document.getElementById('email').focus();
            return;
        }

        // Validation du téléphone (si rempli)
        if (phone && !validatePhone(phone)) {
            showNotification('Le numéro de téléphone n\'est pas valide. Format attendu : 06 12 34 56 78 ou +33 6 12 34 56 78', 'error');
            document.getElementById('phone').focus();
            return;
        }

        // Validation du service
        if (!serviceInput) {
            showNotification('Veuillez sélectionner un service.', 'error');
            document.getElementById('service').focus();
            return;
        }

        // Validation du message
        if (!validateLength(message, 10, 2000)) {
            showNotification('Le message doit contenir entre 10 et 2000 caractères.', 'error');
            document.getElementById('message').focus();
            return;
        }

        // Détection de spam dans le message
        if (detectSpam(message) || detectSpam(name)) {
            console.warn('Contenu suspect détecté');
            showNotification('Votre message contient du contenu suspect. Veuillez reformuler.', 'error');
            return;
        }

        // ========================================
        // 5. ENVOI DU FORMULAIRE
        // ========================================

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

        // Préparer les paramètres pour EmailJS (avec données sanitizées)
        const templateParams = {
            from_name: name,
            from_email: email,
            phone: phone || 'Non renseigné',
            service: serviceMap[serviceInput] || serviceInput,
            message: message,
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

            // Enregistrer la soumission (rate limiting)
            recordFormSubmission();

            // Message de succès
            submitBtn.textContent = '✓ Message envoyé !';
            submitBtn.style.background = 'linear-gradient(135deg, #42604e, #639874)';

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
        background: ${type === 'success' ? 'linear-gradient(135deg, #42604e, #639874)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(66, 96, 78, 0.3);
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