import { useState } from 'react';

import {HashRouter as Router, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './vd-app.css'


import { homeApp } from './micro-apps/home/home-app';
import { securityApp } from './components/v-security/security-app';
import { UserContextType, securityManager, UserContext } from './components/v-security/v-security-manager';
function App(props: any) {
  const [state] = useState<UserContextType>(securityManager.getUserContext());
  console.log(`the root path ${process.env.PUBLIC_URL}`)
  return (
    <UserContext.Provider value={state} >
      <div className="vd-app">
        <Router basename='/'>
          <Routes>
            {homeApp.getRoutes()}
            {securityApp.getRoutes()},
          </Routes>
        </Router>
      </div>
    </UserContext.Provider>
  );
}


export default App;
