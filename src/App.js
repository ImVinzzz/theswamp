import React, { useState, useEffect } from 'react';
import { parseEther } from 'ethers'; // Utility to convert Ether to wei
import { provider, contract, requestAccount, getSigner } from './ethereum'; // Local functions

function App() {
    const [account, setAccount] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchAccount() {
            try {
                await requestAccount(); // Request account access from the user
                const signer = await getSigner(); // Await the signer (the current user)
                const address = await signer.getAddress(); // Get the user's Ethereum address
                setAccount(address); // Set the account state with the user's address
            } catch (error) {
                console.error('Error fetching account:', error);
            }
        }

        fetchAccount();
        fetchNfts(1); // Fetch initial NFTs with page 1
    }, []); // Empty dependency array means this runs only once after the initial render

    const fetchNfts = async (pageNumber) => {
        if (loading) return; // Prevent fetching if already loading
        setLoading(true);
        try {
            const newNfts = [];
            const startIndex = (pageNumber - 1) * 10 + 1;
            const endIndex = pageNumber * 10;

            console.log(`Fetching NFTs from ${startIndex} to ${endIndex}`);

            for (let i = startIndex; i <= endIndex; i++) {
                const tokenURI = await contract.tokenURI(i);
                const response = await fetch(tokenURI);
                const metadata = await response.json();
                newNfts.push(metadata);
            }
            setNfts(newNfts);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        fetchNfts(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            fetchNfts(page - 1);
        }
    };

    async function handleTransaction() {
        try {
            const signer = await getSigner(); // Await the signer (the current user)
            console.log('Signer:', signer);
            const tx = await signer.sendTransaction({
                to: '0xeFe31cFF3D9ECA260d5C83e9E12e9E3dF547958B', // Replace with recipient address
                value: parseEther('0.001') // Convert 0.001 Ether to wei using parseEther
            });
            console.log('Transaction:', tx); // Log the transaction details
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    }

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div>
            {account ? <p>Connected as {account}</p> : <button onClick={requestAccount}>Connect Wallet</button>}
            <button onClick={handleTransaction}>Send Transaction</button>
            <div style={gridStyle}>
                {nfts.map((nft, index) => (
                    <div key={index} style={cardStyle}>
                        <h2>{nft.name}</h2>
                        <img src={nft.image} alt={nft.name} style={{ width: '100%', imageRendering: 'pixelated' }} />
                    </div>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
}

export default App;
