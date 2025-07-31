document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px', // Animar un poco antes de que llegue al centro
        threshold: 0.1
    });

    // Aplicar a elementos individuales
    const elementsToAnimate = document.querySelectorAll('.scroll-animate');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Aplicar a contenedores para animar hijos en cascada
    const containersToAnimate = document.querySelectorAll('.scroll-animate-container');
    containersToAnimate.forEach(container => {
        const items = container.querySelectorAll('.scroll-animate-item');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 75}ms`; // Retraso más corto y rápido
            observer.observe(item);
        });
    });
});