document.addEventListener('DOMContentLoaded', function() {
 
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
            
            setTimeout(() => {
                this.updateCardDimensions();
            }, 0);
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
            let availablePets = this.allPets.filter(pet => !excludedIds.has(pet.id));
            
            if (availablePets.length < count) {
                availablePets = this.allPets.filter(pet => !excludedIds.has(pet.id));
            }
            
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
 
                card.innerHTML = `
                    <img class="slider-item__img" src="${pet.img}" alt="${pet.name}'s photo">
                    <div class="card-info">
                        <h2 class="pets-card__name">${pet.name}</h2>
                        <a href="#" class="learn-more-btn" data-pet-id="${pet.id}">
                            <div class="btn btn--secondary">
                                <span>Learn more</span>
                            </div>
                        </a>
                    </div>
                `;
 
                // Добавляем отдельный обработчик для кнопки Learn more
                const learnMoreBtn = card.querySelector('.learn-more-btn');
                learnMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const petId = parseInt(e.currentTarget.dataset.petId);
                    const pet = this.currentGroup.find(p => p.id === petId);
                    if (pet) {
                        // Здесь вызываем открытие попапа
                        console.log('Open popup for:', pet);
                        // Если у вас есть функция открытия попапа:
                        // this.openPetPopup(pet);
                        // Или если используете глобальный объект:
                        // window.petPopup?.open(pet);
                    }
                });
 
                fragment.appendChild(card);
            });
 
            this.sliderContainer.innerHTML = '';
            this.sliderContainer.appendChild(fragment);
 
            setTimeout(() => {
                this.updateCardDimensions();
            }, 0);
        }
 
        // Добавьте этот метод для открытия попапа (опционально)
        openPetPopup(pet) {
            // Ваша логика открытия попапа
            console.log('Opening popup for pet:', pet);
            // Пример:
            // const popup = document.createElement('div');
            // popup.className = 'pet-popup';
            // popup.innerHTML = `
            //     <div class="popup-content">
            //         <h2>${pet.name}</h2>
            //         <img src="${pet.img}" alt="${pet.name}">
            //         <button onclick="this.parentElement.parentElement.remove()">Close</button>
            //     </div>
            // `;
            // document.body.appendChild(popup);
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
 
            // Удаляем старый обработчик клика на контейнере, так как теперь у нас есть отдельный обработчик на кнопке
            // Оставляем его только для клика по карточке (не по кнопке)
            if (this.sliderContainer) {
                this.sliderContainer.addEventListener('click', (e) => {
                    // Проверяем, что клик был не по кнопке Learn more
                    if (e.target.closest('.learn-more-btn')) {
                        return; // Игнорируем, так как обработчик уже есть на кнопке
                    }
                    
                    const card = e.target.closest('.slider-item__content');
                    if (card) {
                        const pet = this.currentGroup[parseInt(card.dataset.index)];
                        if (pet) {
                            // Здесь можно открыть попап при клике на карточку (не на кнопку)
                            console.log('Card clicked:', pet);
                            // window.petPopup?.open(pet);
                        }
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
 
            const currentCards = this.sliderContainer.querySelectorAll('.slider-item__content');
            const nextGroup = this.getRandomGroup(this.currentGroup, this.cardsPerView);
 
            this.currentGroup = nextGroup;
            this.renderCards(nextGroup);
 
            const offset = direction === 'next' ? '100%' : '-100%';
            this.sliderContainer.style.transition = 'none';
            this.sliderContainer.style.transform = `translateX(${offset})`;
 
            void this.sliderContainer.offsetHeight;
            currentCards.forEach(card => card.remove());
 
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
 
    const slider = new PetSlider();
});
 
 
 
 
