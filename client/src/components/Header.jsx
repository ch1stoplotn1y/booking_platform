import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext.jsx";
import * as Icon from "../icons/Icons";
export default function Header() {
    const { user } = useContext(UserContext);

    return (
        <header className="flex justify-between items-center p-4 bg-white sticky top-0 z-50 border-b border-gray-200">
            <Link to={"/"} className="flex items-center gap-1">
                <Icon.MainLogo />
                <span className="font-bold text-xl text-primary">RoamStay</span>
            </Link>

            <Link
                to={user ? `/profile/account` : "/login"}
                className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-all"
            >
                <Icon.ThreeBarsIcon />
                <div className="bg-gray-100 p-1 rounded-full border border-gray-300">
                    <Icon.HeaderUserIcon />
                </div>
                {!!user && (
                    <div className="text-gray-700">{user.firstName}</div>
                )}
            </Link>
        </header>
    );
}
