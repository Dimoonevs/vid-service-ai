const AI_BASE_URL = 'http://back.transvo.online:8082'

// Получение токена из localStorage
const getAuthToken = () => localStorage.getItem('token')

export const createSubtitles = async (videoId, langs, settingId) => {
	const token = getAuthToken()
	if (!token) throw new Error('Нет токена')

	const res = await fetch(`${AI_BASE_URL}/api-ai/transcription`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: videoId, langs, setting_id: settingId }),
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message || 'Ошибка создания субтитров')
	return data.data
}

export const embedSubtitles = async videoId => {
	const token = getAuthToken()
	if (!token) throw new Error('Нет токена')

	const res = await fetch(
		`${AI_BASE_URL}/api-ai/stitching/subtitles?id=${videoId}`,
		{
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
		}
	)
	if (!res.ok) throw new Error((await res.json())?.message || 'Ошибка вшивания')
	return true
}

export const getSummary = async (videoId, settingId) => {
	const token = getAuthToken()
	if (!token) throw new Error('Нет токена')

	const res = await fetch(`${AI_BASE_URL}/api-ai/summary`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id: videoId,
			langs: ['RUS'],
			setting_id: settingId,
		}),
	})
	if (!res.ok) throw new Error((await res.json())?.message || 'Ошибка саммари')
	return true
}
