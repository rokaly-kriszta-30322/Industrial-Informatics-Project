/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SeeSubscriptions = ({ trainerType }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [showSubscriptions, setShowSubscriptions] = useState(false);

    useEffect(() => {
        if (trainerType) {
            axios.get(`https://localhost:7194/Fitness_App/GetSubscriptionByTrainer/${trainerType}`)
                .then(response => {
                    const sortedSubscriptions = response.data.sort((a, b) => a.user_name.localeCompare(b.user_name));
                    setSubscriptions(sortedSubscriptions);
                })
                .catch(error => console.error('Error fetching subscriptions:', error));
        }
    }, [trainerType]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateEndDate = (startDate) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);
        return endDate.toDateString();
    };

    const userId = parseInt(sessionStorage.getItem('userId'));
    const handleViewSubs = () => setShowSubscriptions(true);
    const handleHideSubs = () => setShowSubscriptions(false);

    return (
        <div>
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


            <h3>See Subscriptions</h3>
            <div>
                {!showSubscriptions && <button onClick={handleViewSubs}>View</button>}
                {showSubscriptions && <button onClick={handleHideSubs}>Hide</button>}
            </div>

            {showSubscriptions && (
                <ul>
                    {subscriptions.map(subscription => (
                        <li key={subscription.subscription_id}>
                            User: {subscription.user_name}, Start Date: {subscription.time_sub}, End Date: {calculateEndDate(subscription.time_sub)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SeeSubscriptions;
