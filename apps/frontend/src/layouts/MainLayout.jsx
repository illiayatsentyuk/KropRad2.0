import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
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
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return (
        <>
            <div className="flex relative min-h-screen bg-[#081A4B] text-[#2C2C2C] w-full">
                <header className="md:hidden flex w-full fixed top-0 items-center justify-between bg-[#202020]/80 backdrop-blur border-b border-white/10 z-[1000] text-[#EAEAEA] h-14 px-4 shadow-sm">
                    <button
                        className="inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/10"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="logo" className="w-6 h-6" />
                        <span className="text-sm text-white">KROP‑RAD</span>
                    </Link>
                    <div className="w-10" />
                </header>
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto flex flex-col items-center p-5 gap-4 bg-gradient-to-b from-[#0b1b4d] to-[#0e275f] text-[#EAEAEA] w-56 h-screen fixed left-0 top-0 border-r border-white/10 transform transition-transform duration-200 z-[950] md:top-0 md:h-screen md:pt-5 pt-16` }>
                    <div className="w-full flex items-center justify-between">
                        <Link to="/" className="transition-transform duration-200 hover:scale-105">
                            <img src={logo} alt="logo" className="w-12 h-12" />
                        </Link>
                        <button
                            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close menu"
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <nav className="w-full space-y-1">
                        {links.map((link, i) => (
                            <Link
                                key={i}
                                to={link.to}
                                onClick={() => setSidebarOpen(false)}
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
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-[900] md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <div className="flex-1 min-h-screen md:ml-56 bg-[#F4F6FA] md:pt-0 pt-14">
                    <Outlet />
                </div>
            </div>
        </>
    )
}