import React from 'react';
import ReactDOM from 'react-dom/client';
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from '@dfinity/auth-client';
//import './index.css';
import App from './App';
import ErrorBoundary from "./util/errorBoundary";

const root = ReactDOM.createRoot(document.getElementById('root'));
const init = async () => {
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
        await handleAuthenticated(authClient);
    } else {
        console.log("Not logged in.");
        // Call authClient.login(...) to login with Internet Identity. This will open a new tab
        // with the login prompt. The code has to wait for the login process to complete.
        // We can either use the callback functions directly or wrap in a promise.
        await authClient.login({
            // 7 days in nanoseconds
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            identityProvider: "https://identity.ic0.app/#authorize",
            onSuccess: async () => {
                handleAuthenticated(authClient);
            }
        });
    }
}

async function handleAuthenticated(authClient) {
    // Get the identity from the auth client:
    const identity = authClient.getIdentity();
    const userPrincipal = identity.getPrincipal();
    // console.log(userPrincipal);
    console.log("Logged in with principal:", userPrincipal.toLocaleString());
    console.log("Principal:", userPrincipal.toLocaleString(), "Anonymous:", userPrincipal.isAnonymous());
    
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App loggedInPrincipal={userPrincipal} />
            </ErrorBoundary>
        </React.StrictMode>
    );
}

init();
