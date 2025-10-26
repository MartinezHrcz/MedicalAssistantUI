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
        navigate("/");
    }

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="w-full bg-blue-900 text-white shadow-md border-b-4 border-blue-700 sticky top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold overflow-hidden uppercase tracking-wide">{title}</h1>
                    </div>

                    <div className="hidden md:flex space-x-6 items-center">
                        {links.map((link) =>(
                            <Link key={link.name} to={link.path}
                                  className="hover:text-gray-200 transition duration-300 font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {showlogout && (
                            <button onClick={handleLogout}
                                    className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition duration-300">
                                Logout
                            </button>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="focus:outline-none">
                            {isOpen ? <HiX size={28}/> : <HiMenu size={28}/> }
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-blue-800 px-4 py-3 space-y-2 rounded-b-lg shadow-lg">
                    {links.map((link) =>
                        (
                            <Link
                            key={link.name}
                            to={link.path}
                            onClick={()=> setIsOpen(false)}
                            className="block text-white px-3 py-2 rounded hover:bg-blue-700 transition duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}
                    {showlogout && (
                        <button onClick={handleLogout}
                                className="w-full text-left px-3 py-2 rounded bg-white text-blue-700 hover:bg-gray-100 transition duration-300">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default NavBar;