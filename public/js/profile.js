document.getElementById('logout').addEventListener('click', function() {

    fetch('/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/check_login')
            .then(response => response.text())
            .then(data => {
                if (data === '0') {
                    window.location.href = '/login';
                }else{
                    fetch('/get_userInfo')
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        document.getElementById('name-field').innerHTML = data.username
                        document.getElementById('mail-field').innerHTML = data.email
                    })
                    .catch((error) => {
                        console.error('Error getting the response:', error);
                    });
                }
            })
            .catch((error) => {
                console.error('Error getting the response:', error);
            });
    });


document.getElementById('generateButton').addEventListener('click', function() {
    let username = document.getElementById('username').value
    let email =document.getElementById('email').value
    let password = document.getElementById('password').value
    
    if (!isValidEmail(email) || email.length == 0) {
        alert("Please enter a valid email address.");
        return;
    }
    
    fetch('/update_userInfo', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email:    email   ,
            password: password,   
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        window.location.href = '/profile';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        return emailRegex.test(String(email).toLowerCase());
    }

})