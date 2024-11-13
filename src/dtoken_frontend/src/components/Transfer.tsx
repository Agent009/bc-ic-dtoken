import React, { useState } from "react";
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory, canisterId } from '@declarations/dtoken_backend';

function Transfer() {
    const [recipientID, setRecipientID] = useState("");
    const [amount, setAmount] = useState("");
    const [isDisabled, setDisabled] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [transferMessage, setTransferMessage] = useState("");
    console.log("Transfer -> init -> canisterId", canisterId);

    async function handleClick() {
        setDisabled(true);
        setShowTransfer(false);
        let recipient: Principal;

        try {
            recipient = Principal.fromText(recipientID);
        } catch (ex) {
            console.error("Transfer -> handleClick -> error", ex);
            setTransferMessage("Could not carry out the transfer due to an error. " + (ex as Error).message);
            setShowTransfer(true);
            setDisabled(false);
            return;
        }

        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();
        const identity = authClient.getIdentity();
        const userPrincipal = identity.getPrincipal();
        // console.log(userPrincipal);
        // console.log("Authenticated:", isAuthenticated, "Principal:", userPrincipal.toLocaleString(), "Anonymous:", userPrincipal.isAnonymous());
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

        const amountToTransfer = Number(amount);
        console.log("Transfer -> handleClick -> Transferring: " + amountToTransfer + " to " + recipient);
        let transferResult = await authenticatedActor.transfer(recipient, amountToTransfer);
        console.log("Transfer -> handleClick -> Transfer Result: " + transferResult);

        if (transferResult && typeof transferResult === "string") {
            setTransferMessage(transferResult);
        }

        setShowTransfer(true);
        setDisabled(false);
    }

    return (
        <div className="container py-2 mb-5">
            <div className="row">
                <div className="col">
                    <div className="form-row align-items-center">
                        <div className="col-3">
                            <h2>Transfer</h2>
                        </div>

                        <div className="col-auto">
                            <input type="text" id="transfer-to-id" className="form-control" placeholder="To Account"
                                value={recipientID} onChange={(event) => setRecipientID(event.target.value)} />
                        </div>

                        <div className="col-auto">
                            <input type="number" id="amount" className="form-control" placeholder="Amount"
                                value={amount} onChange={(event) => setAmount(event.target.value)} />
                        </div>

                        <div className="col-4">
                            <button id="btn-transfer" type="button" className="btn btn-info" onClick={handleClick} disabled={isDisabled} >Transfer</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5" hidden={!showTransfer}>
                <div className="col">
                    <p className="alert alert-info">{transferMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default Transfer;
