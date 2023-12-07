"use client"
import React, { useState, useEffect }  from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";

const ethers = require("ethers")
// import { ethers } from "ethers";

import CheckConnection from "./CheckConnection";

export default function SellItem() {
  const router = useRouter();
  const { isConnected, hasMetamask, connect } = CheckConnection();
  const [ isLoading ,setIsLoading ] = useState(false)
  const [ account, setAccount ] = useState("");
  const [ filename , setFilename ] = useState("Upload a image");
  const [ preview, setPreview ] = useState();

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

  const fileInput = (e)=> {
    
    const fileInput = document.querySelector('input[type="file"]')
    
    // console.log(fileInput.files[0].name,fileInput.files[0].type)
    setFilename(fileInput.files[0].name)

    // Create a URL representing the file
    const fileURL = URL.createObjectURL(fileInput.files[0]);

    // Set the preview state to this URL
    setPreview(fileURL);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const confirm = window.confirm(
      "Are you sure you want to upload this item? You cannot modify the item after uploading except for the prices."
      );
    if (!confirm) return;
    setIsLoading(true)

    const fileInput = document.querySelector('input[type="file"]')
    const file = fileInput.files[0];
    // console.log(fileInput.files[0].name,fileInput.files[0].type)

    // let file_name = encodeURIComponent((fileInput.files[0].name))

    // console.log(itemName,itemType, itemAbout, itemPrice, file.type)
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
        setPreview()
        setIsLoading(false)
        return;
      }else if (file.type != "image/jpg" && file.type != "image/png") {
        alert("Please upload only jpg or png file.")
        document.querySelector('input[type="file"]').value = ''
        setPreview()
        setIsLoading(false)
        return;
      }

      // console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
      const price = ethers.utils.parseEther(itemPrice.toString());
      // console.log(price)

      try{
        const itemImageIPFSHash = await uploadImageToIPFS(file);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // console.log(signer)
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MAIN_CONTRACT_ID, process.env.NEXT_PUBLIC_MAIN_ABI, signer);
        // console.log(contract)
        const transaction = await contract.createNewItemContract(itemName, itemAbout, itemType, itemImageIPFSHash, account, price);
        await transaction.wait();
        // console.log(transaction);
        console.log("https://ipfs.io/ipfs/"+itemImageIPFSHash)
        alert("Item uploaded successfully!")
        setIsLoading(false)
        router.push("/")
      }catch(e){
        console.log(e)
      }
    }
}

async function uploadImageToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
    size: file.size,
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options);

  var res = '';
  try {
      res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
        'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_API_SECRET}`
      }
    });
    // console.log(res.data);
  }catch(e){
    console.log(e)
  }

  return res.data.IpfsHash;
}

return (
  <form onSubmit={handleSubmit}>
      <div className="space-y-15">
        <div className="border-b border-gray-900/10 pb-12 relative ">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Sell</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Account Number: {isConnected && <span className="font-bold" id='acc_number'>{account}</span>}
          </p>
          <button 
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full absolute top-0 right-0 '
            onClick={() => {router.push('/seller')}}
          >
            Seller Dashboard
          </button>
        {account && 
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
                  defaultValue={0.00}
                  min={0.01}
                  step="any"
                  id="itemPrice"
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value !== "") {
                      setItemPrice(value);
                    }
                  }}
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
                            <span>{filename}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={fileInput}/>
                          </label>
                          {/* <p className="pl-1">or drag and drop</p> */}
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        {preview && <img src={preview} alt="Preview" />}
                    </div>
                </div>
                    {/* <button className='border border-solid rounded hover:opacity-50' onClick={(e)=>upload(e)}>Upload now</button> */}
            </div>

          </div>
          }
        </div>
      </div>
      {account ?
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
      :
      <div>
        Please connect to metamask first
      </div>
      }
    </form>
  )
}
