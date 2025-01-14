document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const timerDisplay = document.getElementById('timerDisplay');
    let timerStarted = false;
    let timer = 0;
    let timerId;
    let characters = -1;
    // Append the cursor to the input text container
    fetch('/get-sentence', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        characters = data.sentence.trim().length;
        data.sentence.trim().split('').forEach(x => {
            const span = document.createElement('span');
            span.textContent = x;
            span.className = 'incomplete';
            inputText.appendChild(span);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })

    // inputText.addEventListener('input', updateCursorPosition);
    document.addEventListener('keydown', function(event) {
        if (document.activeElement !== inputText) {
            // If textarea_div is not focused, do nothing
            return;
        }
        const key = event.key;
        
        const isValidKey = 'abcdefghijklmnopqrstuvwxyz+-=0987654321.,!&?^%$#@*() '.includes(key.toLowerCase()) || key === 'Backspace';
        document.querySelectorAll('.destroy').forEach(x => x.remove());
        if (isValidKey) {
            event.preventDefault();
            if(!timerStarted) {
                timerDisplay.textContent = `${timer}`;
                timerStarted = true;    
                timerId = setInterval(updateTimer, 1000);
            }
            checkKey(key);
        }       

    });
    
    function checkKey(key) {
        
        const lastSpan = inputText.querySelector('.incomplete');
        const wrongSpan = inputText.querySelector('.wrong');
        if (!wrongSpan && key != 'Backspace') {
            if (lastSpan.textContent == key) {
                lastSpan.className = 'right';
                if (!inputText.querySelector('.incomplete')){
                    endGame();
                }
            }
            else {
                lastSpan.className = 'wrong';
            }
            return
        }else if (key == 'Backspace') {
            if (wrongSpan) {
                return (wrongSpan.className = 'incomplete');
            }else {
            const rights = inputText.querySelectorAll('.right'); 
            rights[rights.length-1].className = 'incomplete';
            return
            }
        }
        
    }


    function updateTimer() {
        timer++;
        timerDisplay.textContent = `${timer}`;
    }

    function endGame() {
        clearInterval(timerId);
        let score = ((characters/ timer)*12).toFixed(1);
        timerDisplay.textContent = (`Your WPM is: ${score}`);
        gameover(score)
        fetch('/post-typingGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({score: score})
        })
    }


    function gameover(score) {  
        document.getElementById('inputText').remove()
        document.getElementById('game-div').innerHTML += '<div><a style="text-decoration: none" href="/typing"><button class="try-againButton" >Start again</button></a></div>'
    }
});

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

