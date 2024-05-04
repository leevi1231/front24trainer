import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from "@mui/material/Button";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { CSVLink } from 'react-csv';

import EditCustomer from './EditCustomer';
import AddCustomer from './AddCustomer';

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    const columnDefs = [
        { headerName: 'First Name', field: 'firstname', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Address', field: 'streetaddress', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'City', field: 'city', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Email', field: 'email', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true, flex: 1, cellStyle: { textAlign: 'left' } },
        {
            cellRenderer: params => <EditCustomer data={params.data} updateCustomer={updateCustomer} />,
            flex: 1, cellStyle: { textAlign: 'left' }
        },
        {
            cellRenderer: params => <Button size="small" color="error" onClick={() => deleteCustomer(params.data._links.customer.href)}>Delete</Button>,
            flex: 1, cellStyle: { textAlign: 'left' }
        }
    ];

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data._embedded.customers))
            .catch(error => console.error('Error fetching customers:', error));
    }

    const addCustomer = newCustomer => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCustomer)
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error when adding customer: " + response.statusText);
                return response.json();
            })
            .then(() => handleFetch())
            .catch(err => console.error(err))
    }

    const updateCustomer = (url, updatedCustomer) => {
        fetch(url, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(updatedCustomer)
        })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error when updating customer: " + response.statusText);
                return response.json();
            })
            .then(() => handleFetch())
            .catch(err => console.error(err))
    }

    const deleteCustomer = (url) => {
        if (window.confirm("Delete customer?")) {
            fetch(url, { method: "DELETE" })
                .then(response => {
                    if (!response.ok)
                        throw new Error("Error in deletion: " + response.statusText);
                    return response.json();
                })
                .then(() => handleFetch())
                .catch(err => console.error(err))
        }
    }

    const csvData = customers.map(customer => ({
        'First Name': customer.firstname,
        'Last Name': customer.lastname,
        'Address': customer.streetaddress,
        'Postcode': customer.postcode,
        'City': customer.city,
        'Email': customer.email,
        'Phone': customer.phone
    }));

    const gridOptions = {
        domLayout: 'autoHeight',
        autoSizeColumns: true
    };

    return (
        <>
            <br />
            <CSVLink data={csvData} filename={"customers.csv"}>
                Export to CSV
            </CSVLink>
            <br />
            <div className="ag-theme-alpine" style={{ width: '100%' }}>

                <AgGridReact
                    rowData={customers}
                    columnDefs={columnDefs}
                    gridOptions={gridOptions}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
            <br />
            <AddCustomer addCustomer={addCustomer} />
        </>
    );
};

export default Customers;
