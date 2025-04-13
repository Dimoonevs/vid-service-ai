import React, { useEffect, useState } from 'react'
import {
	Alert,
	Container,
	ButtonGroup,
	ToggleButton,
	Collapse,
	Card,
	Button,
	ProgressBar,
} from 'react-bootstrap'
import { getVideoById } from '../services/video'
import { createSubtitles, embedSubtitles, getSummary } from '../services/ai'
import { getSettings, getAiData } from '../services/api'
import { useParams } from 'react-router-dom'
import SubtitleForm from '../components/SubtitleForm'
import SummaryForm from '../components/SummaryForm'

const VideoEditPage = () => {
	const { id } = useParams()
	const videoId = parseInt(id)
	const [langs, setLangs] = useState([])
	const [summaryLang, setSummaryLang] = useState('RUS')
	const [subsCreated, setSubsCreated] = useState(false)
	const [subLinks, setSubLinks] = useState(null)
	const [summaryCreated, setSummaryCreated] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [video, setVideo] = useState(null)
	const [settings, setSettings] = useState([])
	const [selectedSetting, setSelectedSetting] = useState('')
	const [formType, setFormType] = useState('subtitles')
	const [activeBlock, setActiveBlock] = useState(null)
	const [aiInfo, setAiInfo] = useState(null)
	const [aiStatus, setAiStatus] = useState('non')

	const allLangs = [
		'EN',
		'UKR',
		'RUS',
		'FR',
		'DE',
		'ES',
		'IT',
		'PL',
		'PT',
		'TR',
		'ZH',
		'JA',
		'KO',
		'AR',
		'HE',
		'HI',
		'NL',
		'SV',
		'NO',
		'FI',
		'CS',
		'RO',
		'HU',
		'BG',
		'EL',
		'VI',
		'ID',
		'TH',
		'DA',
		'SK',
	]

	useEffect(() => {
		const fetchVideo = async () => {
			try {
				const v = await getVideoById(videoId)
				setVideo(v)
				setAiStatus(v.status_ai || 'non')
			} catch (e) {
				setError(e.message)
			}
		}

		const fetchSettings = async () => {
			try {
				const data = await getSettings()
				setSettings(data)
				if (data.length > 0) {
					setSelectedSetting(data[0].id)
				}
			} catch (e) {
				setError(e.message)
			}
		}

		const fetchAIInfo = async () => {
			try {
				const info = await getAiData(videoId)
				setAiInfo(info)
			} catch (e) {
				setError(e.message)
			}
		}

		fetchVideo()
		fetchSettings()
		fetchAIInfo()

		const interval = setInterval(() => {
			fetchVideo()
			fetchAIInfo()
		}, 10000)

		return () => clearInterval(interval)
	}, [videoId])

	const handleCreateSubtitles = async () => {
		try {
			setError('')
			setSuccess('')
			const data = await createSubtitles(videoId, langs, selectedSetting)
			setSubsCreated(true)
			setSubLinks(data)
			setSuccess('Субтитры успешно созданы')
		} catch (e) {
			setError(e.message)
		}
	}

	const handleEmbedSubtitles = async () => {
		try {
			setError('')
			setSuccess('')
			await embedSubtitles(videoId)
			setSuccess('Субтитры успешно вшиты в видео')
		} catch (e) {
			setError(e.message)
		}
	}

	const handleGetSummary = async () => {
		try {
			setError('')
			setSuccess('')
			await getSummary(videoId, selectedSetting, summaryLang)
			setSummaryCreated(true)
			setSuccess('Саммари успешно получено')
		} catch (e) {
			setError(e.message)
		}
	}

	return (
		<Container className='my-4'>
			<h2>Редактирование видео (ID: {videoId})</h2>

			{error && <Alert variant='danger'>{error}</Alert>}
			{success && <Alert variant='success'>{success}</Alert>}

			{/* ▼ Видео */}
			<div
				style={{
					borderTop: '1px solid #ccc',
					padding: '10px',
					cursor: 'pointer',
					marginTop: 15,
				}}
				onClick={() =>
					setActiveBlock(prev => (prev === 'video' ? null : 'video'))
				}
			>
				<strong>
					{activeBlock === 'video' ? '▲ Скрыть видео' : '▼ Показать видео'}
				</strong>
			</div>
			<Collapse in={activeBlock === 'video'}>
				<div className='mt-3'>
					{video && (
						<video
							controls
							src={video.file_path}
							style={{ width: '100%', maxHeight: 400 }}
						/>
					)}
				</div>
			</Collapse>

			{/* ▼ Формы */}
			<div
				style={{
					borderTop: '1px solid #ccc',
					padding: '10px',
					cursor: 'pointer',
					marginTop: 15,
				}}
				onClick={() =>
					setActiveBlock(prev => (prev === 'forms' ? null : 'forms'))
				}
			>
				<strong>
					{activeBlock === 'forms' ? '▲ Скрыть формы' : '▼ Показать формы'}
				</strong>
			</div>
			<Collapse in={activeBlock === 'forms'}>
				<div className='mt-3'>
					<ButtonGroup className='mb-3'>
						<ToggleButton
							id='toggle-subtitles'
							type='radio'
							variant='outline-primary'
							name='form-toggle'
							checked={formType === 'subtitles'}
							value='subtitles'
							onChange={() => setFormType('subtitles')}
						>
							Создать субтитры
						</ToggleButton>
						<ToggleButton
							id='toggle-summary'
							type='radio'
							variant='outline-info'
							name='form-toggle'
							checked={formType === 'summary'}
							value='summary'
							onChange={() => setFormType('summary')}
						>
							Получить саммари
						</ToggleButton>
					</ButtonGroup>

					{formType === 'subtitles' && (
						<SubtitleForm
							langs={langs}
							setLangs={setLangs}
							allLangs={allLangs}
							settings={settings}
							selectedSetting={selectedSetting}
							setSelectedSetting={setSelectedSetting}
							onCreate={handleCreateSubtitles}
							onEmbed={handleEmbedSubtitles}
							subsCreated={subsCreated}
						/>
					)}
					{formType === 'summary' && (
						<SummaryForm
							allLangs={allLangs}
							summaryLang={summaryLang}
							setSummaryLang={setSummaryLang}
							onGetSummary={handleGetSummary}
							subsCreated={subsCreated}
							settings={settings}
							selectedSetting={selectedSetting}
							setSelectedSetting={setSelectedSetting}
						/>
					)}
				</div>
			</Collapse>

			{/* ▼ AI инфо */}
			<div
				style={{
					borderTop: '1px solid #ccc',
					padding: '10px',
					cursor: 'pointer',
					marginTop: 15,
				}}
				onClick={() => setActiveBlock(prev => (prev === 'ai' ? null : 'ai'))}
			>
				<strong>
					{activeBlock === 'ai'
						? '▲ Скрыть информацию об AI'
						: '▼ Показать информацию об AI'}
				</strong>
			</div>
			<Collapse in={activeBlock === 'ai'}>
				<div className='mt-3'>
					<Card body>
						{aiStatus === 'non' && <p>AI не запускался для этого видео.</p>}
						{aiStatus === 'process' && (
							<ProgressBar animated now={100} label='Обработка AI...' />
						)}
						{aiStatus === 'done' && (
							<pre style={{ whiteSpace: 'pre-wrap' }}>
								{JSON.stringify(aiInfo, null, 2)}
							</pre>
						)}
						{aiStatus === 'error' && (
							<Alert variant='danger'>
								AI обработка завершилась с ошибкой.
							</Alert>
						)}
					</Card>
				</div>
			</Collapse>

			{subLinks && (
				<div className='mt-4'>
					<h5>Ссылки на субтитры:</h5>
					<ul>
						{Object.entries(subLinks).map(([lang, url]) => (
							<li key={lang}>
								<strong>{lang}</strong>: <a href={url}>{url}</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</Container>
	)
}

export default VideoEditPage
