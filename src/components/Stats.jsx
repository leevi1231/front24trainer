import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

const Stats = () => {
    const [activityStats, setActivityStats] = useState([]);

    useEffect(() => {
        fetchActivityStats();
    }, []);

    const fetchActivityStats = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => {
                const groupedData = _.groupBy(data, 'activity');
                const activityStatsData = Object.keys(groupedData).map(activity => ({
                    activity: activity,
                    duration: _.sumBy(groupedData[activity], 'duration')
                }));
                setActivityStats(activityStatsData);
            })
            .catch(error => console.error('Error fetching activity stats:', error));
    };

    return (
        <>
            <h2>Activity Statistics</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ marginLeft: '-100px' }}>
                    <BarChart
                        width={900}
                        height={500}
                        data={activityStats}
                        style={{ margin: 'auto', marginLeft: '50px' }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="activity" />
                        <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />

                        <Tooltip />
                        <Bar dataKey="duration" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </>
    );
};

export default Stats;
