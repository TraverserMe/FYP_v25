'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import useFetchItem from '../../components/FetchItem';
import CheckConnection from '../../components/CheckConnection'

export const dynamicParams = true;

export default function page({ params }){

    const id = params.id;
    const { item , loading , buyitem, confirmDelivery, confirmReceipt } = useFetchItem(id);
    const { isConnected, hasMetamask, connect, account } = CheckConnection();

    const [isAccountLoaded, setIsAccountLoaded] = useState(false);

    useEffect(() => {
        if (account) {
            setIsAccountLoaded(true);
        }
    }, [account]);

    const isSeller = item && account && (item.seller).toLowerCase() === account;
    const isBuyer = item && account && (item.buyer).toLowerCase() === account;

    return(
       <>
       {isConnected && isAccountLoaded ? (
            item && !loading ? (
                <div class='container mx-auto'>
                    <div className='text-start'>
                        <h1>Item Details</h1>
                        <ul>
                            <Image
                                src={`https://ipfs.io/ipfs/${item.image}`}
                                alt={item.name}
                                width={500}
                                height={500}
                                priority={true}
                            >
                            </Image>
                            <li>Item ID: {id}</li>
                            <li>Item Address: {item.address}</li>
                            <li>Item Name: {item.name}</li>
                            <li>Item Price: {item.price }</li>
                            <li>Item Owner: {item.seller}</li>
                            <li>Item State: {item.isSold ?  "Sold" : "OnSale" }</li>
                            <li>Item Type: {item.type}</li>
                            <li>Item Description: {item.description}</li>
                            <li>Item currentState: {item.currentState}</li>
                            <li>Item buyer: {item.buyer}</li>
                        </ul>
                        <div>
                            {!isSeller && !isBuyer && !item.isSold && 
                                <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full"
                                    onClick={() => {buyitem(item.id, item.address, item.price)}}>
                                    Buy
                                </button>
                            }
                            {/* seller angle */}
                            {isSeller && !isBuyer && <>
                                {!item.isSold && <span className='text-amber-800 font-semibold'>The item is not yet sold!</span>}
                                {item.isSold && item.currentState === 1 && 
                                     <div>
                                         <span>The item is sold!</span>
                                         <br />
                                         <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full"
                                            onClick={() => {confirmDelivery(item.address)}}
                                         >Comfirm deliery</button>
                                     </div>
                                }
                                {item.isSold && item.currentState === 2 && 
                                     <div>
                                         <span>Waiting buyer to confirm!</span>
                                     </div>
                                }
                                {item.isSold && item.currentState === 3 && 
                                     <div>
                                         <span>The item is sold! </span>
                                         <span>Buyer recevied and the money is transfered</span>
                                     </div>
                                }
                                </>
                            }
                            {/* buyer angle */}
                            {isBuyer && !isSeller && <>
                                {item.isSold && item.currentState === 1 && 
                                     <div>
                                         <span>Waiting for seller to delivery</span>
                                     </div>
                                }
                                {item.isSold && item.currentState === 2 && 
                                     <div>
                                         <span>The item is sold!</span>
                                         <br />
                                         <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full"
                                            onClick={() => {confirmReceipt(item.address)}}
                                         >Comfirm recevied</button>
                                     </div>
                                }
                                {item.isSold && item.currentState === 3 && 
                                     <div>
                                         <span>The item is bought!</span>
                                         <br />
                                         <span>Enjoy!</span>
                                     </div>
                                }
                                </>
                            }

                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <main className="text-center">
                        <h2 className="text-primary">Loading...</h2>
                        <p>Hopefully not for too long :)</p>
                    </main>
                </div>
            )
        ) : (
            <div>
                <main className="text-center">
                    <h2 className="text-primary">Not connected yet</h2>
                    <p>Please connect to MetaMask first.</p>
                </main>
            </div>
        )}
       </>

    )

}
