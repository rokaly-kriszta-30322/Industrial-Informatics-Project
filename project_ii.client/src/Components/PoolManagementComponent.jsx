/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SeeSubscriptions from './SeeSubscriptions';
import SeeBookings from './SeeBookings';

const PoolManagementComponent = () => {
    const [trainerName, setTrainerName] = useState('');
    const [pools, setPools] = useState([]);
    const [showPools, setShowPools] = useState(false); // State to manage visibility of pools
    const [newPoolData, setNewPoolData] = useState({
        name: '',
        depth: '',
        temp: ''
    });
    const [updatePoolData, setUpdatePoolData] = useState({
        id: null,
        name: '',
        depth: '',
        temp: ''
    });
    const [updatingPoolId, setUpdatingPoolId] = useState(null);
    const [trainerType, setTrainerType] = useState('');

    const fetchTrainerAndPools = () => {
        axios.get(`https://localhost:7209/Fitness_App/GetSwimmingTrainer`)
            .then(response => {
                setTrainerName(response.data.trainer_name);
                setTrainerType(response.data.type);
            })
            .catch(error => console.error('Error fetching trainer:', error));

        axios.get('https://localhost:7209/Fitness_App/GetAllPools')
            .then(response => setPools(response.data))
            .catch(error => console.error('Error fetching pools:', error));
    };

    useEffect(() => {
        fetchTrainerAndPools();
    }, []);

    const handleView = () => {
        setShowPools(true);
    };

    const handleHide = () => {
        setShowPools(false);
    };

    const handleAdd = () => {
        axios.post('https://localhost:7209/Fitness_App/AddPool', {
            pool_name: newPoolData.name,
            pool_depth: newPoolData.depth,
            temp: newPoolData.temp
        })
            .then(response => {
                console.log('Pool added successfully:', response.data);
                setPools([...pools, response.data]);
                setNewPoolData({
                    name: '',
                    depth: '',
                    temp: ''
                });
            })
            .catch(error => console.error('Error adding pool:', error));
    };

    const handleDelete = (id) => {
        axios.delete(`https://localhost:7209/Fitness_App/DeletePool/${id}`)
            .then(response => {
                console.log('Pool deleted successfully:', response.data);
                setPools(pools.filter(pool => pool.pool_id !== id));
            })
            .catch(error => console.error('Error deleting pool:', error));
    };

    const handleUpdate = () => {
        const { id, name, depth, temp } = updatePoolData;
        axios.put(`https://localhost:7209/Fitness_App/UpdatePool/${id}`, { Pool_name: name, Pool_depth: depth, Temp: temp })
            .then(response => {
                console.log('Pool updated successfully:', response.data);
                setPools(pools.map(pool => {
                    if (pool.pool_id === id) {
                        return { ...pool, pool_name: name, pool_depth: depth, temp: temp };
                    }
                    return pool;
                }));
                setUpdatePoolData({
                    id: null,
                    name: '',
                    depth: '',
                    temp: ''
                });
                setUpdatingPoolId(null);
            })
            .catch(error => console.error('Error updating pool:', error));
    };

    const handleUpdateClick = (id) => {
        setUpdatingPoolId(id);
        const poolToUpdate = pools.find(pool => pool.pool_id === id);
        setUpdatePoolData({
            id: id,
            name: poolToUpdate.pool_name,
            depth: poolToUpdate.pool_depth,
            temp: poolToUpdate.temp
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
                <h2>Swimming Pool Trainer: {trainerName}</h2>

                <SeeSubscriptions trainerType={trainerType} />

                <h2> See Swimming Pools </h2>

                <div>
                    {!showPools && <button onClick={handleView}>View</button>}
                    {showPools && <button onClick={handleHide}>Hide</button>}
                </div>

                {showPools && (
                    <>
                        <h3>Available Pools:</h3>
                        <ul>
                            {pools.map(pool => (
                                <li key={pool.pool_id}>
                                    -Name: {pool.pool_name} - Depth: {pool.pool_depth} m, Temp: {pool.temp} degrees Celsius
                                    <button onClick={() => handleUpdateClick(pool.pool_id)}>Update</button>
                                    <button onClick={() => handleDelete(pool.pool_id)}>Delete</button>
                                    {updatingPoolId === pool.pool_id && (
                                        <div>
                                            <input type="text" placeholder="Name" value={updatePoolData.name} onChange={(e) => setUpdatePoolData({ ...updatePoolData, name: e.target.value })} />
                                            <input type="number" placeholder="Depth" value={updatePoolData.depth} onChange={(e) => setUpdatePoolData({ ...updatePoolData, depth: e.target.value })} />
                                            <input type="number" placeholder="Temperature" value={updatePoolData.temp} onChange={(e) => setUpdatePoolData({ ...updatePoolData, temp: e.target.value })} />
                                            <button onClick={handleUpdate}>Update</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div>
                            <h3>Add Pool:</h3>
                            <input type="text" placeholder="Name" value={newPoolData.name} onChange={(e) => setNewPoolData({ ...newPoolData, name: e.target.value })} />
                            <input type="number" placeholder="Depth" value={newPoolData.depth} onChange={(e) => setNewPoolData({ ...newPoolData, depth: e.target.value })} />
                            <input type="number" placeholder="Temperature" value={newPoolData.temp} onChange={(e) => setNewPoolData({ ...newPoolData, temp: e.target.value })} />
                            <button onClick={handleAdd}>Add</button>
                        </div>
                    </>
                )}

                <SeeBookings trainerId={userId} />
            </div>

        </div>
    );
};

export default PoolManagementComponent;
