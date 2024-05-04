import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const TrainingCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => {
                const eventsData = data.map(training => ({
                    title: `${training.activity} - ${training.customer.firstname} ${training.customer.lastname}`,
                    start: new Date(training.date),
                    end: moment(training.date).add(training.duration, 'minutes').toDate(),
                    customer: training.customer
                }));
                setEvents(eventsData);
            })
            .catch(error => console.error('Error fetching trainings:', error));
    };


    return (
        <div style={{ height: 700, width: 1500, margin: 'auto' }}>
            <br />
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                min={new Date(0, 0, 0, 7, 0, 0)}
                max={new Date(0, 0, 0, 22, 0, 0)}
                step={60}
                defaultView="week"
            />
        </div>
    );
};

export default TrainingCalendar;
