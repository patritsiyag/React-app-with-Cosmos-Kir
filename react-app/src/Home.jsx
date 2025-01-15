import { useChain } from '@cosmos-kit/react';
import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { StargateClient } from "@cosmjs/stargate";
import { sha256 } from "@cosmjs/crypto";
import { Buffer } from "buffer";
import './App.css';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

const Home = () => {
    const { connect, openView, isWalletConnected, getRpcEndpoint, address } = useChain('osmosis');

    const [rpc, setRpc] = useState('');
    const [isFetchingBalance, setFetchingBalance] = useState(false);
    const [isFetchingHashes, setFetchingHashes] = useState(false);
    const [blockId, setBlockId] = useState('');
    const [balance, setBalance] = useState(new BigNumber(0));
    const [hashes, setHashes] = useState([]);
    const debouncedInput = useDebounce(blockId, 500);
    const [client, setClient] = useState(null);


    useEffect(() => {
        const fetchRpcEndpoint = async () => {
            if (!rpc) {
                try {
                    const endpoint = await getRpcEndpoint();
                    setRpc(endpoint);
                } catch (error) {
                    console.error("Error fetching RPC endpoint:", error);
                }
            }
        };
    
        fetchRpcEndpoint();
    }, [rpc, getRpcEndpoint]);
    useEffect(() => {
        const initializeClient = async () => {
            if (rpc) {
                try {
                    const newClient = await StargateClient.connect(rpc);
                    setClient(newClient);
                } catch (error) {
                    console.error("Error initializing Stargate client:", error);
                }
            }
        };
    
        initializeClient();
    }, [rpc]);

    useEffect(() => {


        if (rpc && client) {
            const fetchData = async () => {
                setFetchingBalance(true);
                try {
                   

                    console.log(await client.getHeight(), "height")
                    const balanceData = await client.getAllBalances(address);
                    setBalance(balanceData);

                } catch (error) {
                    console.log(error, "error")
                } finally {

                    setFetchingBalance(false);
                }
            };

            fetchData();
        }
    }, [rpc, address, client]);
    useEffect(() => {


        if (rpc) {
            const fetchData = async () => {

                try {
                   
                    if (debouncedInput && client) {
                        const blockData = await client.getBlock(Number(debouncedInput.trim()));
                        const txHashes = blockData.txs.map((txBase64) => {
                            const txBytes = Buffer.from(txBase64, "base64");
                            return Buffer.from(sha256(txBytes)).toString("hex").toUpperCase();
                        });
                        setHashes(txHashes)


                    }
                } catch (error) {
                    console.log(error, "error")
                } finally {

                    setFetchingHashes(false)
                }
            };

            fetchData();
        }
    }, [rpc, debouncedInput, client]);
    return (
        <div className="container">
            <button
                className="connectWallet"
                onClick={() => (isWalletConnected ? openView() : connect())}
            >
                {isWalletConnected ? "Open Wallet" : "Connect Wallet"}
            </button>
            {isFetchingBalance ? <p>Fetching balance...</p> : <p>Balance: {balance[0]?.amount || 0}  </p>}
            <input
                type="text"
                value={blockId}
                onChange={(e) => {
                    setFetchingHashes(true);
                    setBlockId(e.target.value)
                }}
                placeholder="Enter block ID"
            />

            {isFetchingHashes ? (
                <p>Fetching transactions...</p>
            ) : (
                <ul>
                    {hashes.map((hash, index) => (
                        <li key={index}><a href={`https://www.mintscan.io/osmosis/tx/${hash}?height=${debouncedInput}`}>{hash}</a></li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;