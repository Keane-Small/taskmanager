
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerticalNavBar from './components/VerticalNav/VerticalNavBar';
import MainContent from './components/MainContent';
import { NavProvider } from './context/NavContext';
import Messaging from './pages/Messaging';

function Home() {
  return <div style={{ color: 'white', padding: 40 }}>Welcome to Task Manager Home</div>;
}

function App() {
  return (
    <NavProvider>
      <Router>
        <div style={{
          backgroundColor: 'black',
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex'
        }}>
          <VerticalNavBar />
          <div style={{ flex: 1, marginLeft: 80 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/messaging" element={<Messaging />} />
            </Routes>
          </div>
        </div>
      </Router>
    </NavProvider>
  );
}

export default App;
