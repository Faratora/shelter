import { pets } from './pets.js';

// Используем класс из HTML
const SLIDER = document.querySelector('.slider-item');
const BTN_LEFT = document.querySelector('.btn--circle-prev');
const BTN_RIGHT = document.querySelector('.btn--circle-next');

let cardsArr = [];
let currentPosition = 0;
let isTransitioning = false;

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width >= 1280) return 3;
    if (width >= 768) return 2;
    return 1;
}

function createCard(position = "beforeend") {
    let index = getRandomInteger(0, pets.length - 1);
    
    let attempts = 0;
    while (cardsArr.includes(index) && attempts < 50) {
        index = getRandomInteger(0, pets.length - 1);
        attempts++;
    }
    
    cardsArr.push(index);
    
    const card = document.createElement('div');
    card.className = 'slider-item__content'; // Новый класс для карточки
    card.setAttribute('data-index', index);
    card.innerHTML = `
        <img class="slider-item__img" src="${pets[index].img}" alt="${pets[index].type} ${pets[index].name}">
        <div class="card-info">
            <p class="pets-card__name">${pets[index].name}</p>
            <button class="btn btn--secondary" onclick="window.openModal(${index})">Learn more</button>
        </div>
    `;
    
    if (position === "afterbegin") {
        SLIDER.insertBefore(card, SLIDER.firstChild);
    } else {
        SLIDER.appendChild(card);
    }
}

function updateSlider(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const visibleCount = getVisibleCardsCount();
    const cardWidth = 270;
    const gap = window.innerWidth >= 1280 ? 90 : window.innerWidth >= 768 ? 20 : 15;
    const totalWidth = (cardWidth + gap) * visibleCount;
    
    if (direction === 'right') {
        currentPosition -= totalWidth;
        SLIDER.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        SLIDER.style.transform = `translateX(${currentPosition}px)`;
        
        setTimeout(() => {
            for (let i = 0; i < visibleCount; i++) {
                if (SLIDER.firstChild) {
                    const removed = SLIDER.firstChild;
                    const index = parseInt(removed.dataset.index);
                    cardsArr = cardsArr.filter(id => id !== index);
                    removed.remove();
                }
            }
            
            for (let i = 0; i < visibleCount; i++) {
                createCard("beforeend");
            }
            
            currentPosition = 0;
            SLIDER.style.transition = 'none';
            SLIDER.style.transform = `translateX(0)`;
            setTimeout(() => {
                SLIDER.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                isTransitioning = false;
            }, 50);
        }, 600);
    } else if (direction === 'left') {
        if (currentPosition >= 0) {
            for (let i = 0; i < visibleCount; i++) {
                createCard("afterbegin");
            }
            
            currentPosition += totalWidth;
            SLIDER.style.transition = 'none';
            SLIDER.style.transform = `translateX(${currentPosition}px)`;
            setTimeout(() => {
                SLIDER.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                SLIDER.style.transform = `translateX(0)`;
            }, 50);
            
            setTimeout(() => {
                for (let i = 0; i < visibleCount; i++) {
                    if (SLIDER.lastChild) {
                        const removed = SLIDER.lastChild;
                        const index = parseInt(removed.dataset.index);
                        cardsArr = cardsArr.filter(id => id !== index);
                        removed.remove();
                    }
                }
                currentPosition = 0;
                isTransitioning = false;
            }, 600);
            return;
        }
        
        currentPosition += totalWidth;
        SLIDER.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        SLIDER.style.transform = `translateX(${currentPosition}px)`;
        
        setTimeout(() => {
            for (let i = 0; i < visibleCount; i++) {
                if (SLIDER.lastChild) {
                    const removed = SLIDER.lastChild;
                    const index = parseInt(removed.dataset.index);
                    cardsArr = cardsArr.filter(id => id !== index);
                    removed.remove();
                }
            }
            
            for (let i = 0; i < visibleCount; i++) {
                createCard("afterbegin");
            }
            
            currentPosition = 0;
            SLIDER.style.transition = 'none';
            SLIDER.style.transform = `translateX(0)`;
            setTimeout(() => {
                SLIDER.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                isTransitioning = false;
            }, 50);
        }, 600);
    }
}

BTN_RIGHT.addEventListener('click', () => updateSlider('right'));
BTN_LEFT.addEventListener('click', () => updateSlider('left'));

document.addEventListener("DOMContentLoaded", () => {
    SLIDER.innerHTML = '';
    cardsArr = [];
    currentPosition = 0;
    SLIDER.style.transform = 'translateX(0)';
    
    const visibleCount = getVisibleCardsCount();
    for (let i = 0; i < visibleCount * 2; i++) {
        createCard("beforeend");
    }
    
    setTimeout(() => {
        SLIDER.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 100);
});

window.openModal = function(index) {
    const popup = document.getElementById('petsPopup');
    if (!popup) return;
    
    const pet = pets[index];
    if (!pet) return;
    
    document.querySelector('.pets-popup__img').src = pet.img;
    document.querySelector('.pets-popup__name').textContent = pet.name;
    document.querySelector('.pets-popup__details').textContent = `${pet.type} - ${pet.breed || ''}`;
    document.querySelector('.pets-popup__description').textContent = pet.description || '';
    
    const values = document.querySelectorAll('.pets-popup__value');
    if (values.length >= 4) {
        values[0].textContent = pet.age || '';
        values[1].textContent = pet.inoculations || '';
        values[2].textContent = pet.diseases || '';
        values[3].textContent = pet.parasites || '';
    }
    
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

document.addEventListener('click', (e) => {
    const popup = document.getElementById('petsPopup');
    if (!popup) return;
    
    if (e.target.closest('.pets-popup__close') || e.target.closest('.pets-popup__overlay')) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }
});