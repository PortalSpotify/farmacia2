// Configuração do WhatsApp
const whatsappNumber = "5511951966608";

// Função otimizada para abrir WhatsApp com tracking
function openWhatsApp(message = "Olá! Gostaria de solicitar um orçamento.") {
    // Analytics tracking (se disponível)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': message.substring(0, 50)
        });
    }
    
    // Feedback visual
    const clickedElement = event?.target;
    if (clickedElement) {
        clickedElement.classList.add('loading');
        setTimeout(() => {
            clickedElement.classList.remove('loading');
        }, 1000);
    }
    
    // Vibração em dispositivos móveis
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Função para rolar até a seção de produtos
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Sistema de Pop-up Inteligente
class SmartPopup {
    constructor() {
        this.popup = document.getElementById('popupOverlay');
        this.hasShown = sessionStorage.getItem('popupShown') === 'true';
        this.scrollThreshold = 50; // Porcentagem da página
        this.timeThreshold = 30000; // 30 segundos
        this.exitIntentEnabled = true;
        
        this.init();
    }
    
    init() {
        if (this.hasShown) return;
        
        // Trigger por tempo
        setTimeout(() => {
            if (!this.hasShown) {
                this.show();
            }
        }, this.timeThreshold);
        
        // Trigger por scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Trigger por exit intent (desktop)
        if (!this.isMobile()) {
            document.addEventListener('mouseleave', this.handleExitIntent.bind(this));
        }
    }
    
    handleScroll() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > this.scrollThreshold && !this.hasShown) {
            this.show();
        }
    }
    
    handleExitIntent(e) {
        if (e.clientY <= 0 && !this.hasShown) {
            this.show();
        }
    }
    
    show() {
        if (this.hasShown) return;
        
        this.popup.classList.add('show');
        this.hasShown = true;
        sessionStorage.setItem('popupShown', 'true');
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_shown', {
                'event_category': 'engagement'
            });
        }
    }
    
    hide() {
        this.popup.classList.remove('show');
    }
    
    isMobile() {
        return window.innerWidth <= 768;
    }
}

// Função para fechar popup
function closePopup() {
    const popup = document.getElementById('popupOverlay');
    popup.classList.remove('show');
}

// Animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatedElements = document.querySelectorAll(
        '.feature-card, .product-card, .contact-card, .hero-content, .cta-content'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Efeitos de hover aprimorados
function setupHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .product-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Efeito de ripple para mobile
        card.addEventListener('touchstart', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.touches[0].clientX - rect.left - size / 2;
            const y = e.touches[0].clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Header scroll effect aprimorado
function setupHeaderEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
        }
        
        // Auto-hide header on scroll down (mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// Otimizações de performance
function setupPerformanceOptimizations() {
    // Lazy loading para imagens
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload de recursos críticos
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    const linkPreload = document.createElement('link');
    linkPreload.rel = 'prefetch';
    linkPreload.href = whatsappLink;
    document.head.appendChild(linkPreload);
    
    // Service Worker para cache (se necessário)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Implementar service worker se necessário
        });
    }
}

// Detecção de dispositivo e otimizações mobile
function setupMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;
    
    if (isMobile) {
        // Ajustar tamanho de fonte base
        document.documentElement.style.fontSize = '14px';
        
        // Otimizar animações para mobile
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-tap-highlight-color: transparent;
            }
            
            .feature-card, .product-card, .contact-card {
                transition: transform 0.2s ease !important;
            }
            
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Adicionar classe para dispositivos touch
    if (isTouch) {
        document.body.classList.add('touch-device');
    }
}

// Sistema de Analytics aprimorado
function setupAnalytics() {
    // Tracking de eventos importantes
    const trackEvent = (action, category = 'engagement', label = '') => {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Console log para debug
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    };
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent(`scroll_${maxScroll}`, 'scroll_depth');
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', 'engagement', `${timeSpent}s`);
    });
}

// Função para adicionar CSS de animações
function addAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn-loading {
            position: relative;
            overflow: hidden;
        }
        
        .btn-loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: loading-shimmer 1.5s infinite;
        }
        
        @keyframes loading-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .pulse-animation {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('FarmáciaSaúde - Site otimizado carregado!');
    
    // Inicializar todas as funcionalidades
    setupScrollAnimations();
    setupHoverEffects();
    setupHeaderEffect();
    setupMobileOptimizations();
    setupPerformanceOptimizations();
    setupAnalytics();
    addAnimationCSS();
    
    // Inicializar popup inteligente
    new SmartPopup();
    
    // Adicionar event listeners para o popup
    document.addEventListener('click', (e) => {
        if (e.target.id === 'popupOverlay') {
            closePopup();
        }
    });
    
    // Escape key para fechar popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
    
    // Adicionar classes de animação aos elementos principais
    setTimeout(() => {
        const mainElements = document.querySelectorAll('.hero-content, .features h3, .products h3, .contact h3');
        mainElements.forEach(element => {
            element.classList.add('fade-in-up');
        });
    }, 100);
});

// Otimização de performance na inicialização
window.addEventListener('load', function() {
    // Remover loading states
    document.body.classList.remove('loading');
    
    // Inicializar recursos não críticos
    setTimeout(() => {
        // Preload de recursos adicionais se necessário
    }, 2000);
});

// Tratamento de erros
window.addEventListener('error', function(e) {
    console.error('Erro no site:', e.error);
    
    // Tracking de erros (se analytics disponível)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error?.message || 'Unknown error',
            'fatal': false
        });
    }
});

// Exportar funções para uso global
window.FarmaciaUtils = {
    openWhatsApp,
    scrollToProducts,
    closePopup,
    isMobile: () => window.innerWidth <= 768
};

// PWA Support (básico)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Implementar service worker se necessário para PWA
    });
}

