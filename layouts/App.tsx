import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));
const Channel = lazy(() => import('@pages/Channel'));
const DirectMessage = lazy(() => import('@pages/DirectMessage'));
const Workspace = lazy(() => import('./Workspace'));

const App = () => {
  return (
    <Suspense fallback={<div>로딩중 ..</div>}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/:workspace/" element={<Workspace />}>
          <Route path="channel/:channel" element={<Channel />} />
          <Route path="dm/:id" element={<DirectMessage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
