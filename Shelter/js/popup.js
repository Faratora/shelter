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

 let petsData = [];
    let petsLoaded = false;

    fetch('./pets.json')
        .then(r => r.json())
        .then(data => {
            petsData = data;
            petsLoaded = true;
        })
        .catch(() => {
            petsData = [
                { id: 0, name: 'Jennifer', img: './assets/images/pets-jennifer.webp' },
                { id: 1, name: 'Sophia', img: './assets/images/pets-sophie.webp' },
                { id: 2, name: 'Woody', img: './assets/images/pets-woody.webp' },
                { id: 3, name: 'Scarlet', img: './assets/images/pets-scarlet.webp' },
                { id: 4, name: 'Katrine', img: './assets/images/pets-katrine.webp' },
                { id: 5, name: 'Timmy', img: './assets/images/pets-timmy.webp' },
                { id: 6, name: 'Freddie', img: './assets/images/pets-freddie.webp' },
                { id: 7, name: 'Charly', img: './assets/images/pets-charly.webp' }
            ];
            petsLoaded = true;
        });



});
