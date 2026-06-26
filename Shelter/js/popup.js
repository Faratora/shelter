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

    function openPopup(pet) {
        const img = popup.querySelector('.pets-popup__img');
        const nameEl = popup.querySelector('.pets-popup__name');
        const detailsEl = popup.querySelector('.pets-popup__details');
        const descEl = popup.querySelector('.pets-popup__description');
        const values = popup.querySelectorAll('.pets-popup__value');
        
        if (img) {
            img.src = pet.img || './assets/images/pets-default.webp';
            img.alt = pet.name || 'Pet';
        }
        
        if (nameEl) {
            nameEl.textContent = pet.name || 'Unknown';
        }
        
        if (detailsEl) {
            const type = pet.type ? pet.type.charAt(0).toUpperCase() + pet.type.slice(1) : '';
            const breed = pet.breed || '';
            detailsEl.textContent = type && breed ? `${type} - ${breed}` : type || breed || 'Unknown breed';
        }
        
        if (descEl) {
            descEl.textContent = pet.description || 'No description available.';
        }
        
        if (values && values.length >= 4) {
            values[0].textContent = pet.age || 'Not specified';
            values[1].textContent = Array.isArray(pet.inoculations) 
                ? pet.inoculations.join(', ') 
                : pet.inoculations || 'Not specified';
            values[2].textContent = Array.isArray(pet.diseases) 
                ? pet.diseases.join(', ') 
                : pet.diseases || 'None';
            values[3].textContent = Array.isArray(pet.parasites) 
                ? pet.parasites.join(', ') 
                : pet.parasites || 'None';
        }
        
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
    }


});
