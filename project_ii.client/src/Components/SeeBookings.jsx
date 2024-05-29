/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const SeeBookings = ({ trainerId }) => {
    const [bookings, setBookings] = useState([]);
    const [showBookings, setShowBookings] = useState(false);

    useEffect(() => {
        if (trainerId) {
            axios.get(`https://localhost:7209/Fitness_App/GetBookingByTrainer/${trainerId}`)
                .then(response => {
                    const today = new Date();
                    const todayDayOfWeek = today.getDay();
                    const currentHour = today.getHours();

                    const filteredBookings = response.data.filter(booking => {
                        return booking.day > todayDayOfWeek || (booking.day === todayDayOfWeek && booking.hour >= currentHour);
                    });

                    setBookings(filteredBookings);
                })
                .catch(error => console.error('Error fetching bookings:', error));
        }
    }, [trainerId]);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const formatBooking = (booking) => {
        const dayName = dayNames[booking.day];
        const hour = booking.hour.toString().padStart(2, '0') + ":00";
        return `Day:${ dayName }, Hour: ${ hour }, User: ${ booking.user_name }`;
    };

    const groupBookingsByDay = (bookings) => {
        return bookings.reduce((acc, booking) => {
            const dayName = dayNames[booking.day];
            if (!acc[dayName]) {
                acc[dayName] = [];
            }
            acc[dayName].push(booking);
            return acc;
        }, {});
    };

    const handleViewBookings = () => setShowBookings(true);
    const handleHideBookings = () => setShowBookings(false);

    const groupedBookings = groupBookingsByDay(bookings);

    const orderedDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div>

            <h3>See Bookings</h3>
            <div>
                {!showBookings && <button onClick={handleViewBookings}>View</button>}
                {showBookings && <button onClick={handleHideBookings}>Hide</button>}
            </div>

            {showBookings && (
                <div>
                    {orderedDayNames.map(day => (
                        groupedBookings[day] && (
                            <div key={day}>
                                <h4>{day}</h4>
                                <ul>
                                    {groupedBookings[day].map(booking => (
                                        <li key={booking.booking_id}>
                                            {formatBooking(booking)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default SeeBookings;