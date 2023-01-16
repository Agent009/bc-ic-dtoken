import { Header, Footer } from './layout/layout'
import Faucet from "./token/Faucet";
import Balance from "./token/Balance";
import Transfer from "./token/Transfer";
import ErrorBoundary from "./util/errorBoundary";
import './App.css';
import React, { useEffect, useState } from "react";

export default function App(props) {
    return (
        <div className="App">
            <Header />
            <ErrorBoundary>
                <Faucet userPrincipal={props.loggedInPrincipal} />
                <Balance />
                <Transfer />
            </ErrorBoundary>
            <Footer />
        </div>
    );
}
