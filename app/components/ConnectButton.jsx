
import React from 'react';
import CheckConnection from './CheckConnection';

export default function ConnectButton() {
  const { isConnected, hasMetamask, connect } = CheckConnection();

  const buttonText = isConnected ? 'Connected' : hasMetamask ? 'Connect' : 'Please install metamask';
  const buttonColor = isConnected ? 'text-sky-900' : hasMetamask ? 'text-white' : 'text-rose-900';
  const onClick = isConnected || !hasMetamask ? null : connect;

  return (
    <button className="border border-solid rounded hover:opacity-50" onClick={onClick}>
      <span className={`px-4 py-2 flex items-center text-ls uppercase font-bold leading-snug ${buttonColor}`}>
        {buttonText}
      </span>
    </button>
  );
}
