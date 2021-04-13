import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Layout from './components-custom/Layout';

import LoginPage from './pages/Login.js';
import ProjectsPage from './pages/Projects.js';
import APIsPage from './pages/APIs.js';
import CreateAPIPage from './pages/CreateAPI.js';
import APIPage from './pages/API.js';
import APIEditPage from './pages/APIEdit.js';
import LoggingPage from './pages/Logging';
import DocsPage from './pages/Docs';

const JWT_KEY = `jwt`;
var API = ``;

if (process.env.NODE_ENV === 'development') {
  API = `http://localhost:5000`;
}

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <Layout>
          <Switch>
            <PrivateRoute exact path="/projects">
              <ProjectsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/projects/:project">
              <APIsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/projects/:project/create">
              <CreateAPIPage />
            </PrivateRoute>
            <PrivateRoute exact path="/projects/:project/:api/edit">
              <APIEditPage />
            </PrivateRoute>
            <PrivateRoute path="/projects/:project/:api">
              <APIPage />
            </PrivateRoute>
            <PrivateRoute Exact path="/logging">
              <LoggingPage />
            </PrivateRoute>
            <PrivateRoute Exact path="/docs">
              <DocsPage />
            </PrivateRoute>
            <Route path="/">
              <LoginPage />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </ProvideAuth>
  );
}

const authContext = React.createContext({});

function ProvideAuth(props) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {props.children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = React.useState(null);
  
  /**
   * 
   * @param {{username: string, password: string}} data 
   * @param {Function} cb 
   * @returns 
   */
  const signin = async (data, cb) => {
    const requestOptions = {
      method: `POST`,
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    try {
      const result = await (fetch(`${API}/lg/user/login`, requestOptions).then(res => res.json()));
      
      localStorage.setItem(JWT_KEY, result.token);
      setUser(data.username);
      cb(result.auth); //True or false

    } catch (e) {
      localStorage.removeItem(JWT_KEY);
      setUser(null);
      cb(false);
    }
  };

  /**
   * 
   * @param {string} endpoint 
   * @param {any} [data] 
   * @returns 
   */
  const send = async (endpoint, data) => {
    const token = localStorage.getItem(JWT_KEY);

    if (token) {
      const requestOptions = {
        method: (data ? 'POST' : 'GET'),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: (data ? JSON.stringify(data) : undefined)
      };

      try {
        const result = await (fetch(`${API}${endpoint}`, requestOptions).then(res => res.json()));
        return result;

      } catch (e) {
        //Handle if not authenticated (401) here?
        throw new Error("Error with API.");
      }
    } else {
      throw new Error("Not authenticated.");
    }
  };

  const isLoggedIn = async () => {
    if (user) {
      return true;

    } else {
      try {
        const result = await send("/lg/user");
        const {username} = result;

        if (username) {
          setUser(username);
          return true;
        } else {
          return false;
        }


      } catch (e) {
        return false;
      }
    }
  }

  return {
    user,
    setUser,
    signin,
    isLoggedIn,
    send
  }
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    auth.isLoggedIn().then(result => {setLoading(false)});
  }, [])

  return loading
    ?
      <React.Fragment></React.Fragment>
    :
      <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
      />
}