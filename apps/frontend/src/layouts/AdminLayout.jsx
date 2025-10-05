import { Outlet, Link } from 'react-router-dom'
import logo from '/vite.svg'
import { fetchLogout } from '../api/auth'
import { useNavigate } from 'react-router-dom'

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
        to: "/create-article",
        label: "Створити статтю"
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

export const AdminLayout = () => {
    const handleLogout = () => {
        const accessToken = localStorage.getItem("access_token")
        if(!accessToken) {
            return window.location.reload()
        }
        fetchLogout(accessToken).then(data => {
            if(data.message === "Logged out") {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                window.location.reload()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <>
            <div className="flex relative h-screen bg-[#081A4B] text-[#2C2C2C] w-full h-full">
                <header className="flex w-full fixed top-0 justify-end bg-[#202020] z-1000 text-[#EAEAEA] gap-6 p-2">
                    <p className="text-[#EAEAEA]">Admin</p>
                    <button onClick={handleLogout}>Logout</button>
                </header>
                <div className="overflow-y-auto flex flex-col items-center p-8 gap-6 h-screen bg-[#081A4B] text-[#2C2C2C] w-[300px] h-full fixed left-0 top-0 pt-18">
                    <Link to="/" className="hover:scale-110 transition-all duration-300">
                        <img src={logo} alt="logo" className="w-[70px] h-[70px]" />
                    </Link>
                    {links.map((link, i) => (
                        <Link key={i} to={link.to} className="text-[#EAEAEA] hover:text-[#3F7EF7] w-full text-center">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <Outlet />
            </div>
        </>
    )
}