import './App.css';
import {BrowserRouter, Route, Redirect, Switch, Routes} from 'react-router-dom'
// import {Switch} from 'react-router'
import AuthPage from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';


function App() {
  return (
    <main>
      <MainNavigation />
      <Routes>
      <Route path='/auth' Component={AuthPage} />
      <Route path='/events' Component= {Events}/>
      <Route path='/bookings' Component= {Bookings}/>
      </Routes>
    </main>



  );
}

export default App;
