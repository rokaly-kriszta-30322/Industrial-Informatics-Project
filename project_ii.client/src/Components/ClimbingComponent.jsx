/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingFormComponent from './BookingFormComponent';

const ClimbingComponent = ({ userId }) => {
    const [trainerId, setTrainerId] = useState(null);
    const [trainerName, setTrainerName] = useState('');
    const [climbing, setClimbing] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        axios.get(`https://localhost:7209/Fitness_App/GetClimbingTrainer`)
            .then(response => {
                const trainer = response.data;
                if (trainer) {
                    setTrainerId(trainer.trainer_id);
                    setTrainerName(trainer.trainer_name);
                }
            })
            .catch(error => console.error('Error fetching trainer:', error));

        axios.get('https://localhost:7209/Fitness_App/GetAllWalls')
            .then(response => {
                const climbingRoutes = response.data.reduce((acc, climb) => {
                    if (!acc[climb.level]) {
                        acc[climb.level] = [];
                    }
                    acc[climb.level].push(climb);
                    return acc;
                }, {});
                setClimbing(climbingRoutes);
            })
            .catch(error => console.error('Error fetching climbing routes:', error));
    }, []);
    const showList = () => setIsVisible(true);
    const hideList = () => setIsVisible(false);

    const checkSubscription = async (userId, utilityType) => {
        userId = parseInt(sessionStorage.getItem('userId'));
        try {
            const response = await axios.get(`https://localhost:7209/Fitness_App/CheckSubscription/${userId}/${utilityType}`);
            return response.data;
        } catch (error) {
            console.error(`Error checking subscription for ${utilityType}:`, error);
            return false;
        }
    };

    const handleBookingSubmit = async (data) => {

        const hasSubscription = await checkSubscription(userId, 'climbing');
        if (!hasSubscription) {
            toast.error("You don't have an active subscription for Climbing. Please subscribe first.")
            return;
        }

        try {
            const response = await axios.post('https://localhost:7209/Fitness_App/AddBooking', data);
            if (response.status === 200) {
                toast.success(`Thank you! You've succesfully booked your spot at our Climbing facility!`);

         } else {
                console.error('Subscription failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during booking:', error);
        }
    }

    return (

        <div className="climbing-container">
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
            <div className="centered-content">
                <h2>Climbing Trainer: {trainerName}</h2>
                <b><p>About our trainer:</p>
                <p className="paragraph-with-image">
                    <img src="/pics/climbingtrainer.jpg" alt="Trainer Icon" className="inline-icon" />

                    Jack Moore is an experienced climbing trainer with a passion for helping clients conquer new heights. Certified by the National Climbing Trainers Association, Jack has over six years of experience in both indoor and outdoor climbing. Known for his encouraging and methodical teaching style, he specializes in technique improvement, strength building, and overcoming mental barriers. Jack creates customized training plans that cater to climbers of all levels, from beginners to advanced enthusiasts. Committed to your climbing journey, Jack is here to support and guide you every step of the way.</p>

                <p>About our Climbing Gym: </p>
                <p> Welcome to Skyline Climbing Gym, where the thrill of scaling towering structures meets top-notch fitness training. Our gym is uniquely themed around the exhilarating experience of climbing tall buildings, providing an urban adventure within a safe and supportive environment. Featuring a wide variety of climbing walls designed to resemble iconic skyscrapers, our facility caters to climbers of all skill levels. Whether youre a beginner looking to learn the basics or an experienced climber aiming to reach new heights, Skyline Climbing Gym offers personalized training plans, expert instruction, and state-of-the-art equipment. Join us! </p>
                <p>Available Climbing routes:</p>
                {!isVisible && <button onClick={showList}>View</button>}
                {isVisible && (
                    <>
                        {Object.entries(climbing).map(([level, routes]) => (
                            <div key={level}>
                                <h4>{level}</h4>
                                <ul>
                                    {routes.map(route => (
                                        <li key={route.climbing_id}>
                                            Name: {route.wall}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button onClick={hideList}>Hide</button>
                    </>
                )}
                </b>

                <BookingFormComponent onSubmit={handleBookingSubmit} userId={userId} trainerId={trainerId} />
            </div>
            
        </div>
    );
};

export default ClimbingComponent;
