import {type FC, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {HiMenu, HiX} from "react-icons/hi";

type NavLink = {
    name: string,
    path: string,
}

type NavBarProps = {
    title: string;
    links: NavLink[];
    showlogout?: boolean;
}

const NavBar:FC<NavBarProps> = ({title,links, showlogout=false}) =>{
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () =>
    {
        localStorage.clear();
        navigate("/login");
    }

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="w-full bg-blue-900 text-white shadow-md mb-10 border-b-4 ">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>
                    <div className="hidden md:flex space-x-6 items-center">
                        {links.map((link) =>(
                            <Link key={link.name} to={link.path}>
                                {link.name}
                            </Link>
                        ))}
                        {showlogout && (
                            <button onClick={handleLogout}
                            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition">
                                Logout
                            </button>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu}>
                            {isOpen ? <HiX size={28}/> : <HiMenu size={28}/> }
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-blue-500 px-2 pt-2 pb-4 space-y-2">
                    {links.map((link) =>
                        (
                            <Link
                            key={link.name}
                            to={link.path}
                            onClick={()=> setIsOpen(false)}
                            className="block px-2 py-1 rounded hover:bg-blue-600 transition"
                            >
                                {link.name}
                            </Link>
                        ))}
                    {showlogout && (
                        <button onClick={handleLogout}
                        className="w-full text-left px-2 py-1 rounded bg-white text-blue-600 hover:bg-gray-100 transition">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default NavBar;