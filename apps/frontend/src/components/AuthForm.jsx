import { useState, useRef } from "react"
import { fetchSignin, fetchSignup } from "../api/auth"
import { useNavigate } from "react-router-dom"

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const formRef = useRef(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = formRef.current;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    if (isLogin) {
      fetchSignin(values.email, values.password).then(data => {
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token)
          localStorage.setItem("access_token", data.access_token)
          navigate("/")
          navigate(0)
        } else {
          console.log(data)
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      fetchSignup(values.name, values.email, values.password).then(data => {
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token)
          localStorage.setItem("access_token", data.access_token)
          navigate("/")
          navigate(0)
        } else {
          console.log(data)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-[#0A1E63] mb-2 text-center">
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

      {isLogin ? (
        <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white"
          />
          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-[#2B59C3] text-white rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[#0A1E63] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(43,89,195,0.3)]"
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-4">
          <input type="text" placeholder="Name" name="name" required className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full px-4 py-3.5 text-[15px] bg-[#F4F6FA] border-2 border-[#E9ECF2] rounded-lg text-[#1E1E1E] transition-all duration-300 outline-none focus:border-[#3F7EF7] focus:bg-white"
          />
          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-[#2B59C3] text-white rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-[#0A1E63] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(43,89,195,0.3)]"
          >
            Register
          </button>
        </form>
      )}
    </div>
  )
}