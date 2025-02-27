import './App.css';
import {BrowserRouter, Route, Redirect, Switch, Routes} from 'react-router-dom'
// import {Switch} from 'react-router'
import AuthPage from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import { useContext } from 'react';
import { AuthContext } from './context/auth-context';


function App() {
  const {token} = useContext(AuthContext);
  return (
    <main>
      <MainNavigation />
      <Routes>
      {!token && <Route path='/auth' Component={AuthPage} />}
      {token && <Route path='/events' Component= {Events}/>}
      {token && <Route path='/bookings' Component= {Bookings}/>}
      </Routes>
    </main>



  );
}

export default App;
