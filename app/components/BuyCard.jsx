'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import CheckConnection from './CheckConnection'
import useFetchItems from './FetchItems';

export default function BuyCard() {
    const router = useRouter();
    const { isConnected, hasMetamask, connect } = CheckConnection();
    const { items, loading } = useFetchItems();
    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [soldState, setSoldState] = useState('All');

    const types = ['All', ...new Set(items.map(item => item.type))];

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (type === 'All' || item.type === type) &&
        parseFloat(item.price) >= priceRange[0] && parseFloat(item.price) <= priceRange[1] &&
        (soldState === 'All' || (soldState === 'Sold' ? item.state : !item.state))
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
                <select class="w-1/6 h-16 px-2 mx-2 rounded border-4 border-slate-700 justify-self-center text-2xl" onChange={e => setSoldState(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Sold">Sold</option>
                    <option value="OnSale">On Sale</option>
                </select>
                <input 
                    type="text" 
                    name="search" 
                    id="searchbar" 
                    class="w-1/3 h-16 px-2 mx-2 rounded border-4 border-slate-700 justify-self-center text-2xl"
                    onChange={e => setSearch(e.target.value)}
                />
                <button 
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full'
                    onClick={() => {router.push('/buyer')}}
                >Buyer Dashboard</button>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'>
                        {filteredItems.map((item, index) => (
                            <div key={index} className='max-w-sm rounded-xl overflow-hidden shadow-lg m-5'>
                                <Link href={`/item/${index}`}>
                                <Image
                                    src={`https://ipfs.io/ipfs/${item.image}`}
                                    alt={item.name}
                                    width={500}
                                    height={500}
                                    priority={true}
                                />
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">{item.name}</div>
                                    <p class="text-gray-700 text-base">
                                    {item.description}
                                    </p>
                                </div>
                                <div class="px-5 pt-4 pb-2">
                                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">ETH {item.price}</span>
                                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{item.type}</span>
                                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{item.isSold ? "Sold": "OnSale"  }</span>
                                </div>
                            </Link>   
                            </div> 
                        ))}
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
