/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingFormComponent from './BookingFormComponent';

const PoolsComponent = ({ userId }) => {
    const [trainerId, setTrainerId] = useState(null);
    const [trainerName, setTrainerName] = useState('');
    const [pools, setPools] = useState([]);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {

        axios.get(`https://localhost:7209/Fitness_App/GetSwimmingTrainer`)
            .then(response => {
                const trainer = response.data;
                if (trainer) {
                    setTrainerId(trainer.trainer_id); 
                    setTrainerName(trainer.trainer_name);
                }
            })
            .catch(error => console.error('Error fetching trainer:', error));

        axios.get('https://localhost:7209/Fitness_App/GetAllPools')
            .then(response => setPools(response.data))            
            .catch(error => console.error('Error fetching pools:', error)); 
    }, []);

    const showList = () => setIsVisible(true);
    const hideList = () => setIsVisible(false);

    const checkSubscription = async (userId, utilityType) => {
        userId = parseInt(sessionStorage.getItem('userId'));
        try {
            const response = await axios.get(`https://localhost:7194/Fitness_App/CheckSubscription/${userId}/${utilityType}`);
            return response.data;
        } catch (error) {

            return false;
        }
    };

    const handleBookingSubmit = async (data) => {

        const hasSubscription = await checkSubscription(userId, 'gym');
        if (!hasSubscription) {
            toast.error("You don't have an active subscription for the Pools. Please subscribe first.")
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

        <div className="pool-container">
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
                <h2>Swimming Trainer: {trainerName}</h2>
                <b><p>About our trainer:</p>
                <p className="paragraph-with-image">
                    <img src="/pics/swimmingtrainer.jpg" alt="Trainer Icon" className="inline-icon" />
                    Richard Wilson is a seasoned swimming instructor dedicated to
                    helping clients achieve their aquatic goals. With over eight years of experience in teaching
                    and coaching, Richard is certified by the National Swimming Trainers Association.
                    Known for his patient and motivating approach, Richard specializes in technique refinement,
                    endurance training, and water safety. He develops personalized training programs
                    tailored to swimmers of all levels, from beginners to advanced athletes. Richards
                    expertise and passion for swimming ensure that every session is productive and enjoyable,
                    making him a trusted guide on your journey to aquatic excellence.</p>
                <p>About our Pools Complex</p>
                <p>Dive into luxury and fitness at Aqua Pool Complex, where our  facilities offer something
                    for everyone. Our complex features a range of pools, including a large lap pool for
                    serious swimmers, a relaxing jacuzzi for unwinding, and a family-friendly recreational
                    pool. Each area is designed to provide a unique aquatic experience, whether youre
                    training for a competition, looking to relax, or enjoying a day with the family. We
                    believe that this is the perfect place to improve your swimming skills, relax, and stay
                    healthy.</p>
                <p>Available Pools:</p>
                {!isVisible && <button onClick={showList}>View</button>}
                {isVisible && (
                    <>
                        <ul>
                            {pools.map(pool => (
                                <li key={pool.pool_id}>
                                    -Name: {pool.pool_name} - Depth: {pool.pool_depth} m, Temp: {pool.temp} degrees C
                                </li>
                            ))}
                        </ul>
                        <button onClick={hideList}>Hide</button>
                    </>
                    )}
                </b>
            
                <BookingFormComponent onSubmit={handleBookingSubmit} userId={userId} trainerId={trainerId} />
            </div>
        </div>
    );
};

export default PoolsComponent;