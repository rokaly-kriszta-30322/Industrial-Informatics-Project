/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SeeSubscriptions from './SeeSubscriptions';
import SeeBookings from './SeeBookings';

const ClimbingManagementComponent = () => {
    const [trainerName, setTrainerName] = useState('');
    const [walls, setWalls] = useState([]);
    const [showWalls, setShowWalls] = useState(false);
    const [newWallData, setNewWallData] = useState({
        wall: '',
        level: ''
    });
    const [updateWallData, setUpdateWallData] = useState({
        id: null,
        wall: '',
        level: ''
    });
    const [updatingWallId, setUpdatingWallId] = useState(null);
    const [trainerType, setTrainerType] = useState('');

    const fetchWalls = () => {
        axios.get(`https://localhost:7209/Fitness_App/GetClimbingTrainer`)
            .then(response => setTrainerName(response.data.trainer_name))
            .catch(error => console.error('Error fetching trainer:', error));
        axios.get('https://localhost:7209/Fitness_App/GetAllWalls')
            .then(response => setWalls(response.data))
            .catch(error => console.error('Error fetching walls:', error));
    };

    const fetchTrainerType = () => {
        axios.get('https://localhost:7194/Fitness_App/GetClimbingTrainer')
            .then(response => {

                setTrainerType(response.data.type);
            })
            .catch(error => console.error('Error fetching trainer type:', error));
    };

    useEffect(() => {
        fetchWalls();
    }, []);

    const handleView = () => {
        fetchWalls();
        setShowWalls(true);
    };

    const handleAdd = () => {
        axios.post('https://localhost:7209/Fitness_App/AddWall', {
            wall: newWallData.wall,
            level: newWallData.level
        })
            .then(response => {
                console.log('Wall added successfully:', response.data);
                setWalls([...walls, response.data]);
                setNewWallData({
                    wall: '',
                    level: ''
                });
            })
            .catch(error => console.error('Error adding wall:', error));
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7209/Fitness_App/DeleteWall/${id}`)
            .then(response => {
                console.log('Wall deleted successfully:', response.data);
                setWalls(walls.filter(wall => wall.climbing_id !== id));
            })
            .catch(error => console.error('Error deleting wall:', error));
    };

    const handleUpdate = () => {
        const { id, wall, level } = updateWallData;
        axios.put(`https://localhost:7209/Fitness_App/UpdateWall/${id}`, { wall: wall, level: level })
            .then(response => {
                console.log('Wall updated successfully:', response.data);
                setWalls(walls.map(wall => {
                    if (wall.climbing_id === id) {
                        return { ...wall, wallData: wall, level: level };
                    }
                    return wall;
                }));
                setUpdateWallData({
                    id: null,
                    wall: '',
                    level: ''
                });
                setUpdatingWallId(null);
            })
            .catch(error => console.error('Error updating wall:', error));
    };

    const handleUpdateClick = (id) => {
        setUpdatingWallId(id);
        const wallToUpdate = walls.find(wall => wall.climbing_id === id);
        setUpdateWallData({
            id: id,
            wall: wallToUpdate.wall,
            level: wallToUpdate.level
        });
    };
    const userId = parseInt(sessionStorage.getItem('userId'));
    const handleHide = () => setShowWalls(false);
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
            <div className="centered-content">
                <h1>Climbing Trainer: {trainerName}</h1>
                <SeeSubscriptions trainerType={trainerType} />
                <h2> See Walls </h2>
                <div>
                    {!showWalls && <button onClick={handleView}>View</button>}
                    {showWalls && <button onClick={handleHide}>Hide</button>}
                </div>

                {showWalls && (
                    <>
                        <h3>Available Walls:</h3>
                        <ul>
                            {walls.map(wall => (
                                <li key={wall.climbing_id}>
                                    -Wall: {wall.wall} - Level: {wall.level}
                                    <button onClick={() => handleUpdateClick(wall.climbing_id)}>Update</button>
                                    <button onClick={() => handleDelete(wall.climbing_id)}>Delete</button>
                                    {updatingWallId === wall.climbing_id && (
                                        <div>
                                            <input type="text" placeholder="Wall" value={updateWallData.wall} onChange={(e) => setUpdateWallData({ ...updateWallData, wall: e.target.value })} />
                                            <input type="text" placeholder="Level" value={updateWallData.level} onChange={(e) => setUpdateWallData({ ...updateWallData, level: e.target.value })} />
                                            <button onClick={handleUpdate}>Update</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <div>
                    <h3>Add Wall:</h3>
                    <input type="text" placeholder="Wall" value={newWallData.wall} onChange={(e) => setNewWallData({ ...newWallData, wall: e.target.value })} />
                    <input type="text" placeholder="Level" value={newWallData.level} onChange={(e) => setNewWallData({ ...newWallData, level: e.target.value })} />
                    <button onClick={handleAdd}>Add</button>
                </div>
            
                <p>See Bookings: </p>
                <SeeBookings trainerId={userId} />
            </div>
        </div>
    );
};

export default ClimbingManagementComponent;
