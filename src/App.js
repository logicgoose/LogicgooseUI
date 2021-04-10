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

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <Layout>
          <Switch>
            <PrivateRoute exact path="/projects">
              <ProjectsPage />
            </PrivateRoute>
            <Route exact path="/">
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
  const signin = (data, cb) => {
    setUser(data.username);
    cb(true);
  };

  /**
   * 
   * @param {string} endpoint 
   * @param {any} [data] 
   * @returns 
   */
  const send = (endpoint, data) => {
    return realData.send(endpoint, data)
    .then((result) => Promise.resolve(result))
    .catch((error) => {
      console.log('error!', error);
      setError(error);
    });
  };

  return {
    user,
    setUser,
    signin,
    send
  }
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (auth.user !== null) setLoading(false)
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