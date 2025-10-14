import { Outlet, Link } from 'react-router-dom'
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
        to: "/",
        label: "Ipsum"
    },
    {
        to: "/",
        label: "Dolor"
    },
    {
        to: "/",
        label: "Sit"
    },
]

export const MainLayout = () => {
    return (
        <>
            <div className="flex relative min-h-screen bg-[#081A4B] text-[#2C2C2C] w-full">
                <div className="overflow-y-auto flex flex-col items-center p-8 gap-6 bg-[#081A4B] text-[#2C2C2C] w-[300px] h-screen fixed left-0 top-0 pt-18">
                    <Link to="/" className="hover:scale-110 transition-all duration-300">
                        <img src={logo} alt="logo" className="w-[70px] h-[70px]" />
                    </Link>
                    {links.map((link, i) => (
                        <Link key={i} to={link.to} className="text-[#EAEAEA] hover:text-[#3F7EF7] w-full text-center">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex-1 min-h-screen ml-[300px] bg-[#F4F6FA]">
                    <Outlet />
                </div>
            </div>
        </>
    )
}