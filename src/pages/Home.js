import React, { useContext } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Home = () => {
	const { user } = useContext(AuthContext)

	return (
		<Container>
			<Row className='mb-5'>
				<Col md={8} className='mx-auto text-center'>
					<h1 className='display-4 mb-4'>Transvo App</h1>
					<p className='lead mb-4'>
						Профессиональная платформа для работы с видео, субтитрами и анализом
						контента. Загружайте видео, создавайте субтитры, анализируйте
						содержание и многое другое.
					</p>

					{/* Показывать только если пользователь не авторизован */}
					{!user && (
						<div className='d-flex justify-content-center gap-3'>
							<Button as={Link} to='/register' variant='primary' size='lg'>
								Начать бесплатно
							</Button>
							<Button
								as={Link}
								to='/login'
								variant='outline-secondary'
								size='lg'
							>
								Войти
							</Button>
						</div>
					)}
				</Col>
			</Row>

			<Row className='mb-5'>
				<Col md={4}>
					<Card className='h-100 text-center shadow-sm'>
						<Card.Body>
							<div className='mb-3'>
								<i className='bi bi-film' style={{ fontSize: '3rem' }}></i>
							</div>
							<Card.Title>Работа с видео</Card.Title>
							<Card.Text>
								Загружайте видео и управляйте своей библиотекой медиа-файлов с
								легкостью.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className='h-100 text-center shadow-sm'>
						<Card.Body>
							<div className='mb-3'>
								<i
									className='bi bi-chat-square-text'
									style={{ fontSize: '3rem' }}
								></i>
							</div>
							<Card.Title>Автоматические субтитры</Card.Title>
							<Card.Text>
								Создавайте и встраивайте субтитры в видео с помощью продвинутых
								AI-технологий.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className='h-100 text-center shadow-sm'>
						<Card.Body>
							<div className='mb-3'>
								<i className='bi bi-bar-chart' style={{ fontSize: '3rem' }}></i>
							</div>
							<Card.Title>Аналитика контента</Card.Title>
							<Card.Text>
								Получайте саммари и аналитику содержания ваших видео для более
								глубокого понимания.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Также скрываем блок призыва зарегистрироваться */}
			{!user && (
				<Row>
					<Col md={8} className='mx-auto text-center'>
						<h2 className='mb-4'>Начните работать сегодня</h2>
						<p className='mb-4'>
							Присоединяйтесь к нашему сообществу и раскройте весь потенциал
							ваших видеоматериалов.
						</p>
						<Button as={Link} to='/register' variant='success' size='lg'>
							Зарегистрироваться
						</Button>
					</Col>
				</Row>
			)}
		</Container>
	)
}

export default Home
