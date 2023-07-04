import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';

const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));

const App = () => {
  return (
    <Suspense fallback={<div>로딩중 ..</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Suspense>
  );
};

export default App;
