import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../Auth/Signin';
import SignUp from '../Auth/Signup';
import Dashboard from '../Dashboard/Dashboard';

function Main() {
    return (
        <main>
            <Switch>
                <Route exact path="/">
                </Route>

                <Route exact path="/signin">
                    <SignIn />
                </Route>

                <Route exact path="/signup">
                    <SignUp />
                </Route>

                <Route exact path="/dashboard">
                    <Dashboard />
                </Route>

                <Route exact path="/my-wall">
                </Route>
                <Route path="/wall/">
                </Route>
                <Route exact path="/chat">
                </Route>
                <Route>404 Page Not Found!</Route>
            </Switch>
        </main>
    )
}


export default Main;