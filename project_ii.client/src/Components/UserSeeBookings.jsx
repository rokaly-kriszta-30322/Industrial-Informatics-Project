/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserSeeBookings = ({ userId }) => {
    const [bookings, setBookings] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [showBookings, setShowBookings] = useState(false);

    useEffect(() => {
        const userId = parseInt(sessionStorage.getItem('userId'));
        if (userId) {
            axios.get(`https://localhost:7209/Fitness_App/GetBookingByUser/${userId}`)
                .then(response => {
                    setBookings(response.data);
                })
                .catch(error => {
                    console.error('Error fetching bookings:', error);
                    alert('Error fetching bookings. Please try again later.');
                });
            axios.get(`https://localhost:7209/Fitness_App/GetAllTrainers`)
                .then(response => {
                    setTrainers(response.data);
                })
                .catch(error => {
                    console.error('Error fetching trainers:', error);
                    alert('Error fetching trainers. Please try again later.');
                });
        }
    }, [userId]);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const formatBooking = (booking) => {
        const dayName = dayNames[booking.day];
        const hour = booking.hour.toString().padStart(2, '0') + ":00";
        const trainer = trainers.find(t => t.trainer_id === booking.trainer_id);
        const trainer_name = trainer ? trainer.trainer_name : 'Unknown';
        return `Day: ${dayName}, Hour: ${hour}, Trainer: ${trainer_name}`;
    };

    const handleViewBookings = () => setShowBookings(true);
    const handleHideBookings = () => setShowBookings(false);

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
            <h3>See Bookings</h3>
            <div>
                {!showBookings && <button onClick={handleViewBookings}>View</button>}
                {showBookings && <button onClick={handleHideBookings}>Hide</button>}
            </div>

            {showBookings && (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking.booking_id}>
                            {formatBooking(booking)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSeeBookings;
