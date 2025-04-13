import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyCode from './pages/VerifyCode'
import Settings from './pages/Settings'
import VideoManager from './pages/VideoManager'
import VideoEditPage from './pages/VideoEditPage'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className='d-flex flex-column min-vh-100'>
					<Header />
					<main className='flex-grow-1'>
						<div className='container py-4'>
							<Routes>
								<Route path='/' element={<Home />} />
								<Route path='/login' element={<Login />} />
								<Route path='/register' element={<Register />} />
								<Route path='/verify' element={<VerifyCode />} />
								<Route
									path='/settings'
									element={
										<ProtectedRoute>
											<Settings />
										</ProtectedRoute>
									}
								/>
								<Route
									path='/videos'
									element={
										<ProtectedRoute>
											<VideoManager />
										</ProtectedRoute>
									}
								/>
								<Route
									path='/videos/:id/edit'
									element={
										<ProtectedRoute>
											<VideoEditPage />
										</ProtectedRoute>
									}
								/>
								<Route path='*' element={<Navigate to='/' />} />
							</Routes>
						</div>
					</main>
					<Footer />
				</div>
			</Router>
		</AuthProvider>
	)
}

export default App
