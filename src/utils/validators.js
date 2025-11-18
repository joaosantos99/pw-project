export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError = 'Invalid email'

  return emailRegex.test(email) ? null : emailError
}

export const validateSignupPassword = (password) => {
  if (!password) {
    return 'Password is required'
  }

  // It should contain:
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character
  // - At least 8 characters long
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  const passwordError = 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be at least 8 characters long'

  return passwordRegex.test(password) ? null : passwordError
}
