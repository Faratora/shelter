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
            
        }
    }

    window.petSlider = new PetSlider();
});
