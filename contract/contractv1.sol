// SPDX-License-Identifier: MIT
//deploy in remix
pragma solidity ^0.8.0;

contract MainContract {
    address[] public deployedItemContracts;
    uint256 public totalItems;

    /**
     * @dev Create a new item contract.
     * @param itemName The name of the item.
     * @param seller The address of the seller.
     * @param price The price of the item.
     * @return The address and ID of the newly created item contract.
     */
    function createNewItemContract(
        string memory itemName,
        address seller,
        uint256 price
    ) public returns (address, uint256) {
        totalItems++;
        ItemContract newItemContract = new ItemContract(totalItems, itemName, seller, price);
        deployedItemContracts.push(address(newItemContract));
        emit NewItemContractCreated(address(newItemContract), totalItems);
        return (address(newItemContract), totalItems);
    }

    function getItemContractCount() public view returns (uint256) {
        return deployedItemContracts.length;
    }

    function getItemContractAddress(uint256 index) public view returns (address) {
        require(index < deployedItemContracts.length, "Invalid index");

        return deployedItemContracts[index];
    }

    event NewItemContractCreated(address itemContractAddress, uint256 itemId);
}

contract ItemContract {
    uint256 public itemId;
    string public itemName;
    address public seller;
    bool public isSold;
    uint256 public price;

    constructor(
        uint256 _itemId,
        string memory _itemName,
        address _seller,
        uint256 _price
    ) {
        itemId = _itemId;
        itemName = _itemName;
        seller = _seller;
        isSold = false;
        price = _price;
    }

    /**
     * @dev Pay the seller and mark the item as sold.
     */
    function paySeller() public payable {
        require(!isSold, "Item is already sold");
        require(msg.value >= price, "Insufficient funds");

        // Transfer funds to the seller
        (bool success, ) = seller.call{value: price}("");
        require(success, "Payment failed");

        // Mark the item as sold
        isSold = true;
    }

    /**
     * @dev Get the ID of the item.
     */
    function getItemId() public view returns (uint256) {
        return itemId;
    }

    /**
     * @dev Get the name of the item.
     */
    function getItemName() public view returns (string memory) {
        return itemName;
    }

    /**
     * @dev Get the address of the seller.
     */
    function getSeller() public view returns (address) {
        return seller;
    }

    /**
     * @dev Get the price of the item.
     */
    function getPrice() public view returns (uint256) {
        return price;
    }

    /**
     * @dev Check if the item is sold.
     */
    function getIsSold() public view returns (bool) {
        return isSold;
    }
}