import VerticalNavBar from './components/VerticalNav/VerticalNavBar';
import { NavProvider } from './context/NavContext';

function App() {
  return (
    <NavProvider>
      <div style={{
        backgroundColor: 'black',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}>
        <VerticalNavBar />
      </div>
    </NavProvider>
  );
}

export default App;
