/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const HomePage = ({userId }) => {
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

            <div>
                <h1>Welcome to Our Gym!</h1>
                <p>We are thrilled to have you here. Whether youre a beginner or a seasoned athlete, we have everything you need to reach your fitness goals.</p>
                <h2>Gym</h2>
                <p>Our fully-equipped gym offers a wide range of cardio and strength training equipment to help you build muscle, lose weight, and improve your overall fitness.</p>
                <h2>Swimming Pools</h2>
                <p>Dive into our refreshing swimming pools and enjoy a low-impact workout or simply relax and unwind after a long day.</p>
                <h2>Climbing</h2>
                <p>Challenge yourself on our indoor climbing walls, designed for climbers of all skill levels. Reach new heights and conquer your fears!</p>
            </div>
        </div>
    );
};

export default HomePage;