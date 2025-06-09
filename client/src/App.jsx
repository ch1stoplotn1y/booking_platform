import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import Layout from "./components/Layout.jsx";
import MainPage from "./pages/MainPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import axios from "axios";
import UserContextProvider from "./contexts/UserContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import AddPropertyForm from "./pages/AddPropertyForm.jsx";
import SinglePlacePage from "./pages/SinglePropertyPage.jsx";
import SingleBookingPage from "./pages/SingleBookingPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile/account" element={<ProfilePage />} />
                    <Route
                        path="/profile/properties"
                        element={<PropertiesPage />}
                    />
                    <Route
                        path="/profile/properties/new"
                        element={<AddPropertyForm />}
                    />
                    <Route
                        path="/profile/properties/:id"
                        element={<AddPropertyForm />}
                    />
                    <Route path="/property/:id" element={<SinglePlacePage />} />
                    <Route
                        path="/profile/bookings"
                        element={<BookingsPage />}
                    />
                    <Route
                        path="/profile/bookings/:id"
                        element={<SingleBookingPage />}
                    />
                </Route>
            </Routes>
        </UserContextProvider>
    );
}

export default App;
