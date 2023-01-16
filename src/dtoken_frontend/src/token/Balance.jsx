import React, { useState } from "react";
import { Principal } from '@dfinity/principal';
import { dtoken_backend } from '../../../declarations/dtoken_backend/index';

function Balance() {
    const [inputValue, setInput] = useState("");
    const [balanceResult, setBalance] = useState("");
    const [cryptoSymbol, setSymbol] = useState("");
    const [balanceHidden, setBalanceHidden] = useState(true);

    async function handleClick() {
        console.log("Checking balance for: " + inputValue);
        let principal = "";

        try {
            principal = Principal.fromText(inputValue);
        } catch (ex) {
            console.error(ex);
            setBalance("Could not check balance due to an error. " + ex.message);
            setBalanceHidden(false);
            return;
        }

        const balance = await dtoken_backend.balanceOf(principal);
        const symbol = await dtoken_backend.getSymbol();
        console.log("Balance received for " + inputValue + ": " + balance + " " + symbol);
        setBalance(balance.toLocaleString());
        setSymbol(symbol);
        setBalanceHidden(false);
    }

    return (
        <div className="container py-2">
            <div className="form-row align-items-center">
                <div className="col-6">
                    <h2>Check account token balance</h2>
                </div>
                <div className="col-auto">
                    <input id="balance-principal-id" type="text" className="form-control" placeholder="Principal ID" value={inputValue}
                        onChange={(event) => setInput(event.target.value)} />
                </div>
                <div className="col-3">
                    <button id="btn-request-balance" type="button" className="btn btn-info" onClick={handleClick}>Check Balance</button>
                </div>
            </div>

            <div className="row" hidden={balanceHidden}>
                <div className="col">
                    <p className="text-muted">This account has a balance of {balanceResult} {cryptoSymbol}.</p>
                </div>
            </div>
        </div>
    );
}

export default Balance;
