async function getChainId() {
    const url = 'http://localhost:8011'; // Replace with your Ethereum node URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_chainId',
                params: [],
                id: 1,
            }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('eth_chainId response:', data.result);
    } catch (error) {
        console.log(error)
        console.error('Error:', error.message);
    }
}

// Call the function to get the chain ID
getChainId();
