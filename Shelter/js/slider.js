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
        { id: 7, name: 'Charly', img: './assets/images/pets-charly.webp' }
    ];
}
    }

    window.petSlider = new PetSlider();
});
