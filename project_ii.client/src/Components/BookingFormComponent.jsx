/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const BookingFormComponent = ({ onSubmit, userId, trainerId }) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);

    userId = parseInt(sessionStorage.getItem('userId'));

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
    };

    const handleHourChange = (e) => {
        setSelectedHour(e.target.value);
    };

    const handleFormSubmit = async () => {
        if (selectedDay && selectedHour) {
            const selectedDate = new Date(selectedDay);
            const day = selectedDate.getDay();
            const hour = parseInt(selectedHour.split(":")[0]);

            try {
                const response = await axios.get(`https://localhost:7209/Fitness_App/GetBookingsByUserAndTrainer/${userId}/${trainerId}`);
                const existingBookings = response.data;

                if (existingBookings.some(booking => booking.day === day && booking.hour === hour)) {
                    toast.error("You have already booked a session for the selected date and hour.");
                    return;
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {

                    console.log("No existing bookings found, create a new booking.");
                } else {

                    toast.error("Error while fetching existing bookings. Please try again.");
                    return;
                }
            }

            const bookingData = {
                booking_id: 0,
                day: day,
                hour: hour,
                user_id: userId,
                trainer_id: trainerId
            };

            onSubmit(bookingData);
        }
    };

    const getNext7Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days;
    };


    const getDisabledHours = () => {
        const today = new Date();
        const currentHour = today.getHours();
        const currentHourFormatted = `${ currentHour < 10 ? '0' + currentHour : currentHour}:00;`
        const disabledHours = [];



    if (selectedDay === today.toISOString().split('T')[0]) {
        const previousHours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
        const currentHourIndex = previousHours.indexOf(currentHourFormatted);

        if (currentHourIndex != -1) {
            disabledHours.push(...previousHours.slice(0, currentHourIndex + 1));
        }
    }

    return disabledHours;
};

const disabledHours = getDisabledHours();

return (
    <div>
        <h3>Book a session with our specialized trainer: </h3>
        <label>Select Day:</label>
        <input
            type="date"
            min={getNext7Days()[0]}
            max={getNext7Days()[6]}
            onChange={handleDayChange}
        />
        <label>Select Hour:</label>
        <select onChange={handleHourChange} defaultValue="">
            {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map(hour => (
                <option key={hour} value={hour} disabled={disabledHours.includes(hour)}>
                    {hour} -{parseInt(hour.split(":")[0]) + 2}:00
                </option>
            ))}
        </select>
        <button onClick={handleFormSubmit}>Book</button>
    </div>
);
};

export default BookingFormComponent;