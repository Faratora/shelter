document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-item');
    const paginationWrap = document.querySelector('.pets__pagination-wrap');
    if (!sliderContainer || !paginationWrap) return;

    let allPets = [];
    let allCards = [];
    let currentPage = 1;
    let totalPages = 6;
    let cardsPerView = 8;

    const getCardsPerView = () => {
    const width = window.innerWidth;
    if (width >= 1280) return 8;
    if (width >= 768) return 6;
    return 3;
};

const getTotalPages = () => {
    return 48 / cardsPerView;
};



});