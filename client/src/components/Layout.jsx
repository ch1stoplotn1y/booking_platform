import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
    console.log("Layout rendered!");
    return (
        <div className="py-4 px-10 flex flex-col min-h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
