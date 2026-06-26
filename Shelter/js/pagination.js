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

const generateAllCards = (pets) => {
    const result = [];
    const countPerPet = 6;
    const counts = {};
    pets.forEach(p => counts[p.name] = 0);

    const roundRobin = [];
    let idx = 0;
    while (roundRobin.length < 48) {
        const pet = pets[idx % pets.length];
        if (counts[pet.name] < countPerPet) {
            roundRobin.push(pet.name);
            counts[pet.name]++;
        }
        idx++;
    }

    const seed = Date.now();
    const seededRandom = (i) => {
        const x = Math.sin(seed + i * 9301 + 49297) * 49297;
        return x - Math.floor(x);
    };

    for (let i = roundRobin.length - 1; i > 0; i--) {
        let j = Math.floor(seededRandom(i) * (i + 1));
        
        const violates = () => {
            const newI = roundRobin[j];
            const newJ = roundRobin[i];
            if (i > 0 && newI === roundRobin[i - 1]) return true;
            if (i < roundRobin.length - 1 && newI === roundRobin[i + 1]) return true;
            if (j > 0 && newJ === roundRobin[j - 1]) return true;
            if (j < roundRobin.length - 1 && newJ === roundRobin[j + 1]) return true;
            return false;
        };
        
        let attempts = 0;
        while (violates() && attempts < 100) {
            j = Math.floor(seededRandom(i + attempts) * (i + 1));
            attempts++;
        }
        
        [roundRobin[i], roundRobin[j]] = [roundRobin[j], roundRobin[i]];
    }

    const petMap = {};
    pets.forEach(p => petMap[p.name] = p);

    roundRobin.forEach((name, i) => {
        result.push({ ...petMap[name], uniqueId: i });
    });

    return result;
};

});