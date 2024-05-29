/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { Link } from 'react-router-dom';

const AdminMenuComponent = ({ isAdmin }) => {
    const userId = parseInt(sessionStorage.getItem('userId'));
    return (
        <div className="management">
        <div className="navbar">
            <nav>
                <ul>
                    {(userId === 2) && <li><Link to="/poolsman">Pool Management</Link></li>}
                    {(userId === 1) && <li><Link to="/gymman">Gym Management</Link></li>}
                    {(userId === 3) && <li><Link to="/climbingman">Wall Management</Link></li>}
                    <li><Link to="/admin_menu">Home</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </nav>
        </div>
        <div>
            <h2>Welcome!</h2>
        </div>
        </div>
    );
};

export default AdminMenuComponent;
