import { AuthForm } from '../components/AuthForm'


export const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] px-4 py-8 sm:px-6 md:px-8">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}