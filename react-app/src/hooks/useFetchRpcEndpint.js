import { useState, useEffect } from "react";

export const useFetchRpcEndpoint = (getRpcEndpoint, selectedChain, isWalletConnected) => {
    const [rpc, setRpc] = useState('');
    
    useEffect(() => {
        const fetchRpcEndpoint = async () => {
            if (selectedChain && isWalletConnected) {
                try {
                    const endpoint = await getRpcEndpoint();
                    setRpc(endpoint);
                } catch (error) {
                    console.error("Error fetching RPC endpoint:", error);
                }
            }
        };

        fetchRpcEndpoint();
    }, [getRpcEndpoint, selectedChain, isWalletConnected]);

    return [rpc, setRpc];

};