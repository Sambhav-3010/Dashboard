// Admin credentials - UPDATE THESE AS NEEDED
const ADMIN_CREDENTIALS = {
  email: "ankita.mahajan@naareecollections.com",
  password: "Naaree@123"
}

export const validateSellerEmail = (email: string): boolean => {
  return email.endsWith("@naareecollections.com")
}

export const mockSellerLogin = (email: string, password: string) => {
  // Check against admin credentials first
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      id: "1",
      name: "Admin",
      email: email,
      role: "admin" as const,
    }
  }
  
  // For other @naareecollections.com emails, just validate format and password length
  if (validateSellerEmail(email) && password.length >= 6) {
    return {
      id: "2",
      name: email.split("@")[0],
      email: email,
      role: "seller" as const,
    }
  }
  return null
}

// LocalStorage persistence functions
export const saveAuthToStorage = (user: any) => {
  try {
    localStorage.setItem('naaree_auth_user', JSON.stringify(user))
    localStorage.setItem('naaree_auth_timestamp', Date.now().toString())
  } catch (error) {
    console.error('Failed to save auth to localStorage:', error)
  }
}

export const getAuthFromStorage = () => {
  try {
    const userStr = localStorage.getItem('naaree_auth_user')
    const timestamp = localStorage.getItem('naaree_auth_timestamp')
    
    if (!userStr || !timestamp) return null
    
    // Check if session is older than 24 hours
    const now = Date.now()
    const sessionAge = now - parseInt(timestamp)
    const maxSessionAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (sessionAge > maxSessionAge) {
      clearAuthFromStorage()
      return null
    }
    
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Failed to get auth from localStorage:', error)
    return null
  }
}

export const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('naaree_auth_user')
    localStorage.removeItem('naaree_auth_timestamp')
  } catch (error) {
    console.error('Failed to clear auth from localStorage:', error)
  }
}