/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { createContext, useState, useEffect } from 'react';
import UserComponent from './Components/Login';
import GymComponent from './Components/GymComponent';
import PoolsComponent from './Components/PoolsComponent';
import ClimbingComponent from './Components/ClimbingComponent';
import GymManagementComponent from './Components/GymManagementComponent';
import PoolManagementComponent from './Components/PoolManagementComponent';
import ClimbingManagementComponent from './Components/ClimbingManagementComponent';
import Subs from './Components/Subs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './index.css';
import HomePage from './Components/HomePage';
import SeeSubscriptions from './Components/SeeSubscriptions';
import UserSeeBookings from './Components/UserSeeBookings';
import AdminMenuComponent from "./Components/Admin_Menu";

const LogoutComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {

        sessionStorage.removeItem('userId');

        navigate('/');
    }, [navigate]);

    return null;
};

function App() {
    const [user, setUser] = useState(false);

    return (
        <div id="root">
            <ToastContainer />
                <BrowserRouter>
                    <div className="app-container">
                        {user} { }
                        <Routes>
                            <Route exact path="/" element={<UserComponent setUser={setUser} />} />
                            <Route exact path="/home" element={<HomePage />} />
                            <Route path="/subs" element={<Subs />} />
                            <Route path="/logout" element={<LogoutComponent />} /> {/* Logout route */}
                            <Route path="/gym" element={<GymComponent />} />
                            <Route path="/pools" element={<PoolsComponent />} />
                            <Route path="/climbing" element={<ClimbingComponent />} />
                            <Route path="/gymman" element={<GymManagementComponent />} />
                            <Route path="/poolsman" element={<PoolManagementComponent />} />
                            <Route path="/climbingman" element={<ClimbingManagementComponent />} />
                            <Route path="/seesubs" element={<SeeSubscriptions />} />
                            <Route path="/userseebookings" element={<UserSeeBookings />} />
                            <Route path="/admin_menu" element={<AdminMenuComponent />} />
                        </Routes>
                    </div>
                </BrowserRouter>
        </div>
    );
}

export default App;
