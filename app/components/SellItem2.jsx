"use client"
import React, { useState, useEffect }  from "react";
import { useRouter } from 'next/navigation'

const ethers = require("ethers")

import CheckConnection from "./CheckConnection";

export default function SellItem() {
  const router = useRouter();
  const { isConnected, hasMetamask, connect } = CheckConnection();
  const [ isLoading ,setIsLoading ] = useState(false)
  const [ account, setAccount ] = useState("");

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [itemType, setItemType] = useState('');
  const [itemAbout, setItemAbout] = useState('');

  useEffect(() => {
      if (isConnected) {
          ethereum.request({ method: 'eth_accounts' })
              .then(accounts => setAccount(accounts[0]))
              .catch(console.log);
      }
  }, [isConnected]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fileInput = document.querySelector('input[type="file"]')
    
    // console.log(fileInput.files[0].name,fileInput.files[0].type)

    // let file_name = encodeURIComponent((fileInput.files[0].name))

    if (!isConnected) {
      alert("Please connect to MetaMask.")
      setIsLoading(false)
      return;
    }else if (isConnected) {
      if (itemName === '' || itemPrice === 0 || itemType === '' || itemAbout === '') {
        alert("Please fill in all the fields.")
        setIsLoading(false)
        return;
      }else if (itemPrice < 0) {
        alert("Please enter a positive price.")
        setIsLoading(false)
        return;
      }else if (fileInput.files.length === 0) {
        alert("Please upload a file.")
        setIsLoading(false)
        return;
      }else if (fileInput.files.length > 1) {
        alert("Please upload only one file.")
        document.querySelector('input[type="file"]').value = ''
        setIsLoading(false)
        return;
      }
      const confirm = window.confirm(
        "Are you sure you want to upload this item? You cannot modify the item after uploading except for the prices."
        );
      if (!confirm){
        setIsLoading(false)
        return;
      } else{
        setIsLoading(true)
      }
  
      // try{
      //   const file = fileInput.files[0];
      //   const date = new Date(en.now());
      //   const fileName = itemName + '-' + date.getTime();
      //   const newFile = new File([file], fileName, { type: file.type });

      //   const cid = await storage.put([newFile]);
      //   setImage_url(`https://${cid}.ipfs.dweb.link/${fileName}`);

      //   console.log(`URL: https://${cid}.ipfs.dweb.link/${fileName}`);
      //   await new Promise(resolve => setTimeout(resolve, 1500));

      // }catch(e){
      //   console.log(e)
      // }

      
    }
}

return (
  <form onSubmit={handleSubmit}>
      <div className="space-y-15">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Sell</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Account Number: {isConnected && <span className="font-bold" id='acc_number'>{account}</span>}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="itemName" className="block text-sm font-medium leading-6 text-gray-900">
                Item Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span> */}
                  <input
                    type="text"
                    name="itemName"
                    id="itemName"
                    className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Apples?"
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="itemPrice" className="block text-sm font-medium leading-6 text-gray-900">
                Price {`(price in ETH)`}
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="itemPrice"
                  defaultValue={0}
                  id="itemPrice"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  onChange={(e) => setItemPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="itemType" className="block text-sm font-medium leading-6 text-gray-900">
                Item Type
              </label>
              <div className="mt-2">
                <select
                  id="itemType"
                  name="itemType"
                  defaultValue={'DEFAULT'}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={(e) => setItemType(e.target.value)}
                >
                  <option value="DEFAULT" disabled={itemType !== null}>-- Please Select --</option>
                  <option>Food</option>
                  <option>Electronics</option>
                  <option>Clothes</option>
                  <option>Toys</option>
                  <option>Others</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                  onChange={(e) => setItemAbout(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the item.</p>
            </div>

            {/* Image loading... */}
            <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        {/* image_url: {image_url} */}
                        {/* {image_url && <Image
                            src={image_url}
                            // src = "https://bafybeigdd5m4fbserkbrz4yz2sdxcmx2w72edbtdd52stjwjlmi52gr3py.ipfs.dweb.link/%E8%9C%82%E9%B3%A5.jpg"
                            alt="Cover photo"
                            width={500}
                            height={500}
                            className="mx-auto h-auto w-100 text-gray-400"
                        />} */}
                        <div className="mt-4 flex text-sm justify-center leading-6 text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                            <span>Upload a file</span>
                            {/* <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={(e)=>upload(e)}/> */}
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" />
                        </label>
                        
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 5MB</p>
                    </div>
                </div>
                    {/* <button className='border border-solid rounded hover:opacity-50' onClick={(e)=>upload(e)}>Upload now</button> */}
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="reset" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          disabled = {isLoading}
        >
          {isLoading && <span>Uploading...</span>}
          {!isLoading && <span>Upload a item</span>}
        </button>
      </div>
    </form>
  )
}
