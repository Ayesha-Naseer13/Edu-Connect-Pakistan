import { createContext, useContext, useState, useEffect } from "react"
import api from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await api.get("/auth/me")
          setUser(response.data)
          localStorage.setItem("user", JSON.stringify(response.data)) // Store user data
        } else {
          setUser(null)
          localStorage.removeItem("user")
        }
      } catch (err) {
        console.error("Authentication error:", err)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post("/auth/login", credentials)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user)) // Store user data
      setUser(response.data.user)
      return response.data.user
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isTutor: user?.role === "tutor",
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
