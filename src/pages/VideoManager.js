import React, { useState, useEffect } from 'react'
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Alert,
	Card,
	Spinner,
	Table,
} from 'react-bootstrap'
import VideoRow from '../components/VideoRow'
import {
	getVideos,
	uploadVideo,
	deleteVideo,
	createSubtitles,
	embedSubtitles,
} from '../services/video'
import { getSettings } from '../services/api'

const VideoManager = () => {
	const [videos, setVideos] = useState([])
	const [settings, setSettings] = useState([])
	const [selectedSetting, setSelectedSetting] = useState(null)
	const [file, setFile] = useState(null)
	const [loading, setLoading] = useState(true)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [processing, setProcessing] = useState({})
	const [isStream] = useState(false)

	useEffect(() => {
		fetchSettings()
		fetchVideos()
	}, [])

	const fetchSettings = async () => {
		try {
			const data = await getSettings()
			setSettings(data)
			if (data.length > 0 && !selectedSetting) {
				setSelectedSetting(data[0].id)
			}
		} catch (err) {
			setError('Не удалось загрузить настройки')
			console.error(err)
		}
	}

	const fetchVideos = async () => {
		try {
			setLoading(true)
			const data = await getVideos()
			setVideos(data)
		} catch (err) {
			setError('Не удалось загрузить список видео')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleSettingChange = e => {
		setSelectedSetting(e.target.value)
	}

	const handleFileChange = e => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const handleUpload = async e => {
		e.preventDefault()

		if (!file) {
			setError('Пожалуйста, выберите файл')
			return
		}

		try {
			setError('')
			setSuccess('')
			setUploading(true)

			await uploadVideo(file, isStream)
			setFile(null)
			// Очистка инпута файла
			document.getElementById('video-upload').value = ''
			setSuccess('Видео успешно загружено')

			// Обновляем список видео
			fetchVideos()
		} catch (err) {
			setError('Ошибка при загрузке видео')
			console.error(err)
		} finally {
			setUploading(false)
		}
	}

	const handleDeleteVideo = async videoId => {
		if (window.confirm('Вы уверены, что хотите удалить это видео?')) {
			try {
				setError('')
				setSuccess('')
				await deleteVideo(videoId)
				setSuccess('Видео успешно удалено')
				setVideos(videos.filter(v => v.id !== videoId))
			} catch (err) {
				setError('Ошибка при удалении видео')
				console.error(err)
			}
		}
	}

	return (
		<Container>
			<h1 className='mb-4'>Управление видео</h1>

			{error && (
				<Alert variant='danger' onClose={() => setError('')} dismissible>
					{error}
				</Alert>
			)}
			{success && (
				<Alert variant='success' onClose={() => setSuccess('')} dismissible>
					{success}
				</Alert>
			)}

			<Card className='mb-3'>
				<Card.Body>
					<Form onSubmit={handleUpload}>
						<Row className='align-items-end justify-content-between'>
							<Col md={4}>
								<Form.Group controlId='video-upload' className='mb-3 mb-md-0'>
									<Form.Label>Загрузить видео</Form.Label>
									<Form.Control
										type='file'
										accept='video/*'
										onChange={handleFileChange}
										required
									/>
								</Form.Group>
							</Col>

							<Col md={3}>
								<Button
									variant='primary'
									type='submit'
									className='w-100'
									disabled={uploading}
								>
									{uploading ? (
										<>
											<Spinner
												as='span'
												animation='border'
												size='sm'
												role='status'
												aria-hidden='true'
												className='me-2'
											/>
											Загрузка...
										</>
									) : (
										'Загрузить'
									)}
								</Button>
							</Col>
						</Row>
					</Form>
				</Card.Body>
			</Card>

			<h2 className='mb-3'>Ваши видео</h2>

			{loading ? (
				<div className='text-center py-5'>
					<Spinner animation='border' role='status'>
						<span className='visually-hidden'>Загрузка...</span>
					</Spinner>
				</div>
			) : videos.length === 0 ? (
				<div className='text-center py-5'>
					<p className='text-muted'>У вас пока нет загруженных видео</p>
				</div>
			) : (
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>Имя файла</th>
							<th>Ссылка</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
						{videos.map(video => (
							<VideoRow
								key={video.id}
								video={video}
								onDelete={handleDeleteVideo}
							/>
						))}
					</tbody>
				</Table>
			)}
		</Container>
	)
}

export default VideoManager
