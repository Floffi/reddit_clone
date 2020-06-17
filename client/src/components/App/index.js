import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from '../Layout';
import Sidebar from '../Sidebar';
import RegisterModal from '../RegisterModal';
import LoginModal from '../LoginModal';
import CommunityModal from '../CommunityModal';
import Home from '../../routes/Home';
import SubmitPost from '../../routes/SubmitPost';
import refreshToken from '../../utilities/refreshToken';
import { loadSession } from '../../redux/auth';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSession = async () => {
      const accessToken = localStorage.getItem('accessToken');
      // Check if we have access token.
      if (accessToken) {
        // Decode the access token.
        const { exp } = jwtDecode(accessToken);
        // If the access token is expired, go fetch a new one.
        if (Date.now() > exp * 1000) {
          await refreshToken();
        } else {
          setTimeout(refreshToken, exp * 1000 - Date.now());
        }
        dispatch(loadSession());
      }
    };

    initializeSession();
  }, []);

  return (
    <BrowserRouter>
      <Sidebar />
      <RegisterModal />
      <LoginModal />
      <CommunityModal />
      <Layout>
        <Switch>
          <Route exact path={['/', '/c/:community']} component={Home} />
          <Route
            exact
            path={['/submit', '/c/:community/submit']}
            component={SubmitPost}
          />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
