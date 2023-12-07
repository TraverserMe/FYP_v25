// SPDX-License-Identifier: MIT
//deploy in remix
pragma solidity ^0.8.0;

contract MainContract {
    address[] public deployedItemContracts;
    uint256 public totalItems;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function createNewItemContract(
        string memory itemName,
        string memory itemDescription,
        string memory itemType,
        string memory itemImageIPFSHash,
        address seller,
        uint256 price
    ) public returns (address, uint256) {
        ItemContract newItemContract = new ItemContract(
            totalItems,
            itemName,
            itemDescription,
            itemType,
            itemImageIPFSHash,
            seller,
            price
        );
        deployedItemContracts.push(address(newItemContract));
        emit NewItemContractCreated(address(newItemContract), totalItems);
        totalItems++;
        return (address(newItemContract), (totalItems - 1));
    }

    function getItemContractCount() public view returns (uint256) {
        return deployedItemContracts.length;
    }

    function getItemContractAddress(
        uint256 index
    ) public view returns (address) {
        require(index < deployedItemContracts.length, "Invalid index");

        return deployedItemContracts[index];
    }

    event NewItemContractCreated(address itemContractAddress, uint256 itemId);
}

contract ItemContract {
    uint256 public itemId;
    string public itemName;
    string public itemDescription;
    string public itemType;
    string public itemImageIPFSHash;
    address public seller;
    bool public isSold;
    uint256 public price;

    constructor(
        uint256 _itemId,
        string memory _itemName,
        string memory _itemDescription,
        string memory _itemType,
        string memory _itemImageIPFSHash,
        address _seller,
        uint256 _price
    ) {
        itemId = _itemId;
        itemName = _itemName;
        itemDescription = _itemDescription;
        itemType = _itemType;
        itemImageIPFSHash = _itemImageIPFSHash;
        seller = _seller;
        isSold = false;
        price = _price;
    }

    function paySeller() public payable {
        require(!isSold, "Item is already sold");
        require(msg.value >= price, "Insufficient funds");

        // Transfer funds to the seller
        (bool success, ) = seller.call{value: price}("");
        require(success, "Payment failed");

        // Mark the item as sold
        isSold = true;
    }

    function getItemId() public view returns (uint256) {
        return itemId;
    }

    function getItemName() public view returns (string memory) {
        return itemName;
    }

    function getItemDescription() public view returns (string memory) {
        return itemDescription;
    }

    function getItemType() public view returns (string memory) {
        return itemType;
    }

    function getItemImageIPFSHash() public view returns (string memory) {
        return itemImageIPFSHash;
    }

    function getSeller() public view returns (address) {
        return seller;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getIsSold() public view returns (bool) {
        return isSold;
    }

    function getAll()
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            address,
            uint256,
            bool
        )
    {
        return (
            itemId,
            itemName,
            itemDescription,
            itemType,
            itemImageIPFSHash,
            seller,
            price,
            isSold
        );
    }
}
