import { useState, useEffect } from "react";

export const useFetchBalance = (client, address, denom) => {
const [isFetchingBalance, setFetchingBalance] = useState(false);
const [balance, setBalance] = useState(null);
    useEffect(() => {
        const fetchBalance = async () => {
            if (client && address && denom) {
                setFetchingBalance(true);
                try {
                    const balanceData = await client.getBalance(address, denom);
                    setBalance(balanceData);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                    setBalance(null);
                } finally {
                    setFetchingBalance(false);
                }
            }
        };

        fetchBalance();
    }, [client, address, denom]);

    return [balance, setBalance, isFetchingBalance];
}