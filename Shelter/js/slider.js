document.addEventListener('DOMContentLoaded', function () {
    class PetSlider {
        constructor() {
            this.allPets = [];
            this.cardsPerView = 3;
            this.currentIndex = 0;
            this.isAnimating = false;
            this.itemWidth = 0;

            this.slider = document.getElementById('slider');
            this.sliderPrev = document.getElementById('slider-prev');
            this.sliderCurrent = document.getElementById('slider-current');
            this.sliderNext = document.getElementById('slider-next');

            this.prevButton = document.querySelector('.btn--circle-prev');
            this.nextButton = document.querySelector('.btn--circle-next');

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

            this.itemWidth = this.sliderCurrent.offsetWidth;

            this.generateCardArrays();
            this.renderAllSliders();

            this.slider.style.transition = 'none';
            this.slider.style.transform = `translateX(-${this.itemWidth}px)`;

            this.setupEventListeners();
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
                { id: 7, name: 'Charly', img: './assets/images/pets-charly.webp' },
            ];
        }

        getCardsPerView() {
            const width = window.innerWidth;
            if (width >= 1280) return 3;
            if (width >= 768) return 2;
            return 1;
        }

        getWrappedIndex(i) {
            const len = this.allPets.length;
            return ((i % len) + len) % len;
        }

        generateCardArrays() {
            if (!this.allPets || this.allPets.length === 0) return;

            this.prevCardsArr = [];
            for (let i = 0; i < this.cardsPerView; i++) {
                this.prevCardsArr.push(this.getWrappedIndex(this.currentIndex - this.cardsPerView + i));
            }

            this.currentCardsArr = [];
            for (let i = 0; i < this.cardsPerView; i++) {
                this.currentCardsArr.push(this.getWrappedIndex(this.currentIndex + i));
            }

            this.nextCardsArr = [];
            for (let i = 0; i < this.cardsPerView; i++) {
                this.nextCardsArr.push(this.getWrappedIndex(this.currentIndex + this.cardsPerView + i));
            }
        }

        renderSlider(container, cardIndices) {
            container.innerHTML = '';
            container.className = 'slider-item';
            cardIndices.forEach((petIndex) => {
                const pet = this.allPets[petIndex];
                if (!pet) return;
                const card = document.createElement('article');
                card.className = 'slider-item__content';
                card.id = petIndex;
                card.innerHTML = `
            <img class="slider-item__img" src="${pet.img}" alt="${pet.name}'s photo">
            <div class="card-info">
                <h2 class="pets-card__name">${pet.name}</h2>
                <div class="btn btn--secondary" data-pet-id="${pet.id}">
                    <span>Learn more</span>
                </div>
            </div>
        `;
                container.appendChild(card);
            });
        }

        renderAllSliders() {
            this.renderSlider(this.sliderPrev, this.prevCardsArr);
            this.renderSlider(this.sliderCurrent, this.currentCardsArr);
            this.renderSlider(this.sliderNext, this.nextCardsArr);
        }

        setupEventListeners() {
            if (!this.prevButton || !this.nextButton) return;
            this.prevButton.addEventListener('click', () => this.slide('prev'));
            this.nextButton.addEventListener('click', () => this.slide('next'));
        

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;
                this.itemWidth = this.sliderCurrent.offsetWidth;
                this.generateCardArrays();
                this.renderAllSliders();
                this.slider.style.transition = 'none';
                this.slider.style.transform = `translateX(-${this.itemWidth}px)`;
            }
        }, 200);
    });

}


}

    window.petSlider = new PetSlider();
});
