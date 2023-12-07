import React from 'react'

export default function interactContract() {
    async function buyitem(index, address, price) {
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        if (address !== undefined && address !== null && address !== '') {
            try {
                const contract = new ethers.Contract(address, process.env.NEXT_PUBLIC_ITEM_ABI, signer);
                
                const priceInWei = ethers.utils.parseEther(price);
                const ItemContractTx = await contract.paySeller({ value: priceInWei });
                const transactionHash = ItemContractTx.hash;
                
                // Wait for the deployment transaction to be confirmed
                const confirmedTxReceipt = await waitForTransactionConfirmation(provider, transactionHash);
                console.log(`Completed with ${confirmedTxReceipt.confirmations} confirmations.`);
                // console.log(transactionHash)
                router.push("/")
            } catch(e) {
                console.log(e);
            }
        }
    }

    async function waitForTransactionConfirmation(provider, transactionHash) {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const maxRetries = 12; // Number of retries (each with 5 seconds delay) to wait for confirmations
        let retries = 0;
        while (retries < maxRetries) {
          try {
            const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
            if (transactionReceipt && transactionReceipt.confirmations > 0) {
              return transactionReceipt;
            }
          } catch (error) {
            // Ignore error and continue retrying
          }
          await delay(5000); // Wait for 5 seconds before checking again
          retries++;
        }
        throw new Error('Transaction not confirmed within the expected time.');
    }

    async function confirmDelivery(itemAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        if (itemAddress !== undefined && itemAddress !== null && itemAddress !== '') {
            try {
                const contract = new ethers.Contract(itemAddress, process.env.NEXT_PUBLIC_ITEM_ABI, signer);
                const ItemContractTx = await contract.confirmDelivery();
                const message = await ItemContractTx.wait();
                console.log(message);
                window.location.reload();
            } catch(e) {
                console.log(e);
            }
        }
    }

    async function confirmReceipt(itemAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        if (itemAddress !== undefined && itemAddress !== null && itemAddress !== '') {
            try {
                const contract = new ethers.Contract(itemAddress, process.env.NEXT_PUBLIC_ITEM_ABI, signer);
                const ItemContractTx = await contract.confirmReceipt();
                const message = await ItemContractTx.wait();
                console.log(message);
                window.location.reload();
            } catch(e) {
                console.log(e);
            }
        }
    }
  return (
    { buyitem, confirmDelivery, confirmReceipt }
  )
}
