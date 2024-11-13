import React, { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from "@dfinity/principal";
import { idlFactory, canisterId } from '@declarations/dtoken_backend';
import { constants } from '@lib/constants';

type Props = {
    userPrincipal: Principal
};

function Faucet(props: Props) {
    const [isDisabled, setDisabled] = useState(false);
    const [buttonText, setButtonText] = useState("Gimme gimme");
    console.log("Faucet -> init -> canisterId", canisterId);

    async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        console.log("Faucet -> handleClick -> Claiming payout.");
        setDisabled(true);
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();
        const identity = authClient.getIdentity();
        const userPrincipal = identity.getPrincipal();
        // console.log("Faucet -> handleClick -> userPrincipal", userPrincipal);
        console.log("Faucet -> handleClick -> Authenticated:", isAuthenticated, "Principal:", userPrincipal.toLocaleString(), "Anonymous:", userPrincipal.isAnonymous());
        // Authenticated actors do not work with local deployemnts. The canisters must first be deployed to the IC network.
        /*const authenticatedActor = createActor(canisterId, {
            agentOptions: {
                identity
            }
        });*/
        console.log("Faucet -> handleClick -> host", constants.cwa.host);
        /**
         * shouldFetchRootKey: should only be set for local dev
         * Fetches root key for certificate validation during development
         * @see https://internetcomputer.org/docs/current/developer-docs/developer-tools/off-chain/agents/javascript-agent#example
         */
        const agent = HttpAgent.createSync({ 
            host: constants.cwa.host, 
            identity,
            logToConsole: true,
            retryTimes: 1
        });
        // await agent.syncTime(Principal.fromText(constants.canisters.ii.id ?? ""));
        
        if (constants.env.local) {
            try {
                console.log("Faucet -> handleClick -> fetchRootKey (for local env only) -> host", constants.cwa.host);
                const rootKey = await agent.fetchRootKey();
                console.log("Faucet -> handleClick -> fetchRootKey -> rootKey", rootKey);
            } catch (error) {
                console.warn("Faucet -> handleClick -> fetchRootKey -> Unable to fetch root key. Check to ensure that your local replica is running");
                console.error("Faucet -> handleClick -> fetchRootKey -> error", error);
            }
        }

        console.log("Faucet -> handleClick -> creating authenticated actor...");
        const authenticatedActor = Actor.createActor(idlFactory, {
            agent,
            canisterId,
        });

        try {
            console.log("Faucet -> handleClick -> getting payOut response...");
            let response = await authenticatedActor.payOut();
            console.log("Faucet -> handleClick -> Payout claimed: " + response);
    
            if (response && typeof response === "string") {
                setButtonText(response);
            }
            
            //setDisabled(false);
        } catch (error) {
            console.error("Faucet -> handleClick -> response error", error);
        }
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
