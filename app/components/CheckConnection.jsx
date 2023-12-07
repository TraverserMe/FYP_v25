
import { useState, useEffect } from 'react';

export default function CheckConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(true);
  const [account, setAccount] = useState('');

  useEffect(() => {
    connect();
    
  }, []);

  async function connect() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        setAccount(accounts[0]);
      } catch (e) {
        console.error(e);
      }
    } else {
      checkConnect();
    }
  }

  async function checkConnect() {
    if (window.ethereum) {
      setHasMetamask(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          setIsConnected(true);
          setAccount(accounts[0]);
          window.location.reload();
        } else {
          console.log("Metamask is not connected");
        }
      } catch(e) {
        setIsConnected(false);
      }
    }
  }

  return { isConnected, hasMetamask, connect, account };
}
