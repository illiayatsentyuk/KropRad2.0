import { Outlet, Link, useLocation } from 'react-router-dom'
import logo from '/vite.svg'

const links = [
    {
        to: "/",
        label: "Головна"
    },
    {
        to: "/articles",
        label: "Статті"
    },
    {
        to: "/about",
        label: "Про проект"
    },
]

export const MainLayout = () => {
    const { pathname } = useLocation()
    const isActive = (to) => pathname === to
    return (
        <>
            <div className="flex relative min-h-screen bg-[#081A4B] text-[#2C2C2C] w-full">
                <div className="overflow-y-auto flex flex-col items-center p-5 gap-4 bg-gradient-to-b from-[#0b1b4d] to-[#0e275f] text-[#EAEAEA] w-56 h-screen fixed left-0 top-0 border-r border-white/10">
                    <Link to="/" className="transition-transform duration-200 hover:scale-105">
                        <img src={logo} alt="logo" className="w-12 h-12" />
                    </Link>
                    <nav className="w-full space-y-1">
                        {links.map((link, i) => (
                            <Link
                                key={i}
                                to={link.to}
                                className={`relative flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors ${
                                    isActive(link.to)
                                        ? 'bg-white/10 text-white'
                                        : 'text-[#EAEAEA] hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r ${
                                    isActive(link.to) ? 'bg-[#3F7EF7]' : 'bg-transparent'
                                }`} />
                                <span className="truncate mx-auto sm:mx-0 sm:ml-2">{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex-1 min-h-screen ml-56 bg-[#F4F6FA]">
                    <Outlet />
                </div>
            </div>
        </>
    )
}