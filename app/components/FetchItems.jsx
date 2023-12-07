'use client'
import { useState , useEffect } from 'react'
const ethers = require("ethers");

export default function useFetchItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MAIN_CONTRACT_ID, process.env.NEXT_PUBLIC_MAIN_ABI, signer);
            
            try {
                const itemContracts = await contract.getAllItemContracts();
                // console.log(itemContracts.length);
                const items = [];
                for (let index = 0; index < itemContracts.length; index++) {
                    const itemAddress = itemContracts[index];
                    const itemContract = new ethers.Contract(itemAddress, process.env.NEXT_PUBLIC_ITEM_ABI, signer);
                    const details = await itemContract.getAll();
                    items.push({
                        id: index,
                        address: itemAddress,
                        name: details[1],
                        description: details[2],
                        type: details[3],
                        image: details[4],
                        seller: details[5],
                        buyer: details[6],
                        price: ethers.utils.formatEther(details[7]),
                        isSold: details[8],
                        buyerReceived: details[9],
                        currentState: details[10]
                    });
                }
                setItems(items);
                setLoading(false);
            } catch(e) {
                console.log(e);
            }
        };
        fetchItems();
    }, []);

    return { items, loading };
}
