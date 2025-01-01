import { moveModelToPosition, controlAnimation } from './model.js';

let currentIndex = 0;
let accumulatedDelta = 0;
const rows = document.querySelectorAll('.row');
const threshold = 400;

let adapterEntered = false; // Flag for animation when entering the block
let adapterAnimating = false; // Flag to prevent exit before animation finishes

export function setupScrollHandler() {
    const scrollContainer = document.querySelector('.container_scroll');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    window.addEventListener(
        'wheel',
        async (event) => {
            event.preventDefault();
            if (adapterAnimating) return;
            accumulatedDelta += event.deltaY;

            if (accumulatedDelta > threshold && currentIndex < rows.length - 1) {
                currentIndex++;
                updateRows(currentIndex);
                accumulatedDelta = 0;
            } else if (accumulatedDelta < -threshold && currentIndex > 0) {
                if (rows[currentIndex].id === 'adapter') {
                    await triggerAdapterExitAnimation();
                } else {
                    currentIndex--;
                    updateRows(currentIndex);
                    accumulatedDelta = 0;
                }
            }

            updateModelPosition(currentIndex);

            if (currentIndex === rows.length - 1) {
                scrollContainer.style.opacity = '0';
                scrollToTopBtn?.classList.add('visible');
            } else {
                scrollContainer.style.display = 'flex';
                scrollContainer.style.opacity = '1';
                scrollToTopBtn?.classList.remove('visible');
            }
        },
        { passive: false }
    );

    scrollToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        currentIndex = 0;
        updateRows(currentIndex);
        scrollContainer.style.display = 'flex';
        scrollToTopBtn?.classList.remove('visible');
    });

    updateRows(currentIndex);
}

function updateRows(index) {
    rows.forEach((row, i) => {
        console.log(index, i, row)
        row.classList.toggle('active', i === index);
    });

    const menuItems = document.querySelectorAll('.navbar-nav .nav-item .nav-link');
    menuItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function updateModelPosition(index) {
    const sectionId = rows[index].id;


    if (sectionId === 'adapter') {
        if (!adapterEntered) {
            controlAnimation(sectionId, { part: 'enter', duration: 5500 });
            adapterEntered = true;
        }
    } else {
        adapterEntered = false;
    }

    moveModelToPosition(sectionId);
    if (sectionId !== 'adapter') {
        controlAnimation(sectionId);
    }
}

async function triggerAdapterExitAnimation() {
    adapterAnimating = true;

    await controlAnimation('adapter', { part: 'exit', duration: 5500 });

    adapterAnimating = false;
    currentIndex--;
    updateRows(currentIndex);
}
