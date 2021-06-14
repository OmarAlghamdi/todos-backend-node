
// const jwt = localStorage.getItem('jwt')
// if(!jwt)
// 	window.location.href = './signin.html'

$('#add').click(e => {3
	
	fetch('https://localhost:3433/api/todos', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			todo:{ name: $('#new-todo').val()}
		})
	})
	.then(res => res.json())
	.then(res => {
		console.log(res)
		$('#container').append(
			`<div id="${res.data.id}" class="d-md-flex justify-content-between align-items-center">

			<div class="input-group news-input justify-content-between">
				<h2>${res.data.name}</h2>
				<div>
					<button class="btn btn-warning btn-sm" type="button">Update</button>
					<button id="${res.data.id}" class="btn btn-danger btn-sm delete" type="button">Delete</button>
				</div>
			</div>
		</div>`
		)
	
		$('.delete').click(e => {
			const id = e.target.id
			console.log(id)

			fetch(`https://localhost:3433/api/todos/${id}`, {
				method: 'DELETE',
				headers: {
					authorization: 'Bearer ' + localStorage.getItem('jwt')
				}
			})
			.then(res => res.json())
			.then(res => {
				console.log(res)

				$(`#${id}`).remove()
			})
			.catch(err => console.error(err))
		})
	})
})

$(document).ready(() => {
	fetch('https://localhost:3433/api/todos', {
		method: 'GET',
		headers: {
			authorization: 'Bearer ' + localStorage.getItem('jwt')
		}
	})
		.then(res => res.json())
		.then(res => {
			console.log(res)

			res.data.forEach(todo =>
				$('#container').append(
					`<div id="${todo.id}" class="d-md-flex justify-content-between align-items-center">

					<div class="input-group news-input justify-content-between">
						<h2>${todo.name}</h2>
						<div>
							<button class="btn btn-warning btn-sm" type="button">Update</button>
							<button id="${todo.id}" class="btn btn-danger btn-sm delete" type="button">Delete</button>
						</div>
					</div>
				</div>`
				)
			)

			$('.delete').click(e => {
				const id = e.target.id
				console.log(id)

				fetch(`https://localhost:3433/api/todos/${id}`, {
					method: 'DELETE',
					headers: {
						authorization: 'Bearer ' + localStorage.getItem('jwt')
					}
				})
				.then(res => res.json())
				.then(res => {
					console.log(res)

					$(`#${id}`).remove()
				})
				.catch(err => console.error(err))
			})
		})
		.catch(err => console.error(err))
})

$('#signout').click(e => {
	localStorage.removeItem('jwt')
	window.location.href = './signin.html'
})

// $(document).ready(() => {
// 	fetch('https://localhost:3433/api/todos', {
// 		method: 'GET',
// 		headers: {
// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 		}
// 	})
// 		.then(res => res.json())
// 		.then(res => {
// 			console.log(res)
// 			res.data.forEach(todo =>
// 				$('#todos').prepend(
// 					`<li id=${todo.id}>${todo.name} <button class="btn-delete" id="${todo.id}">Delete</button></li>`
// 				)
// 			)

// 			$('button.btn-delete').click(e => {
// 				const id = e.target.id
// 				console.log(id)
// 				fetch(`https://localhost:3433/api/todos/${id}`, {
// 					method: 'DELETE',
// 					headers: {
// 						Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 					}
// 				})
// 					.then(res => res.json())
// 					.then(res => {
// 						console.log(res)
// 						$(`#${id}`).remove()
// 					})
// 					.catch(err => console.error(err))
// 			})
// 		})
// 		.catch(err => console.error(err))
// })
