import React, { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from '@dfinity/auth-client';
import { dtoken_backend, idlFactory, canisterId, createActor } from '../../../declarations/dtoken_backend/index';

function Faucet(props) {
    const [isDisabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Gimme gimme");

    async function handleClick(event) {
        console.log("Claiming payout.");
        setDisabled(true);
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();
        const identity = authClient.getIdentity();
        const userPrincipal = identity.getPrincipal();
        // console.log(userPrincipal);
        console.log("Authenticated:", isAuthenticated, "Principal:", userPrincipal.toLocaleString(), "Anonymous:", userPrincipal.isAnonymous());
        // Authenticated actors do not work with local deployemnts. The canisters must first be deployed to the IC network.
        /*const authenticatedActor = createActor(canisterId, {
            agentOptions: {
                identity
            }
        });*/
        const authenticatedActor = Actor.createActor(idlFactory, {
            agent: new HttpAgent({
                identity,
            }),
            canisterId,
        });

        let response = await authenticatedActor.payOut();
        console.log("Payout claimed: " + response);
        setButtonText(response);
        //setDisabled(false);
    }

    return (
        <div className="container py-2 mt-5">
            <div className="row">
                <div className="col">
                    <h2>
                        <span role="img" aria-label="tap emoji">🚰</span>
                        Faucet
                    </h2>
                    <p className="lead">Get your free tokens here! Claim 10,000 DTOKEN coins to {props.userPrincipal.toLocaleString()}.</p>
                    <button id="btn-payout" type="button" className="btn btn-primary" onClick={handleClick} disabled={isDisabled}>{buttonText}</button>
                </div>
            </div>
        </div>
    );
}

export default Faucet;
