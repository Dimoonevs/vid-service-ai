import React, { createContext, useEffect, useState } from 'react'
import { login, register, verifyCode, checkAuth } from '../services/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [pendingVerification, setPendingVerification] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const token = localStorage.getItem('token')
		console.log('Token:', token)

		if (!token) {
			setLoading(false)
			return
		}

		checkAuth()
			.then(data => {
				console.log('checkAuth success', data)
				setUser(data.data || null)
			})
			.catch(err => {
				console.warn('checkAuth failed', err)
				localStorage.removeItem('token')
				setUser(null)
			})
			.finally(() => setLoading(false))
	}, [])

	const loginUser = async (email, password) => {
		const result = await login(email, password)
		if (result.token) {
			localStorage.setItem('token', result.token)
			setUser(result.user || { email })
			return { success: true }
		}
		return { success: false, error: result.error }
	}

	const registerUser = async (email, password) => {
		const result = await register(email, password)
		if (result.success) {
			setPendingVerification({ email })
			return { success: true }
		}
		return { success: false, error: result.error }
	}

	const verifyUser = async (email, code) => {
		const result = await verifyCode(email, code)
		if (result.token) {
			localStorage.setItem('token', result.token)
			setUser(result.user || { email })
			setPendingVerification(null)
			return { success: true }
		}
		return { success: false, error: result.error }
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
		window.location.href = '/login'
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				loginUser,
				registerUser,
				verifyUser,
				logout,
				pendingVerification,
				setPendingVerification,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
