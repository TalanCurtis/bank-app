import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Private from './components/Private/Private';

export default (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/private' component={Private} />
    </Switch>
)