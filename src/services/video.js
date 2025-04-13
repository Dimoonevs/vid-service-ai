const API_BASE_URL = 'http://back.transvo.online:8082'

// Получение токена из localStorage
const getAuthToken = () => localStorage.getItem('token')

// Получение списка видео
export const getVideos = async () => {
	const token = getAuthToken()

	if (!token) {
		throw new Error('Токен авторизации отсутствует')
	}

	const response = await fetch(
		`${API_BASE_URL}/video-service/video?status=no_conv`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	let data = null
	try {
		data = await response.json()
	} catch (e) {
		throw new Error('Некорректный JSON от сервера')
	}

	if (!response.ok) {
		throw new Error(data?.message || 'Не удалось получить список видео')
	}

	// ✅ Гарантируем, что возвращаем массив
	if (!Array.isArray(data.data)) {
		console.warn('Сервер вернул не массив, заменяю на []')
		return []
	}

	return data.data
}

// Загрузка видео
export const uploadVideo = async (file, isStream = false) => {
	const token = getAuthToken()

	if (!token) {
		throw new Error('Токен авторизации отсутствует')
	}

	const formData = new FormData()
	formData.append('file', file)

	const response = await fetch(
		`${API_BASE_URL}/video-service/upload?is_stream=${isStream}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		}
	)

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || 'Ошибка при загрузке видео')
	}

	return response.json()
}

// Удаление видео
export const deleteVideo = async videoId => {
	const token = getAuthToken()

	if (!token) {
		throw new Error('Токен авторизации отсутствует')
	}

	const response = await fetch(
		`${API_BASE_URL}/video-service/video/delete?id=${videoId}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	if (!response.ok) {
		throw new Error('Не удалось удалить видео')
	}

	return true
}

export const getVideoById = async videoId => {
	const token = getAuthToken()
	if (!token) throw new Error('Токен авторизации отсутствует')

	const response = await fetch(
		`${API_BASE_URL}/video-service/video?id=${videoId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	const data = await response.json()
	if (!response.ok) {
		throw new Error(data.message || 'Не удалось получить видео по ID')
	}

	if (!Array.isArray(data.data) || data.data.length === 0) {
		throw new Error('Видео не найдено')
	}

	return data.data[0]
}
