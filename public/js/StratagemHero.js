let currentArrows = []; // Массив для хранения текущего порядка стрелок
let arrows100 = [];
let timerId; // Идентификатор таймера
let timeLeft =15; // Оставшееся время в секундах
let correctAnswers = 0; // Счетчик правильных ответов
let resetTimerAndCounter = false; // Флаг для определения, нужно ли сбрасывать таймер и счетчик
const arrows = ['🢁', '🢃', '🢀', '🢂'];
const container = document.getElementById('arrowsContainer');
const start_button = document.getElementById('generateButton');
function gameover() {  
    document.getElementById('arrowsContainer').remove();
    document.getElementById('timerDisplay').remove();
    document.getElementById('game-div').innerHTML += '<div><a style="text-decoration: none" href="/StratagemHero"><button class="try-againButton" >Start again</button></a></div>'
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/check_login')
        .then(response => response.text())
        .then(data => {
            console.log(data)
            if (data === '0') {
                this.getElementById('profile').style.display = 'none';
            }else{
                this.getElementById('guest').style.display = 'none';
            }
        })
        .catch((error) => {
            console.error('Error getting the response:', error);
        })
    });

document.getElementById('generateButton').addEventListener('click', function() {
    resetTimerAndCounter = true; // Изменяем флаг на true при нажатии на кнопку
    generateArrows(); // Вызываем функцию для генерации стрелок
});
document.addEventListener('keydown', function(event) {
    // Prevent default action for arrow keys
    if (keyToArrow[event.key]) {
        event.preventDefault();
        
    const key = event.key; // Получаем нажатую клавишу
    const pressedArrow = keyToArrow[key];
    checkArrow(pressedArrow);
    }
});



function updateTimer() {
    timeLeft--;
    if (timeLeft <= 0) {
        clearInterval(timerId); // Останавливаем таймер, если время истекло
        gameover()
        fetch('/post-stratagemHero', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({score: correctAnswers}),
        })
    } else {
        // Обновляем отображение ������ремени в интерфейсе
        document.getElementById('timerDisplay').textContent = `Remaining time: ${timeLeft} seconds`;
    }
}
// Запускаем таймер при первом вызове generateArrows
function generateArrows() {
    container.innerHTML = ''; // Очищаем контейнер перед генерацией новых стрелок

    currentArrows = []; // Очищаем текущий массив стрелок
    // for (let i = 0; i < 100; i++) {
    //     const randomIndex = Math.floor(Math.random() * arrows.length);
    //     const arrow100 = arrows[randomIndex];
    //     currentArrows.push(arrow);
    // }
    
    for (let i = 0; i < Math.floor(Math.random() * (7 - 4 + 1) + 4); i++) {
        const randomIndex = Math.floor(Math.random() * arrows.length); // Генерируем случайный индекс
        const arrow = arrows[randomIndex]; // Выбираем стр��лку по случайному индексу 
        currentArrows.push(arrow); // Добавляем стрелку в текущий массив

        const arrowElement = document.createElement('span'); // Создаем элемент для отображения стрелки
        arrowElement.textContent = arrow; // Устанавлива��м текст элемента как стр��лку
        arrowElement.id = i;
        container.appendChild(arrowElement); // Добавляем элемент в контейнер


    }

    // Запускаем таймер только если он еще не запущен
    if (!timerId) {
        timerId = setInterval(updateTimer, 1000); // Запускаем таймер, который обновляется каждую секунду
    }
    if (resetTimerAndCounter) {
        // Останавливаем текущий таймер, если он существует
        if (timerId) {
            clearInterval(timerId);
        }

        // Сбрасываем счетчик правильных ответов
        correctAnswers = 0;
        // Обновляем отображение счетчика в интерфейсе
        document.getElementById('correctAnswersDisplay').textContent = `Correct answers: ${correctAnswers}`;

        // Сбрасываем время и запускаем новый таймер
        timeLeft = 20; // Установите время обратно на 60 секунд
        timerId = setInterval(updateTimer, 1000); // Запускаем новый таймер
        // Сбрасываем флаг, чтобы он не влиял на следующие вызовы generateArrows
        resetTimerAndCounter = false;
    }
    if(document.getElementById('destroy')){
    document.getElementById('destroy').remove();
    document.getElementById('generateButtonContainer').remove();
    }
}


// Соз��аем объект для соответствия между event.key и символами стрелок
const keyToArrow = {
    "ArrowUp": "🢁",
    "ArrowDown": "🢃",
    "ArrowLeft": "🢀",
    "ArrowRight": "🢂",
    'w': "🢁",
    's': "🢃",
    'a': "🢀",
    'd': "🢂",
    'W': "🢁",
    'S': "🢃",
    'A': "🢀",
    'D': "🢂"
};

function checkArrow(pressedArrow) {
    const index = document.getElementById('arrowsContainer').querySelectorAll('.green').length;

    const expectedArrow = currentArrows[index]; // Берем ожидаемую стрелку из массива
    console.log('pressedArrow:', pressedArrow);
    console.log('expectedArrow:', expectedArrow);
    const arrowElements = document.querySelectorAll('#arrowsContainer span');
        //const index = Array.from(arrowElements).findIndex(el => el.textContent === expectedArrow);

    if (pressedArrow === expectedArrow) {
        // Окрашиваем стрелку в зеленый цвет
        // const arrowElements = document.querySelectorAll('#arrowsContainer span');
        // //const index = Array.from(arrowElements).findIndex(el => el.textContent === expectedArrow);
        // const index = document.getElementById('arrowsContainer').querySelectorAll('.green').length;
        console.log(index);
        if (index !== -1) {
            arrowElements[index].className = 'green'; // Меняем цвет стрелки на зелёный
            
            //arrowElements[index].style.display = 'none';
            //arrowElements[index].remove();
        }
        if (currentArrows.length-1 == index) {
            correctAnswers++;
            document.getElementById('correctAnswersDisplay').textContent = `Correct answers: ${correctAnswers}`;
            timeLeft+=1;
            document.getElementById('timerDisplay').textContent = `Remaining time: ${timeLeft} seconds`
            generateArrows();
        }
    }
    else if(index > 0) {
        // clearInterval(timerId); // Останавливаем таймер
        // // Запускаем новый таймер
        // timeLeft = 60; // Сбрасываем время обратно на 60 секунд
        // timerId = setInterval(updateTimer, 1000); // Запускаем новый таймер
        // generateArrows(); // Генерируем новый список стрелок
        // correctAnswers = 0;// Сбрасываем счетчик правильных ответов при неправильном ответе
        // document.getElementById('correctAnswersDisplay').textContent = `Правильных ответов: ${correctAnswers}`;
        // // Останавливаем таймер и генерируем новый список стрелок
        arrowElements[index -1].className = '';
        
    }
    console.log(currentArrows.length-1 == index);
    // Если в массиве не осталось стрелок, генерируем новый список
}


