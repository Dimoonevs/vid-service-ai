import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'

const Header = () => {
	const { user, logout } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<Navbar bg='dark' variant='dark' expand='lg'>
			<Container>
				<Navbar.Brand as={Link} to='/'>
					Transvo App
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Nav.Link as={Link} to='/'>
							Главная
						</Nav.Link>
						{user && (
							<>
								<Nav.Link as={Link} to='/settings'>
									Настройки
								</Nav.Link>
								<Nav.Link as={Link} to='/videos'>
									Видео
								</Nav.Link>
							</>
						)}
					</Nav>
					<Nav>
						{user ? (
							<Button variant='outline-light' onClick={handleLogout}>
								Выйти
							</Button>
						) : (
							<>
								<Nav.Link as={Link} to='/login'>
									Войти
								</Nav.Link>
								<Nav.Link as={Link} to='/register'>
									Регистрация
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default Header
