import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardMain from './components/Dashboard/DashboardMain';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<DashboardMain />} />
      </Routes>
    </Router>
  );
}

export default App;
