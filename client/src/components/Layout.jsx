import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";

export default function Layout() {
    console.log("Layout rendered!");
    return (
        <div className="p-4 flex flex-col min-h-screen">
            <Header />
            <Outlet />
        </div>
    );
}
