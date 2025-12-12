import { AuthForm } from '../components/AuthForm'


export const AuthPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6FA] px-4 py-8 sm:px-6 md:px-8">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
      <p className="mt-8 text-sm text-gray-500 text-center">
        Сайт розроблений командою КЗ "Ліцею НТН" КМР" — RoboLegion, а саме за участі Яцентюка Іллі. Автором інформаційних матеріалів і статей є учень 11 класу — Попович Максим.
      </p>
    </div>
  )
}