export const validateSellerEmail = (email: string): boolean => {
  return email.endsWith("@naareecollections.com")
}

export const mockSellerLogin = (email: string, password: string) => {
  if (validateSellerEmail(email) && password.length >= 6) {
    return {
      id: "1",
      name: email.split("@")[0],
      email: email,
      role: "seller" as const,
    }
  }
  return null
}
