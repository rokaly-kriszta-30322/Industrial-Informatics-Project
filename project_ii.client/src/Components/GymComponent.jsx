/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookingFormComponent from './BookingFormComponent';
import { toast } from 'react-toastify';

const GymComponent = ({ userId }) => {
    const [trainerId, setTrainerId] = useState(null);
    const [trainerName, setTrainerName] = useState('');
    const [equipmentByBodyPart, setEquipmentByBodyPart] = useState([]);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {

        axios.get(`https://localhost:7209/Fitness_App/GetGymTrainer`)
            .then(response => {
                const trainer = response.data;
                if (trainer) {
                    setTrainerId(trainer.trainer_id);
                    setTrainerName(trainer.trainer_name);
                }
            })
            .catch(error => console.error('Error fetching trainer:', error));

        axios.get('https://localhost:7209/Fitness_App/GetAllEquipments')
            .then(response => {
                const equipment = response.data;
                const equipmentGroupedByBodyPart = equipment.reduce((acc, equip) => {
                    if (!acc[equip.body]) {
                        acc[equip.body] = [];
                    }
                    acc[equip.body].push(equip);
                    return acc;
                }, {});
                setEquipmentByBodyPart(equipmentGroupedByBodyPart);
            })
            .catch(error => console.error('Error fetching equipment:', error));
    }, []);

    const showList = () => setIsVisible(true);
    const hideList = () => setIsVisible(false);

    const checkSubscription = async (userId, utilityType) => {
        userId = parseInt(sessionStorage.getItem('userId'));

        try {
            const response = await axios.get(`https://localhost:7209/Fitness_App/CheckSubscription/${userId}/${utilityType}`);
            return response.data;
        } catch (error) {
            return false;
        }
    };

    const handleBookingSubmit = async (data) => {
        const hasSubscription = await checkSubscription(userId, 'gym');
        if (!hasSubscription) {
            toast.error("You don't have an active subscription for Gym. Please subscribe first.");
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
        <div className="gym-container">
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

                <h2>Gym Trainer: {trainerName}</h2>
                <b><p>About our trainer:</p>
                <p className="paragraph-with-image">
                    <img src="/pics/gymtrainer.jpg" alt="Trainer Icon" className="inline-icon" />
                    Andrew Miller is a dedicated gym trainer with over five years of experience in helping clients achieve their fitness goals. He is certified by the Elite Trainers Association. Known for his approachable and supportive coaching style, Andrew specializes in strength training, weight loss, and functional fitness. He has successfully worked with a diverse range of clients, from beginners to seasoned athletes, creating personalized workout plans that are both effective and enjoyable. Andrew is committed to guiding you every step of the way on your fitness journey.
                </p>

                <p>About our gym: </p>
                <p>Our gym offers a comprehensive range of services designed to meet all your fitness needs. We provide modern gym equipment for both strength training and cardio, ensuring you have the latest tools to enhance your workouts. Our personal training sessions are tailored to help you reach your individual fitness goals with the guidance of experienced trainers. Additionally, we offer nutritional counseling to support your overall health and wellness, helping you make informed dietary choices. These are just a few of the many benefits our gym membership provides. Join us to get in shape and stay healthy in a supportive and well-equipped environment.</p>

                <p>Available Equipments:</p>
                {!isVisible && <button onClick={showList}>View</button>}
                {isVisible && (
                    <>
                        {Object.entries(equipmentByBodyPart).map(([bodyPart, equipments]) => (
                            <div key={bodyPart}>
                                <h3>{bodyPart}</h3>
                                <ul>
                                    {equipments.map(equipment => (
                                        <li key={equipment._id}>
                                            - Name: {equipment.equipment_name}
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

export default GymComponent;