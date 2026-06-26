document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('petsPopup');
    
    if (!popup) {
        console.error('Popup element #petsPopup not found!');
        return;
    }

    const closeBtn = popup.querySelector('.pets-popup__close');
    const overlay = popup.querySelector('.pets-popup__overlay');

    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closePopup);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });

    window.petPopup = {
        open: () => console.warn('petPopup.open not implemented yet'),
        close: closePopup
    };
});
