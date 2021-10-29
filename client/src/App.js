import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import HomeGuest from './components/HomeGuest';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Features from './components/Features';
import {connect} from 'react-redux';

function App(props) {
  return (
    <BrowserRouter>
      <NavBar/>
      <Route path="/" exact>
        {
          props.user ? <Home/> : <HomeGuest/>
        }
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route path="/features">
        <Features/>
      </Route>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
      user: state.user
  }
}

export default connect(mapStateToProps)(App);
