import React, { useState, useEffect } from 'react'
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Modal,
	Alert,
} from 'react-bootstrap'
import {
	getSettings,
	createSetting,
	updateSetting,
	deleteSetting,
} from '../services/api'

const Settings = () => {
	const [settings, setSettings] = useState([])
	const [selectedSetting, setSelectedSetting] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	// Form states
	const [showModal, setShowModal] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		ai_token: '',
		whisper_model: 'whisper-1',
		gpt_model: 'gpt-4-turbo',
		name: '',
	})

	// Load settings on component mount
	useEffect(() => {
		fetchSettings()
	}, [])

	const fetchSettings = async () => {
		try {
			setLoading(true)
			const data = await getSettings()
			setSettings(data)
			if (data.length > 0 && !selectedSetting) {
				setSelectedSetting(data[0])
			}
		} catch (err) {
			setError('Не удалось загрузить настройки')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleSelectSetting = setting => {
		setSelectedSetting(setting)
	}

	const handleCreateSetting = async () => {
		try {
			setError('')
			setSuccess('')
			const newSetting = await createSetting(formData)
			setSettings([...settings, newSetting])
			setSelectedSetting(newSetting)
			setShowModal(false)
			resetForm()
			setSuccess('Настройка успешно создана')
		} catch (err) {
			setError('Ошибка при создании настройки')
			console.error(err)
		}
	}

	const handleUpdateSetting = async () => {
		try {
			setError('')
			setSuccess('')
			const updatedSetting = await updateSetting(selectedSetting.id, formData)
			const updatedSettings = settings.map(s =>
				s.id === updatedSetting.id ? updatedSetting : s
			)
			setSettings(updatedSettings)
			setSelectedSetting(updatedSetting)
			setShowModal(false)
			resetForm()
			setSuccess('Настройка успешно обновлена')
		} catch (err) {
			setError('Ошибка при обновлении настройки')
			console.error(err)
		}
	}

	const handleDeleteSetting = async id => {
		if (window.confirm('Вы уверены, что хотите удалить эту настройку?')) {
			try {
				setError('')
				setSuccess('')
				await deleteSetting(id)
				const updatedSettings = settings.filter(s => s.id !== id)
				setSettings(updatedSettings)

				if (selectedSetting && selectedSetting.id === id) {
					setSelectedSetting(
						updatedSettings.length > 0 ? updatedSettings[0] : null
					)
				}

				setSuccess('Настройка успешно удалена')
			} catch (err) {
				setError('Ошибка при удалении настройки')
				console.error(err)
			}
		}
	}

	const openAddModal = () => {
		resetForm()
		setIsEditing(false)
		setShowModal(true)
	}

	const openEditModal = () => {
		if (selectedSetting) {
			setFormData({
				ai_token: selectedSetting.ai_token || '',
				whisper_model: selectedSetting.whisper_model || 'whisper-1',
				gpt_model: selectedSetting.gpt_model || 'gpt-4-turbo',
				name: selectedSetting.name || '',
			})
			setIsEditing(true)
			setShowModal(true)
		}
	}

	const resetForm = () => {
		setFormData({
			ai_token: '',
			whisper_model: 'whisper-1',
			gpt_model: 'gpt-4-turbo',
			name: '',
		})
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (isEditing) {
			handleUpdateSetting()
		} else {
			handleCreateSetting()
		}
	}

	return (
		<Container>
			<h1 className='mb-4'>Настройки профиля</h1>

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

			<Row className='mb-3'>
				<Col md={8}>
					<div className='d-flex justify-content-end'>
						<Button variant='primary' onClick={openAddModal}>
							Создать настройку
						</Button>
					</div>
				</Col>
			</Row>

			<Row>
				<Col md={8}>
					{settings.map(setting => (
						<Card className='mb-4' key={setting.id}>
							<Card.Header className='d-flex justify-content-between align-items-center'>
								<h5 className='mb-0'>{setting.name || 'Без названия'}</h5>
								<div>
									<Button
										variant='outline-secondary'
										size='sm'
										className='me-2'
										onClick={() => {
											setSelectedSetting(setting)
											openEditModal()
										}}
									>
										Редактировать
									</Button>
									<Button
										variant='outline-danger'
										size='sm'
										onClick={() => handleDeleteSetting(setting.id)}
									>
										Удалить
									</Button>
								</div>
							</Card.Header>
							<Card.Body>
								<p>
									<strong>AI Token:</strong> {setting.ai_token}
								</p>
								<p>
									<strong>Whisper Model:</strong> {setting.whisper_model}
								</p>
								<p>
									<strong>GPT Model:</strong> {setting.gpt_model}
								</p>
							</Card.Body>
						</Card>
					))}
				</Col>
			</Row>

			{/* Модальное окно */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>
						{isEditing ? 'Редактировать' : 'Добавить'} настройку
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId='name' className='mb-3'>
							<Form.Label>Название</Form.Label>
							<Form.Control
								type='text'
								name='name'
								value={formData.name}
								onChange={handleInputChange}
							/>
						</Form.Group>

						<Form.Group controlId='ai_token' className='mb-3'>
							<Form.Label>AI Token</Form.Label>
							<Form.Control
								type='text'
								name='ai_token'
								value={formData.ai_token}
								onChange={handleInputChange}
							/>
						</Form.Group>

						<Form.Group controlId='whisper_model' className='mb-3'>
							<Form.Label>Whisper модель</Form.Label>
							<Form.Control
								as='select'
								name='whisper_model'
								value={formData.whisper_model}
								onChange={handleInputChange}
							>
								<option value='whisper-1'>whisper-1</option>
								<option value='whisper-large'>whisper-large</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId='gpt_model' className='mb-3'>
							<Form.Label>GPT модель</Form.Label>
							<Form.Control
								as='select'
								name='gpt_model'
								value={formData.gpt_model}
								onChange={handleInputChange}
							>
								<option value='gpt-3.5-turbo'>gpt-3.5-turbo</option>
								<option value='gpt-4'>gpt-4</option>
								<option value='gpt-4-turbo'>gpt-4-turbo</option>
							</Form.Control>
						</Form.Group>

						<div className='text-end'>
							<Button
								variant='secondary'
								onClick={() => setShowModal(false)}
								className='me-2'
							>
								Отмена
							</Button>
							<Button variant='primary' type='submit'>
								{isEditing ? 'Сохранить' : 'Добавить'}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Container>
	)
}

export default Settings
