const rows = document.querySelectorAll('.row');
let currentIndex = 0;
let accumulatedDelta = 0;
const threshold = 400;

// Обновление видимости секций
function updateRows(index) {
    rows.forEach((row, i) => {
        row.classList.toggle('active', i === index);
    });
}

// Обработка прокрутки
window.addEventListener('wheel', (event) => {
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
});

// Инициализация первой секции
updateRows(currentIndex);
