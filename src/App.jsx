import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Customers from './components/Customers';
import Trainings from './components/Trainings';
import TrainingCalendar from './components/Calendar';
import Stats from './components/Stats';

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Link to="/customers">Customers</Link>
        <Link to="/trainings">Trainings</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/stats">Stats</Link>
        <Routes>
          <Route path="/customers" element={<Customers />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/calendar" element={<TrainingCalendar />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
