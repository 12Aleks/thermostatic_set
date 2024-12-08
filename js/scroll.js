import {moveModelToPosition, controlAnimation} from './model.js';

let currentIndex = 0;
let accumulatedDelta = 0;
const rows = document.querySelectorAll('.row');
const threshold = 400;

export function setupScrollHandler() {
    const scrollContainer = document.querySelector('.container_scroll');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        accumulatedDelta += event.deltaY;

        if (accumulatedDelta > threshold && currentIndex < rows.length - 1) {
            currentIndex++;
            updateRows(currentIndex);
            accumulatedDelta = 0;
        } else if (accumulatedDelta < -threshold && currentIndex > 0) {
            currentIndex--;
            updateRows(currentIndex);
            accumulatedDelta = 0;
        }

        updateModelPosition(currentIndex);

        if (currentIndex === rows.length - 1) {
            scrollContainer.style.display = 'none';
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollContainer.style.display = 'flex';
            scrollToTopBtn.classList.remove('visible');
        }
    }, { passive: false });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        currentIndex = 0;
        updateRows(currentIndex);
        scrollContainer.style.display = 'flex';
        scrollToTopBtn.classList.remove('visible');
    });

    updateRows(currentIndex);
}

function updateRows(index) {
    rows.forEach((row, i) => {
        row.classList.toggle('active', i === index);
    });
}

function updateModelPosition(index) {
    const sectionId = rows[index].id;
    moveModelToPosition(sectionId);
    controlAnimation(sectionId);
}
