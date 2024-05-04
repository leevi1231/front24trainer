import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dayjs from 'dayjs';
import AddTraining from './AddTraining';

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);
    const formatDate = date => dayjs(date).format('DD.MM.YYYY HH:mm');

    const columnDefs = [
        { headerName: 'Date', field: 'date', valueFormatter: params => formatDate(params.value), sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Duration', field: 'duration', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Customer', field: 'customer.firstname', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        {
            cellRenderer: params => <Button size="small" color="error" onClick={() => deleteTraining(params.data.id)}>Delete</Button>,
            flex: 1, cellStyle: { textAlign: 'left' }
        }
    ];

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => setTrainings(data))
            .catch(error => console.error('Error fetching trainings:', error));
    };

    const addTraining = newTraining => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTraining)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to add training');
                }
            })
            .then(() => {
                fetchTrainings();
            })
            .catch(error => console.error('Error adding training:', error));
    };

    const deleteTraining = (id) => {
        if (window.confirm("Delete training?")) {
            const url = `https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${id}`;
            fetch(url, { method: "DELETE" })
                .then(response => {
                    if (!response.ok)
                        throw new Error("Error in deletion: " + response.statusText);
                    return response.json();
                })
                .then(() => fetchTrainings())
                .catch(err => console.error(err))
        }
    };

    const gridOptions = {
        domLayout: 'autoHeight',
        autoSizeColumns: true
    };

    return (
        <div className="ag-theme-alpine" style={{ width: '100%' }}>
            <br />
            <AgGridReact
                rowData={trainings}
                columnDefs={columnDefs}
                gridOptions={gridOptions}
                pagination={true}
                paginationPageSize={10}
            />
            <br />
            <AddTraining addTraining={addTraining} />
        </div>
    );
};

export default Trainings;
