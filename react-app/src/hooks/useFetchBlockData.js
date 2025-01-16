import { useState, useEffect } from "react";
import { sha256 } from "@cosmjs/crypto";
import { Buffer } from "buffer";
export const useFetchBlockData = (client, rpc, debouncedInput) => {
    const [isFetchingHashes, setFetchingHashes] = useState(false);
    const [hashes, setHashes] = useState([]);
    useEffect(() => {
        const fetchBlockData = async () => {
            if (rpc && client && debouncedInput) {
                setFetchingHashes(true);
                try {
                    const blockData = await client.getBlock(Number(debouncedInput.trim()));
                    const txHashes = blockData.txs.map((txBase64) => {
                        const txBytes = Buffer.from(txBase64, "base64");
                        return Buffer.from(sha256(txBytes)).toString("hex").toUpperCase();
                    });
                    setHashes(txHashes);
                } catch (error) {
                    console.error("Error fetching block data:", error);
                    setHashes([]);
                } finally {
                    setFetchingHashes(false);
                }
            }
        };

        fetchBlockData();
    }, [rpc, debouncedInput, client]);

    return [hashes, setHashes, isFetchingHashes];
};