import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
 
import DashboardMain from './components/Dashboard/DashboardMain';
// import Navbar from './components/Layout/Navbar';
 
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
               {/* <Navbar/> */}
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */} 
        
          <Route path="/*" element={<DashboardMain/>}/>


        </Routes>
      </Router>
    </>
  );
}

export default App;
