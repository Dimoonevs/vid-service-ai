import React from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import LanguageSelector from './LanguageSelector'

const SubtitleForm = ({
	langs,
	setLangs,
	allLangs,
	settings,
	selectedSetting,
	setSelectedSetting,
	onCreate,
	onEmbed,
	subsCreated,
}) => {
	return (
		<Form className='mt-4'>
			<Row className='mb-3'>
				<Col md={6}>
					<Form.Group controlId='langs'>
						<LanguageSelector
							selectedLangs={langs}
							setSelectedLangs={setLangs}
							allLangs={allLangs}
						/>
					</Form.Group>
				</Col>

				<Col md={6}>
					<Form.Group controlId='setting'>
						<Form.Label>Настройки AI</Form.Label>
						<Form.Control
							as='select'
							value={selectedSetting}
							onChange={e => setSelectedSetting(e.target.value)}
						>
							{settings.map(setting => (
								<option key={setting.id} value={setting.id}>
									{setting.name}
								</option>
							))}
						</Form.Control>
					</Form.Group>
				</Col>
			</Row>

			<Row>
				<Col md={6}>
					<Button onClick={onCreate} className='me-2'>
						Создать субтитры
					</Button>
				</Col>

				<Col md={6}>
					<Button onClick={onEmbed} disabled={!subsCreated} variant='success'>
						Вшить субтитры
					</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default SubtitleForm
