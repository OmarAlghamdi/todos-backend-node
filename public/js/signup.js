$('#signup').click(e => {
    fetch('https://localhost:3433/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                name: $('#name').val(),
                email: $('#email').val(),
                password: $('#password').val()
            }
        })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        window.location.href = './signin.html'
    })
})

$('#signin').click(e => {
    window.location.href = './signin.html'
})