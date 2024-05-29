/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SeeSubscriptions from './SeeSubscriptions';
import SeeBookings from './SeeBookings';

const GymManagementComponent = () => {
    const [trainerName, setTrainerName] = useState('');
    const [equipments, setEquipments] = useState([]);
    const [showEquipments, setShowEquipments] = useState(false);
    const [newEquipmentData, setNewEquipmentData] = useState({
        equipment_name: '',
        body: ''
    });
    const [updateEquipmentData, setUpdateEquipmentData] = useState({
        id: null,
        equipment_name: '',
        body: ''
    });
    const [updatingEquipmentId, setUpdatingEquipmentId] = useState(null);

    const fetchEquipments = () => {
        axios.get(`https://localhost:7209/Fitness_App/GetGymTrainer`)
            .then(response => setTrainerName(response.data.trainer_name))
            .catch(error => console.error('Error fetching trainer:', error));
        axios.get('https://localhost:7209/Fitness_App/GetAllEquipments')
            .then(response => setEquipments(response.data))
            .catch(error => console.error('Error fetching equipments:', error));
    };

    const [trainerType, setTrainerType] = useState('');
    const fetchTrainerType = () => {
        axios.get('https://localhost:7194/Fitness_App/GetGymTrainer')
            .then(response => {

                setTrainerType(response.data.type);
            })
            .catch(error => console.error('Error fetching trainer type:', error));
    };

    useEffect(() => {
        fetchEquipments();
        fetchTrainerType();
    }, []);

    const handleView = () => setShowEquipments(true);
    const handleHide = () => setShowEquipments(false);

    const handleAdd = () => {
        axios.post('https://localhost:7209/Fitness_App/AddEquipment', {
            equipment_name: newEquipmentData.equipment_name,
            body: newEquipmentData.body
        })
            .then(response => {
                console.log('Equipment added successfully:', response.data);
                setEquipments([...equipments, response.data]);
                setNewEquipmentData({
                    equipment_name: '',
                    body: ''
                });
            })
            .catch(error => console.error('Error adding equipment:', error));
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7209/Fitness_App/DeleteEquipment/${id}`)
            .then(response => {
                console.log('Equipment deleted successfully:', response.data);
                setEquipments(equipments.filter(equipment => equipment.equipment_id !== id));
            })
            .catch(error => console.error('Error deleting equipment:', error));
    };

    const handleUpdate = () => {
        const { id, equipment_name, body } = updateEquipmentData;
        axios.put(`https://localhost:7209/Fitness_App/UpdateEquipment/${id}`, { equipment_name: equipment_name, body: body })
            .then(response => {
                console.log('Equipment updated successfully:', response.data);
                setEquipments(equipments.map(equipment => {
                    if (equipment.equipment_id === id) {
                        return { ...equipment, equipment_name: equipment_name, body: body };
                    }
                    return equipment;
                }));
                setUpdateEquipmentData({
                    id: null,
                    equipment_name: '',
                    body: ''
                });
                setUpdatingEquipmentId(null);
            })
            .catch(error => console.error('Error updating equipment:', error));
    };

    const handleUpdateClick = (id) => {
        setUpdatingEquipmentId(id);
        const equipmentToUpdate = equipments.find(equipment => equipment.equipment_id === id);
        setUpdateEquipmentData({
            id,
            equipment_name: equipmentToUpdate.equipment_name,
            body: equipmentToUpdate.body
        });
    };
    const userId = parseInt(sessionStorage.getItem('userId'));
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
                <h1>Gym Trainer: {trainerName}</h1>
                <SeeSubscriptions trainerType={trainerType} />

                <h2> See Equipments </h2>
                <div>
                    {!showEquipments && <button onClick={handleView}>View</button>}
                    {showEquipments && <button onClick={handleHide}>Hide</button>}
                </div>

                {showEquipments && (
                    <>
                        <h3>Available Equipments:</h3>
                        <ul>
                            {equipments.map(equipment => (
                                <li key={equipment.equipment_id}>
                                    - Name: {equipment.equipment_name} - Body: {equipment.body}
                                    <button onClick={() => handleUpdateClick(equipment.equipment_id)}>Update</button>
                                    <button onClick={() => handleDelete(equipment.equipment_id)}>Delete</button>
                                    {updatingEquipmentId === equipment.equipment_id && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={updateEquipmentData.equipment_name}
                                                onChange={(e) => setUpdateEquipmentData({ ...updateEquipmentData, equipment_name: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Body"
                                                value={updateEquipmentData.body}
                                                onChange={(e) => setUpdateEquipmentData({ ...updateEquipmentData, body: e.target.value })}
                                            />
                                            <button onClick={handleUpdate}>Update</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div>
                            <h3>Add Equipment:</h3>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newEquipmentData.equipment_name}
                                onChange={(e) => setNewEquipmentData({ ...newEquipmentData, equipment_name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Body"
                                value={newEquipmentData.body}
                                onChange={(e) => setNewEquipmentData({ ...newEquipmentData, body: e.target.value })}
                            />
                            <button onClick={handleAdd}>Add</button>
                        </div>
                    </>
                )}

                <p>See Bookings: </p>
                <SeeBookings trainerId={userId} />
            </div>

        </div>
    );
};

export default GymManagementComponent;
