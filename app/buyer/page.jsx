"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

import useFetchItems from '../components/FetchItems'
import interactContract from '../components/interactContract';
import CheckConnection from '../components/CheckConnection';

export default function BuyerDashboard() {
    const router = useRouter();
    const { isConnected, hasMetamask, connect, account } = CheckConnection(); // added account
    const { items, loading } = useFetchItems();
    const { buyitem, confirmDelivery, confirmReceipt} = interactContract();
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');

    const types = ['All', ...new Set(items.map(item => item.type))];

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (type === 'All' || item.type === type) && item.buyer.toLowerCase() === account 
    );

    return (
        <>
        {isConnected ? (
            !loading ? (
                <div class='container mx-auto w-100 text-center'>
                    <select onChange={e => setType(e.target.value)} class="w-1/6 h-16 px-2 mx-2 rounded border-4 border-slate-700 justify-self-center text-2xl">
                        {types.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                            ))}
                    </select>
                    {/* <div class="w-1/4">
                        <label htmlFor="priceRange">{priceRange[1]}</label>
                        <input id='priceRange' type="range" min="0.001" max="0.1" step="0.001" onChange={e => setPriceRange([0, e.target.value])} />
                        
                    </div> */}
                    <input 
                        type="text" 
                        name="search" 
                        id="searchbar" 
                        class="w-1/3 h-16 px-2 mx-2 rounded border-4 border-slate-700 justify-self-center text-2xl"
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button 
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full'
                        onClick={() => {router.push('/')}}
                    >
                        Home Page
                    </button>
                    <div className='grid grid-cols-3 py-4'>
                        <div className='border-4 py-4'>
                            Item
                        </div>
                        <div className='border-4 py-4'>
                            State
                        </div>
                        <div className='border-4 py-4'>
                            Confirm?
                        </div>
                    </div>
                        {filteredItems.map((item, index) => (
                        
                            <Link href={`/item/${item.id}`}>
                                <div className='grid grid-cols-3'>
                                    <div key={item.id} className='border-4 py-4'>
                                        {item.id}. {item.name}
                                    </div>
                                    <div key={item.id} className='border-4 py-4'>
                                        {item.currentState === 1 && "waitting for delivery"}
                                        {item.currentState === 2 && "waitting for confirm"}
                                        {item.currentState === 3 && "Completed transaction"}
                                    </div>
                                    <div key={item.id} className='border-4 py-4'>
                                    
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
                                                <span>The item is bought! Enjoy!</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Link>
                        ))}
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
