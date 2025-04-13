import React from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'

const SummaryForm = ({
	allLangs,
	summaryLang,
	setSummaryLang,
	onGetSummary,
	subsCreated,
	settings,
	selectedSetting,
	setSelectedSetting,
}) => {
	return (
		<Form className='mt-4'>
			<Row className='mb-3'>
				<Col md={6}>
					<Form.Group controlId='summaryLang'>
						<Form.Label>Язык саммари</Form.Label>
						<Form.Control
							as='select'
							value={summaryLang}
							onChange={e => setSummaryLang(e.target.value)}
						>
							{allLangs.map(lang => (
								<option key={lang} value={lang}>
									{lang}
								</option>
							))}
						</Form.Control>
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

				<Col md={6} className='d-flex align-items-end mt-5'>
					<Button onClick={onGetSummary} disabled={!subsCreated} variant='info'>
						Получить саммари
					</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default SummaryForm
