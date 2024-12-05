const rows = document.querySelectorAll('.row');
let currentIndex = 0;
let accumulatedDelta = 0; // Накопитель для значения deltaY
const threshold = 400; // Порог для переключения блоков

// Функция обновления видимости
function updateRows(index) {
    rows.forEach((row, i) => {
        if (i === index) {
            row.classList.add('active');
        } else {
            row.classList.remove('active');
        }
    });
}

// Обработчик события прокрутки
window.addEventListener('wheel', (event) => {
    accumulatedDelta += event.deltaY; // Накопление прокрутки

    if (accumulatedDelta > threshold && currentIndex < rows.length - 1) {
        // Прокрутка вниз
        currentIndex++;
        updateRows(currentIndex);
        accumulatedDelta = 0; // Сброс накопленного значения
    } else if (accumulatedDelta < -threshold && currentIndex > 0) {
        // Прокрутка вверх
        currentIndex--;
        updateRows(currentIndex);
        accumulatedDelta = 0; // Сброс накопленного значения
    }
});

// Инициализация первого блока
updateRows(currentIndex);
