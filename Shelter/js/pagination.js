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

const renderPage = (page) => {
    const start = (page - 1) * cardsPerView;
    const end = start + cardsPerView;
    const pageCards = allCards.slice(start, end);

    sliderContainer.innerHTML = '';
    pageCards.forEach((pet, index) => {
        const card = document.createElement('article');
        card.className = 'slider-item__content';
        card.dataset.petId = pet.id;
        card.innerHTML = `
            <img class="slider-item__img" src="${pet.img}" alt="${pet.name}'s photo">
            <div class="card-info">
                <p class="pets-card__name">${pet.name}</p>
                <a href="#" style="text-decoration: none">
                    <div class="btn btn--secondary">
                        <span>Learn more</span>
                    </div>
                </a>
            </div>
        `;
        sliderContainer.appendChild(card);
    });

    updatePagination(page);
    updateDimensions();
};

const updatePagination = (page) => {
    paginationWrap.innerHTML = '';

    const firstBtn = document.createElement('button');
    firstBtn.className = 'btn btn--circle';
    firstBtn.innerHTML = '&lt;&lt;';
    if (page === 1) {
        firstBtn.classList.add('btn--inactive');
        firstBtn.disabled = true;
    } else {
        firstBtn.addEventListener('click', () => goToPage(1));
    }
    paginationWrap.appendChild(firstBtn);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn--circle';
    prevBtn.innerHTML = '&lt;';
    if (page === 1) {
        prevBtn.classList.add('btn--inactive');
        prevBtn.disabled = true;
    } else {
        prevBtn.addEventListener('click', () => goToPage(page - 1));
    }
    paginationWrap.appendChild(prevBtn);

    const currentSpan = document.createElement('span');
    currentSpan.className = 'btn btn--circle btn--circle-num';
    currentSpan.textContent = page;
    paginationWrap.appendChild(currentSpan);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn--circle';
    nextBtn.innerHTML = '&gt;';
    if (page === totalPages) {
        nextBtn.classList.add('btn--inactive');
        nextBtn.disabled = true;
    } else {
        nextBtn.addEventListener('click', () => goToPage(page + 1));
    }
    paginationWrap.appendChild(nextBtn);

    const lastBtn = document.createElement('button');
    lastBtn.className = 'btn btn--circle';
    lastBtn.innerHTML = '&gt;&gt;';
    if (page === totalPages) {
        lastBtn.classList.add('btn--inactive');
        lastBtn.disabled = true;
    } else {
        lastBtn.addEventListener('click', () => goToPage(totalPages));
    }
    paginationWrap.appendChild(lastBtn);
};
const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
    animateTransition(() => renderPage(page));
};

const animateTransition = (callback) => {
    sliderContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    sliderContainer.style.transform = 'translateX(-20px)';
    sliderContainer.style.opacity = '0';

    setTimeout(() => {
        callback();
        sliderContainer.style.transition = 'none';
        sliderContainer.style.transform = 'translateX(20px)';
        // Force reflow
        sliderContainer.offsetHeight;
        sliderContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        sliderContainer.style.transform = 'translateX(0)';
        sliderContainer.style.opacity = '1';
    }, 300);
};

const updateDimensions = () => {
    const cards = sliderContainer.querySelectorAll('.slider-item__content');
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;

    if (isMobile) {
        cards.forEach(card => {
            card.style.flex = '0 0 calc(33.333% - 14px)';
            card.style.width = 'calc(33.333% - 14px)';
        });
        sliderContainer.style.gap = '20px';
    } else if (isTablet) {
        cards.forEach(card => {
            card.style.flex = '0 0 calc(50% - 15px)';
            card.style.width = 'calc(50% - 15px)';
        });
        sliderContainer.style.gap = '30px';
    } else {
        cards.forEach(card => {
            card.style.flex = '0 0 calc(33.333% - 27px)';
            card.style.width = 'calc(33.333% - 27px)';
        });
        sliderContainer.style.gap = '40px';
    }
};
const init = async () => {
    try {
        const response = await fetch('./pets.json');
        allPets = await response.json();
    } catch (e) {
        allPets = [
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

    cardsPerView = getCardsPerView();
    totalPages = getTotalPages();
    allCards = generateAllCards(allPets);
    renderPage(currentPage);

    window.addEventListener('resize', () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            totalPages = getTotalPages();
            currentPage = 1;
            renderPage(currentPage);
        } else {
            updateDimensions();
        }
    });
};

init();


});