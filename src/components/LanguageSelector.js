import React from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const LanguageSelector = ({ allLangs, selectedLangs, setSelectedLangs }) => {
	const availableLangs = allLangs.filter(lang => !selectedLangs.includes(lang))

	const handleDragEnd = result => {
		const { source, destination } = result
		if (!destination) return

		if (
			source.droppableId === 'available' &&
			destination.droppableId === 'selected'
		) {
			const moved = availableLangs[source.index]
			setTimeout(() => {
				setSelectedLangs(prev => [...prev, moved])
			}, 0)
		}

		if (
			source.droppableId === 'selected' &&
			destination.droppableId === 'available'
		) {
			const moved = selectedLangs[source.index]
			setTimeout(() => {
				setSelectedLangs(prev => prev.filter(l => l !== moved))
			}, 0)
		}
	}

	const handleAdd = lang => {
		if (!selectedLangs.includes(lang)) {
			setSelectedLangs([...selectedLangs, lang])
		}
	}

	const handleRemove = lang => {
		setSelectedLangs(selectedLangs.filter(l => l !== lang))
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Row>
				<Col md={6}>
					<h6>Доступные языки</h6>
					<Droppable
						droppableId='available'
						isDropDisabled={false}
						isCombineEnabled={false}
						ignoreContainerClipping={false}
					>
						{provided => (
							<Card
								body
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									minHeight: 200,
									maxHeight: 300,
									overflowY: 'auto',
								}}
							>
								{availableLangs.map((lang, idx) => (
									<Draggable draggableId={lang} index={idx} key={lang}>
										{provided => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className='mb-2 d-flex justify-content-between align-items-center p-2 border rounded bg-light'
											>
												{lang}
												<Button
													variant='outline-primary'
													size='sm'
													onClick={() => handleAdd(lang)}
												>
													+
												</Button>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</Card>
						)}
					</Droppable>
				</Col>

				<Col md={6}>
					<h6>Выбранные языки</h6>
					<Droppable
						droppableId='selected'
						isDropDisabled={false}
						isCombineEnabled={false}
						ignoreContainerClipping={false}
					>
						{provided => (
							<Card
								body
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									minHeight: 200,
									maxHeight: 300,
									overflowY: 'auto',
								}}
							>
								{selectedLangs.map((lang, idx) => (
									<Draggable draggableId={lang} index={idx} key={lang}>
										{provided => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className='mb-2 d-flex justify-content-between align-items-center p-2 border rounded bg-success text-white'
											>
												{lang}
												<Button
													variant='outline-light'
													size='sm'
													onClick={() => handleRemove(lang)}
												>
													×
												</Button>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</Card>
						)}
					</Droppable>
				</Col>
			</Row>
		</DragDropContext>
	)
}

export default LanguageSelector
