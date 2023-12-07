import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image'

import { WEB3_TOKEN } from './constants3';

const { Web3Storage, getFilesFromPath } = require('web3.storage')
const storage = new Web3Storage({ token: WEB3_TOKEN })

export default function ItemImage() {
    const [image_url, setImage_url] = useState("")
    
    async function getFiles (path) {
        const files = await getFilesFromPath(path)
        console.log(`read ${files.length} file(s) from ${path}`)
        return files
    }
    
    async function upload(e) {
        e.preventDefault()
        // const files = await getFilesFromPath(process.env.PATH_TO_ADD)
        try{
            const fileInput = document.querySelector('input[type="file"]')
            console.log(fileInput.files[0].name,fileInput.files[0].type)
            let file_name = encodeURIComponent((fileInput.files[0].name))
            console.log(file_name)
            const cid = await storage.put(fileInput.files)
            console.log(`IPFS CID: ${cid}`)
            setImage_url(`https://${cid}.ipfs.dweb.link/${file_name}`)
            console.log(`URL: https://${cid}.ipfs.dweb.link/${file_name}}`)
        }catch(e){
            console.log(e)
        }
    }

    
  return (
    <div className="col-span-full">
        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
        Cover photo
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
                {/* image_url: {image_url} */}
                {image_url && <Image
                    src={image_url}
                    // src = "https://bafybeigdd5m4fbserkbrz4yz2sdxcmx2w72edbtdd52stjwjlmi52gr3py.ipfs.dweb.link/%E8%9C%82%E9%B3%A5.jpg"
                    alt="Cover photo"
                    width={500}
                    height={500}
                    className="mx-auto h-auto w-100 text-gray-400"
                />}
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
  )
}
