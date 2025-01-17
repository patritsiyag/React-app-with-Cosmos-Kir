import { useState } from "react";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const useFetchPools = (rpc) => {
    const [pools, setPools] = useState(null);
    const [isFetchingPools, setFetchingPools] = useState(false);
    const fetchPools = async () => {
setFetchingPools(true);
        const contractAddress = "mantra1us7rryvauhpe82fff0t6gjthdraqmtm5gw8c808f6eqzuxmulacqzkzdal";

        const queryMessage = {
            "pools": {}
        };

        try {

            const client = await CosmWasmClient.connect(rpc);
            const response = await client.queryContractSmart(contractAddress, queryMessage);
            setPools(response)
        } catch (error) {
            console.error("Error querying the contract:", error);
        }finally {
            setFetchingPools(false);
        }
    }
return [pools, isFetchingPools, fetchPools];
}