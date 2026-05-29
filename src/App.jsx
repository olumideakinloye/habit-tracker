import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Calendar from './pages/Calendar';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import './App.css';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/habits" element={<Habits />} />
          <Route exact path="/calendar" element={<Calendar />} />
          <Route exact path="/reminders" element={<Reminders />} />
          <Route exact path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
