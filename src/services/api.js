const API_BASE_URL = 'http://back.transvo.online:8082'

// Функция для получения токена из localStorage
const getAuthToken = () => localStorage.getItem('token')

// Базовая функция для выполнения запросов с аутентификацией
const fetchWithAuth = async (endpoint, options = {}) => {
	const token = getAuthToken()

	if (!token) {
		throw new Error('Токен авторизации отсутствует')
	}

	const headers = {
		Authorization: `Bearer ${token}`,
		...options.headers,
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || `Ошибка запроса: ${response.status}`)
	}

	return response.json()
}

// Получение списка настроек
export const getSettings = async () => {
	const token = localStorage.getItem('token')
	const response = await fetch(`${API_BASE_URL}/users/settings`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || 'Ошибка при получении настроек')
	}

	return data.data || []
}

// Создание новой настройки
export const createSetting = async settingData => {
	return fetchWithAuth('/users/settings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(settingData),
	})
}

// Обновление настройки
export const updateSetting = async (settingId, settingData) => {
	return fetchWithAuth(`/users/settings/${settingId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(settingData),
	})
}

// Удаление настройки
export const deleteSetting = async settingId => {
	return fetchWithAuth(`/users/settings/${settingId}`, {
		method: 'DELETE',
	})
}

export const getAiData = async videoId => {
	const token = localStorage.getItem('token')

	if (!token) throw new Error('Нет токена авторизации')

	const response = await fetch(
		`http://back.transvo.online:8082/api-ai?id=${videoId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || 'Не удалось получить AI информацию')
	}

	return data.data
}
