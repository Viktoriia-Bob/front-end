import React from "react";
import { Route, Switch } from "react-router-dom";
import Admin from "../components/admin";
import User from "../components/user";
import Signin from "../components/signin";
import Signup from "../components/signup";
import Confirmation from "../components/confirmation";
import ConfirmationPayload from "../components/confirmationPayload";
import UserStatistics from "../components/userStatistics";

export const useRoutes = (isAuthenticated) => {
  const userRole = JSON.parse(localStorage.getItem("role"));
  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path="/confirm-payload" component={ConfirmationPayload} />
        <Route exact path="/statistics/:id" component={UserStatistics} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/user" component={User} />
        <Route path="/" component={userRole ? User : Admin} />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route exact path="/auth/confirm" component={Confirmation} />
      <Route exact path="/sign-in" component={Signin} />
      <Route exact path="/sign-up" component={Signup} />
      <Route path="/" component={Signin} />
    </Switch>
  );
};
