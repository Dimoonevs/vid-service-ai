const API_BASE_URL = 'http://back.transvo.online:8082/users'

// Функция логина
export const login = async (email, password) => {
	try {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		const data = await response.json()

		if (!response.ok) {
			return { error: data.message || 'Ошибка входа' }
		}

		return {
			token: data.data,
			user: email,
		}
	} catch (error) {
		return { error: 'Ошибка сервера' }
	}
}

// Функция регистрации
export const register = async (email, password) => {
	try {
		const response = await fetch(`${API_BASE_URL}/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		const data = await response.json()

		if (!response.ok) {
			return {
				success: false,
				error: data.message || 'Ошибка регистрации',
			}
		}

		return { success: true }
	} catch (error) {
		return {
			success: false,
			error: 'Ошибка сервера',
		}
	}
}

// Функция проверки кода подтверждения
export const verifyCode = async (email, code) => {
	try {
		const response = await fetch(`${API_BASE_URL}/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, code }),
		})

		const data = await response.json()

		if (!response.ok) {
			return { error: data.message || 'Неверный код подтверждения' }
		}

		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'Ошибка сервера' }
	}
}

export const checkAuth = async () => {
	const token = localStorage.getItem('token')

	const response = await fetch(`${API_BASE_URL}/check`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (!response.ok) {
		throw new Error('Unauthorized')
	}

	return response.json()
}

export const resendCode = async email => {
	try {
		const response = await fetch(`${API_BASE_URL}/code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		})

		const data = await response.json()

		if (!response.ok) {
			return { error: data.message || 'Не удалось отправить код' }
		}

		return { success: true }
	} catch (error) {
		return { error: 'Ошибка сервера' }
	}
}
