import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Prelude "mo:base/Prelude";
import Iter "mo:base/Iter";

actor DToken {
    let owner : Principal = Principal.fromText("jxic7-kzwkr-4kcyk-2yql7-uqsrg-lvrzb-k7avx-e4nbh-nfmli-rddvs-mqe");
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "DTOKEN";

    // Create the ledger to store the balances.
    // HashMaps cannot use the stable parameter at the moment, so we need to use a workaround by using an array
    // and copying values into the HashMap.
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    // Give the owner the total supply. This would get called each time the canister is deployed.
    // balances.put(owner, totalSupply);

    // Give the owner the total supply. This duplicate call is needed so that the first time the canister is deployed
    // the owner is properly given the initial supply. This is because on first deployment, the system preupgrade / postupgrade
    // methods do not get called, so the code within there will have no effect.
    if (balances.size() < 1) {
        balances.put(owner, totalSupply);
    };

    // Workaround to turn the balances HashMap into a stable data store which persists across deployments.
    // See the system preupgrade and postupgrade methods.
    private stable var balanceEntries: [(Principal, Nat)] = [];

    public query func balanceOf(who : Principal) : async Nat {
        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };

        Debug.print(debug_show (("balance of", who, "is", balance)));
        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    // dfx canister call dtoken_backend payOut
    // msg.caller should return the same value as "dfx identity get-principal" when called locally
    public shared (msg) func payOut() : async Text {
        // If "payOut()" is called from within the canister, "msg.caller" will be something like:                [Canister rrkah-fqaaa-aaaaa-aaaaq-cai] rrkah-fqaaa-aaaaa-aaaaq-cai
        // If "payOut()" is called from the front-end, by an anonymous user,"msg.caller" will be something like: [Canister rrkah-fqaaa-aaaaa-aaaaq-cai] 2vxsx-fae
        // "2vxsx-fae" can be used as the principal ID to transfer tokens to the anonymous user browsing the website
        Debug.print(debug_show (msg.caller));
        let payeeStr : Text = Principal.toText(msg.caller);

        if (balances.get(msg.caller) == null) {
            // Only grant tokens if not already claimed.
            let amount = 10000;
            // Uncomment the below to grant new tokens magically from thin air without depleting the existing supply.
            // balances.put(msg.caller, amount);
            // Use the transfer function below to transfer from the canister to the payee.
            // This requires that the canister is first charged with the tokens, so that tokens can be transferred out of it.
            // View the "Charge the Canister" section of the README.md for how to do this.
            // 
            let transferResponse : Text = await transfer(msg.caller, amount);

            Debug.print(debug_show (("payOut to", msg.caller, "for an amount of", amount, "completed.")));
            return "Payout claimed successfully by " # payeeStr;
        } else {
            Debug.print(debug_show (("payOut to", msg.caller, "failed because this caller has already claimed the tokens.")));
            return "Tokens already claimed by " # payeeStr;
        };
    };

    // dfx canister call dtoken_backend transfer
    // Transferring from the caller to the recipient
    public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
        // This call would have the principal ID of the canister    making the call, i.e. this canister with a caller ID such as "rrkah-fqaaa-aaaaa-aaaaq-cai"
        // let result = await payOut();

        let transferFrom : Principal = msg.caller;
        let fromBalance : Nat = await balanceOf(transferFrom);
        Debug.print(debug_show (("transferring", amount, "from", transferFrom, "who has a current balance of", fromBalance)));

        if (fromBalance >= amount) {
            // Do the transfer
            let newFromBalance : Nat = fromBalance - amount;
            balances.put(transferFrom, newFromBalance);
            let toBalance : Nat = await balanceOf(to);
            let newToBalance : Nat = toBalance + amount;
            balances.put(to, newToBalance);
            Debug.print(debug_show (("transferred", amount, "to", to, "who had a balance of", toBalance, "and now has a balance of", newToBalance)));
            return "Transferred " # Nat.toText(amount) # " to " # Principal.toText(to);
        } else {
            Debug.print(debug_show (("cannot transfer", amount, "to", to, "because", transferFrom, "has insufficient balance", fromBalance)));
            return "Insufficient balance. Cannot transfer " # Nat.toText(amount) # " as only " # Nat.toText(fromBalance) # " is available.";
        };
    };

    // This function gets called pre-upgrade.
    system func preupgrade() {
        // Copy the current balances into the stable store as a new value which overwrites any existing values.
        balanceEntries := Iter.toArray(balances.entries());
    };

    // This function gets called post-upgrade.
    // Post-upgrade, any non-stable data is lost and reset back to the initialised states.
    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);

        // Give the owner the total supply. This ensures the owner is only supplied with the initial once,
        // and not on each deployment of the canister.
        if (balances.size() < 1) {
            balances.put(owner, totalSupply);
        }
    };
};
