// slider.js

document.addEventListener('DOMContentLoaded', function () {

    class PetSlider {
        constructor() {
            this.allPets = [];
            this.currentGroup = [];
            this.isAnimating = false;
            this.sliderContainer = document.querySelector('.slider-item');
            this.prevButton = document.querySelector('.btn--circle-prev');
            this.nextButton = document.querySelector('.btn--circle-next');
            this.cardsPerView = this.getCardsPerView();
            this.animationDuration = 500;

            this.init();
        }

        async init() {
            try {
                const response = await fetch('./pets.json');
                if (!response.ok) throw new Error('Network response was not ok');
                this.allPets = await response.json();
            } catch (error) {
                console.error('Error loading pets data:', error);
                this.loadDefaultPets();
            }

            this.currentGroup = this.getRandomGroup([], this.cardsPerView);
            this.renderCards(this.currentGroup);
            this.setupEventListeners();

           document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.isAnimating = false;
                }
            });
        }

        loadDefaultPets() {
            this.allPets = [
                { id: 0, name: 'Jennifer', img: './assets/images/pets-jennifer.webp' },
                { id: 1, name: 'Sophia', img: './assets/images/pets-sophie.webp' },
                { id: 2, name: 'Woody', img: './assets/images/pets-woody.webp' },
                { id: 3, name: 'Scarlet', img: './assets/images/pets-scarlet.webp' },
                { id: 4, name: 'Katrine', img: './assets/images/pets-katrine.webp' },
                { id: 5, name: 'Timmy', img: './assets/images/pets-timmy.webp' },
                { id: 6, name: 'Freddie', img: './assets/images/pets-freddie.webp' },
                { id: 7, name: 'Charly', img: './assets/images/pets-charly.webp' }
            ];
        }

        getCardsPerView() {
            const width = window.innerWidth;
            if (width >= 1280) return 3;
            if (width >= 768) return 2;
            return 1;
        }

        handleResize() {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;

                if (this.currentGroup.length !== this.cardsPerView) {
                    this.currentGroup = this.getRandomGroup([], this.cardsPerView);
                    this.renderCards(this.currentGroup);
                } else {
                    this.updateCardDimensions();
                }
            }
        }

        getRandomGroup(excludedPets, count) {
            const excludedIds = new Set(excludedPets.map(pet => pet.id));
            const availablePets = this.allPets.filter(pet => !excludedIds.has(pet.id));

            const shuffled = this.shuffleArray([...availablePets]);
            return shuffled.slice(0, count);
        }

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        renderCards(pets) {
            const fragment = document.createDocumentFragment();

            pets.forEach((pet, index) => {
                const card = document.createElement('article');
                card.className = 'slider-item__content';
                card.dataset.index = index;

                const safeName = this.escapeHtml(pet.name);
                const safeImg = this.escapeAttr(pet.img);

                card.innerHTML = `
                    <img class="slider-item__img" src="${safeImg}" alt="${safeName}'s photo" width="270" height="270" loading="lazy" decoding="async">
                    <div class="card-info">
                        <h2 class="pets-card__name">${safeName}</h2>
                        <button type="button" class="learn-more-btn" data-pet-id="${pet.id}" aria-label="Learn more about ${safeName}">
                            <span class="btn btn--secondary">Learn more</span>
                        </button>
                    </div>
                `;

                const learnMoreBtn = card.querySelector('.learn-more-btn');
                learnMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const petId = parseInt(e.currentTarget.dataset.petId, 10);
                    const pet = this.currentGroup.find(p => p.id === petId);
                    if (pet) {
                        window.petPopup?.open(pet);
                    }
                });

                fragment.appendChild(card);
            });

            this.sliderContainer.replaceChildren(fragment);

            setTimeout(() => this.updateCardDimensions(), 0);
        }

        escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        escapeAttr(str) {
            return this.escapeHtml(str);
        }

        updateCardDimensions() {
            const containerWidth = this.sliderContainer.parentElement.clientWidth;
            const gap = this.getGap();
            const totalGap = gap * (this.cardsPerView - 1);
            const cardWidth = (containerWidth - totalGap) / this.cardsPerView;

            const cards = this.sliderContainer.querySelectorAll('.slider-item__content');
            cards.forEach(card => {
                card.style.flex = `0 0 ${cardWidth}px`;
                card.style.width = `${cardWidth}px`;
            });

            this.sliderContainer.style.gap = `${gap}px`;
        }

        getGap() {
            const width = window.innerWidth;
            if (width >= 1280) return 40;
            if (width >= 768) return 30;
            return 20;
        }

        setupEventListeners() {
            if (!this.prevButton || !this.nextButton) return;

            this.prevButton.addEventListener('click', () => this.slide('prev'));
            this.nextButton.addEventListener('click', () => this.slide('next'));

            // Клик по карточке открывает попап
            if (this.sliderContainer) {
                this.sliderContainer.addEventListener('click', (e) => {
                    if (e.target.closest('.learn-more-btn')) return;

                    const card = e.target.closest('.slider-item__content');
                    if (!card) return;

                    const index = parseInt(card.dataset.index, 10);
                    const pet = this.currentGroup[index];
                    if (pet) {
                        window.petPopup?.open(pet);
                    }
                });
            }

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => this.handleResize(), 200);
            });
        }

        slide(direction) {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const nextGroup = this.getRandomGroup(this.currentGroup, this.cardsPerView);
            this.currentGroup = nextGroup;

            // Очищаем контейнер
            this.sliderContainer.replaceChildren();
            this.renderCards(nextGroup);

            const offset = direction === 'next' ? '100%' : '-100%';
            this.sliderContainer.style.transition = 'none';
            this.sliderContainer.style.transform = `translateX(${offset})`;

            void this.sliderContainer.offsetHeight;

            this.sliderContainer.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            this.sliderContainer.style.transform = 'translateX(0)';

            setTimeout(() => {
                this.sliderContainer.style.transition = '';
                this.sliderContainer.style.transform = '';
                this.updateCardDimensions();
                this.isAnimating = false;
            }, this.animationDuration);
        }
    }

    new PetSlider();
});
