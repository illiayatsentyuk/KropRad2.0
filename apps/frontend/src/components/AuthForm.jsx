import { useState } from "react"
import { fetchSignin, fetchSignup } from "../api/auth"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setTokens } from "../store/store"

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [values, setValues] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState({ name: "", email: "", password: "", form: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validate = (v, loginMode) => {
    const nextErrors = { name: "", email: "", password: "", form: "" }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!v.email || !emailRegex.test(v.email.trim())) {
      nextErrors.email = "Please enter a valid email"
    }
    if (!v.password || v.password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters"
    }
    if (!loginMode) {
      if (!v.name || v.name.trim().length < 2) {
        nextErrors.name = "Name must be at least 2 characters"
      }
    }
    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate(values, isLogin)
    setErrors(prev => ({ ...prev, ...nextErrors, form: "" }))
    const hasFieldError = Object.values({ ...nextErrors, form: undefined }).some(Boolean)
    if (hasFieldError) return
    setLoading(true)
    try {
      let data
      if (isLogin) {
        data = await fetchSignin(values.email.trim(), values.password)
      } else {
        data = await fetchSignup(values.name.trim(), values.email.trim(), values.password)
      }
      
      // Store tokens in Redux store and localStorage
      dispatch(setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      }))
      
      navigate("/")
      navigate(0)
    } catch (error) {
      setErrors(prev => ({ ...prev, form: error.message || "Authentication failed" }))
    } finally {
      setLoading(false)
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const onBlur = (e) => {
    const { name } = e.target
    const fieldErrors = validate(values, isLogin)
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  return (
    <div className="w-full mx-auto p-6 sm:p-8 md:p-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E63] mb-2 text-center">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-sm text-[#6C7A89] mb-6 text-center">
        {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
      </p>

      <button
        className="w-full p-3 mb-8 bg-[#F4F6FA] text-[#2B59C3] border-2 border-[#E9ECF2] rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[#E9ECF2] hover:border-[#2B59C3]"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>

      {errors.form && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {errors.form}
        </div>
      )}

      {isLogin ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#0A1E63]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
              className={`w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white ${errors.email ? 'border-red-400' : 'border-[#E9ECF2]'}`}
            />
            {errors.email && (
              <span id="email-error" className="text-xs text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[#0A1E63]">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              name="password"
              autoComplete="current-password"
              value={values.password}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
              className={`w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white ${errors.password ? 'border-red-400' : 'border-[#E9ECF2]'}`}
            />
            {errors.password && (
              <span id="password-error" className="text-xs text-red-600">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-2 text-white rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 ${loading ? 'bg-[#9BB3F0] cursor-not-allowed' : 'bg-[#2B59C3] hover:bg-[#0A1E63] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(43,89,195,0.3)]'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-[#0A1E63]">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
              className={`w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white ${errors.name ? 'border-red-400' : 'border-[#E9ECF2]'}`}
            />
            {errors.name && (
              <span id="name-error" className="text-xs text-red-600">{errors.name}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#0A1E63]">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
              className={`w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white ${errors.email ? 'border-red-400' : 'border-[#E9ECF2]'}`}
            />
            {errors.email && (
              <span id="email-error" className="text-xs text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[#0A1E63]">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              name="password"
              autoComplete="new-password"
              value={values.password}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
              className={`w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white ${errors.password ? 'border-red-400' : 'border-[#E9ECF2]'}`}
            />
            {errors.password && (
              <span id="password-error" className="text-xs text-red-600">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-2 text-white rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 ${loading ? 'bg-[#9BB3F0] cursor-not-allowed' : 'bg-[#2B59C3] hover:bg-[#0A1E63] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(43,89,195,0.3)]'}`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  )
}