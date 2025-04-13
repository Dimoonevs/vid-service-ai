import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { resendCode } from '../services/auth'

const VerifyCode = () => {
	const [code, setCode] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [resendTimer, setResendTimer] = useState(20)
	const [resending, setResending] = useState(false)

	const { verifyUser, pendingVerification, setPendingVerification } =
		useContext(AuthContext)
	const navigate = useNavigate()

	useEffect(() => {
		if (!pendingVerification) {
			navigate('/login')
		}
	}, [pendingVerification, navigate])

	// Таймер повторной отправки
	useEffect(() => {
		let interval = null
		if (resendTimer > 0) {
			interval = setInterval(() => {
				setResendTimer(t => t - 1)
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [resendTimer])

	const handleSubmit = async e => {
		e.preventDefault()

		if (!code) {
			setError('Пожалуйста, введите код подтверждения')
			return
		}

		try {
			setError('')
			setLoading(true)
			const result = await verifyUser(pendingVerification.email, code)

			navigate('/login')
		} catch (err) {
			setError('Ошибка сервера. Пожалуйста, попробуйте позже')
		} finally {
			setLoading(false)
		}
	}

	const handleResend = async () => {
		setError('')
		setResending(true)
		try {
			const result = await resendCode(pendingVerification.email)
			if (result.error) {
				setError(result.error)
			} else {
				setResendTimer(20)
			}
		} catch (err) {
			setError('Ошибка при отправке кода')
		} finally {
			setResending(false)
		}
	}

	if (!pendingVerification) return null

	return (
		<Container>
			<Row className='justify-content-center'>
				<Col md={6}>
					<Card className='shadow'>
						<Card.Body>
							<h2 className='text-center mb-4'>Подтверждение кода</h2>
							{error && <Alert variant='danger'>{error}</Alert>}

							<p className='text-center mb-4'>
								Мы отправили код подтверждения на email:{' '}
								<strong>{pendingVerification.email}</strong>
							</p>

							<Form onSubmit={handleSubmit}>
								<Form.Group controlId='code' className='mb-4'>
									<Form.Label>Код подтверждения</Form.Label>
									<Form.Control
										type='text'
										value={code}
										onChange={e => setCode(e.target.value)}
										required
									/>
								</Form.Group>

								<div className='d-grid gap-2'>
									<Button variant='primary' type='submit' disabled={loading}>
										{loading ? 'Проверка...' : 'Подтвердить'}
									</Button>

									<Button
										variant='outline-secondary'
										onClick={handleResend}
										disabled={resendTimer > 0 || resending}
									>
										{resending
											? 'Отправка...'
											: resendTimer > 0
											? `Отправить повторно (${resendTimer} сек)`
											: 'Отправить код повторно'}
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default VerifyCode
