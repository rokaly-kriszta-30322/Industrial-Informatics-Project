/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Subs = () => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [subscriptionType, setSubscriptionType] = useState('gym');
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleSubscriptionTypeChange = (event) => {
        setSubscriptionType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userId = sessionStorage.getItem('userId');
        console.log("subscription type:", subscriptionType);

        try {
            const checkSubscriptionResponse = await axios.get(`https://localhost:7209/Fitness_App/CheckSubscription/${userId}/${subscriptionType}`);
            if (checkSubscriptionResponse.data) {
                toast.error(`You're already subscribed to the ${subscriptionType} facility.`);
                return;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No existing subscription found, create a new subscription.");
            } else {
                toast.error('Error checking subscription. Please try again.');
                return;
            }
        }

        try {
            const response = await axios.post('https://localhost:7209/Fitness_App/Subscribe', {
                type: subscriptionType,
                time_sub: startDate,
                user_id: userId
            });

            if (response.status === 200) {
                toast.success(`Thanks for being part of our team! You're successfully subscribed to our ${subscriptionType} facility!`);
                navigate('/home');
            } else {
                console.error('Subscription failed:', response.statusText);
            }
        } catch (error) {
            toast.error('Subscription failed. Please try again.');
        }

        setName('');
        setStartDate('');
    };

    return (
        <div>
            <div className="navbar">
                <nav>
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/pools">Pools</Link></li>
                        <li><Link to="/gym">Gym</Link></li>
                        <li><Link to="/climbing">Climbing</Link></li>
                        <li><Link to="/subs">Make a subscription</Link></li>
                        <li><Link to="/userseebookings">See bookings</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </nav>
            </div>
            <h2>Subscribe</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="subscriptionType">Subscription Type:</label>
                    <select id="subscriptionType" value={subscriptionType} onChange={handleSubscriptionTypeChange}>
                        <option value="gym">Gym</option>
                        <option value="pool">Pool</option>
                        <option value="climbing">Climbing</option>
                    </select>
                </div>
                <button type="submit">Subscribe</button>
            </form>
        </div>
    );
};

export default Subs;