import { useState, useEffect } from "react";
import { StargateClient } from "@cosmjs/stargate";

export const useInitializeClient = (rpc, isWalletConnected) => {
     const [client, setClient] = useState(null);
    useEffect(() => {
        const initializeClient = async () => {
            if (rpc && isWalletConnected) {
                try {
                    const newClient = await StargateClient.connect(rpc);
                    console.log(await newClient.getHeight(), "height");
                    setClient(newClient);
                } catch (error) {
                    console.error("Error initializing Stargate client:", error);
                }
            }
        };

        initializeClient();
    }, [rpc, isWalletConnected]);

    return [client, setClient];
}