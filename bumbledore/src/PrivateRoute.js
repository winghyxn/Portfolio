import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
function PrivateRoute() {
  const isAuthenticated = /* Check if the user is authenticated */ true;
  const navigate = useNavigate();

  return (
    <Route
      render={() =>
        isAuthenticated ? navigate("/home") : navigate("/login")
      }
    />
  );
}
export default PrivateRoute;