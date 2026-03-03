import { useState } from 'react'

export function useFormState(initialState = {}) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
      } catch (error) {
        setErrors({ submit: error.message })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const reset = () => {
    setFormData(initialState)
    setErrors({})
  }

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset
  }
}
