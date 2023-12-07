"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import ConnectButton from "./ConnectButton";

export default function Navbar({ fixed }) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-2 bg-gray-500 mb-3 w-full ">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex items-center justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href={'/'}>
              <Image
                src="/images/icon.png"
                height={50}
                width={50}
                alt="Dao"
                priority={true}
              />
            </Link>
    
            <button
              className="h-10 items-center text-white cursor-pointer leading-none px-3 border border-solid rounded bg-black opacity-50 block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>

          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link href={'/'} className='px-4 py-2 flex items-center text-ls uppercase font-bold leading-snug text-black hover:opacity-75'>
                  <i className="fab fa-facebook-square text-lg leading-lg opacity-75"></i><span className="ml-2 text-white ">D.A.O</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={'/sell'} className='px-4 py-2 flex items-center text-ls uppercase font-bold leading-snug text-black hover:opacity-75'>
                  <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i><span className="ml-2 text-white ">Sell</span>
                </Link>
              </li>
              <li className="nav-item">
                {/* <Connect/> */}
                <ConnectButton/>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
