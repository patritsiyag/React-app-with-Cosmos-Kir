import { useChain, useManager } from '@cosmos-kit/react';
import { useState, useEffect, useRef } from "react";
import { chains } from 'chain-registry';
import { StargateClient } from "@cosmjs/stargate";
import { sha256 } from "@cosmjs/crypto";
import { Buffer } from "buffer";
import { AppConstants } from './AppConstants';
import './App.css';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeoutRef = useRef(null);

    useEffect(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timeoutRef.current);
    }, [value, delay]);

    return debouncedValue;
};

const Home = () => {
    const [selectedChain, setSelectedChain] = useState("celestia");
    const chainName = chains?.find((c) => c.chain_id === selectedChain)?.chain_name;
    const managerContext = useManager();
    const { connect, openView, isWalletConnected, getRpcEndpoint, address, disconnect } = useChain(chainName || '');
    const [rpc, setRpc] = useState('');
    const [isFetchingBalance, setFetchingBalance] = useState(false);
    const [isFetchingHashes, setFetchingHashes] = useState(false);
    const [blockId, setBlockId] = useState('');
    const [balance, setBalance] = useState(null);
    const [hashes, setHashes] = useState([]);
    const debouncedInput = useDebounce(blockId, 500);
    const [client, setClient] = useState(null);
    const denom = managerContext?.getChainRecord(chainName || '')?.chain?.staking?.staking_tokens[0]?.denom;

    const options = Object.keys(AppConstants.ChainIds).map((key) => ({
        value: AppConstants.ChainIds[key],
        label: AppConstants.ChainLabels[key]
    }));

    const handleChange = (event) => {
        const newChain = event.target.value;
        setBalance(null);
        setRpc('')
        setClient(null);
        setHashes([]);
        setBlockId('');
        disconnect();
        setSelectedChain(newChain);

    };

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
    console.log(chains?.find((c) => c.chain_id === selectedChain), "chains")
    return (
        <div className="container">
            <div>
                <label htmlFor="dropdown">Choose an option: </label>
                <select
                    id="dropdown"
                    value={selectedChain}
                    onChange={handleChange}
                    style={{ padding: "5px", margin: "10px 0" }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {selectedChain && <p>You selected: {selectedChain}</p>}
            </div>
            <button
                className="connectWallet"
                onClick={() => (isWalletConnected ? openView() : connect())}
            >
                {isWalletConnected ? "Open Wallet" : "Connect Wallet"}
            </button>
            {isWalletConnected && (
                <div className="blockData">
                    {isFetchingBalance || !balance ? (
                        <p>Fetching balance...</p>
                    ) : (
                        <p>Balance: {balance?.amount} {denom}</p>
                    )}
                    <input
                        type="text"
                        value={blockId}
                        onChange={(e) => setBlockId(e.target.value)}
                        placeholder="Enter block ID"
                    />
                    {isFetchingHashes ? (
                        <p>Fetching transactions...</p>
                    ) : (
                        <ul>
                            {hashes.map((hash, index) => (
                                <li key={index}>
                                    <a href={`https://www.mintscan.io/${AppConstants.ChainNames[chainName]}/tx/${hash}?height=${debouncedInput}`}>
                                        {hash}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;