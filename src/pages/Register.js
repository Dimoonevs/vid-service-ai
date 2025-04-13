import React, { useState, useContext } from 'react'
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const { registerUser } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		if (!email || !password || !passwordConfirm) {
			setError('Пожалуйста, заполните все поля')
			return
		}

		if (password !== passwordConfirm) {
			setError('Пароли не совпадают')
			return
		}

		if (password.length < 6) {
			setError('Пароль должен содержать не менее 6 символов')
			return
		}

		try {
			setError('')
			setLoading(true)
			const result = await registerUser(email, password)

			if (result.success) {
				navigate('/verify')
			} else {
				setError(result.error || 'Ошибка регистрации')
			}
		} catch (err) {
			setError('Ошибка сервера. Пожалуйста, попробуйте позже')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container>
			<Row className='justify-content-center'>
				<Col md={6}>
					<Card className='shadow'>
						<Card.Body>
							<h2 className='text-center mb-4'>Регистрация</h2>
							{error && <Alert variant='danger'>{error}</Alert>}

							<Form onSubmit={handleSubmit}>
								<Form.Group controlId='email' className='mb-3'>
									<Form.Label>Email</Form.Label>
									<Form.Control
										type='email'
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
									/>
								</Form.Group>

								<Form.Group controlId='password' className='mb-3'>
									<Form.Label>Пароль</Form.Label>
									<Form.Control
										type='password'
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
									/>
								</Form.Group>

								<Form.Group controlId='passwordConfirm' className='mb-4'>
									<Form.Label>Подтвердите пароль</Form.Label>
									<Form.Control
										type='password'
										value={passwordConfirm}
										onChange={e => setPasswordConfirm(e.target.value)}
										required
									/>
								</Form.Group>

								<Button
									variant='primary'
									type='submit'
									className='w-100'
									disabled={loading}
								>
									{loading ? 'Загрузка...' : 'Зарегистрироваться'}
								</Button>
							</Form>
						</Card.Body>
					</Card>

					<div className='text-center mt-3'>
						<p>
							Уже есть аккаунт? <Link to='/login'>Войти</Link>
						</p>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default Register
