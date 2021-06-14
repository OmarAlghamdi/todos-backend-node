$('#signin').click(e => {

    fetch('https://localhost:3433/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: $('#email').val(),
            password: $('#password').val()
        })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        localStorage.setItem('jwt', res.data)
        window.location.href = './todos.html'
    })
})

$('#signup').click(e => {
    window.location.href = './signup.html'
})