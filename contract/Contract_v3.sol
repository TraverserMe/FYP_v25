// SPDX-License-Identifier: MIT
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
        address payable seller,
        uint256 price
    ) public returns (address, uint256) {
        ItemContract newItemContract = new ItemContract(
            totalItems,
            itemName,
            itemDescription,
            itemType,
            itemImageIPFSHash,
            seller,
            price,
            payable(owner)
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

    function getAllItemContracts() public view returns (address[] memory) {
        return deployedItemContracts;
    }

    event NewItemContractCreated(address itemContractAddress, uint256 itemId);
}

contract ItemContract {
    uint256 public itemId;
    string public itemName;
    string public itemDescription;
    string public itemType;
    string public itemImageIPFSHash;
    address payable public ownerAddress;
    address payable public seller;
    bool public isSold;
    uint256 public price;
    bool public buyerReceived;
    address public buyer;
    uint256 public deliveryConfirmedTime;

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        DELIVERY_CONFIRMED,
        COMPLETE
    }
    State public currentState;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only the buyer can perform this action.");
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only the seller can perform this action."
        );
        _;
    }

    modifier inState(State expectedState) {
        require(
            currentState == expectedState,
            "This action cannot be performed in the current state."
        );
        _;
    }

    constructor(
        uint256 _itemId,
        string memory _itemName,
        string memory _itemDescription,
        string memory _itemType,
        string memory _itemImageIPFSHash,
        address payable _seller,
        uint256 _price,
        address payable _owner
    ) {
        itemId = _itemId;
        itemName = _itemName;
        itemDescription = _itemDescription;
        itemType = _itemType;
        itemImageIPFSHash = _itemImageIPFSHash;
        seller = _seller;
        isSold = false;
        price = _price;
        buyerReceived = false;
        ownerAddress = _owner;
        currentState = State.AWAITING_PAYMENT;
    }

    function paySeller() public payable inState(State.AWAITING_PAYMENT) {
        require(msg.value >= price, "Insufficient funds");

        // Transfer funds to the company address
        (bool success, ) = ownerAddress.call{value: price}("");
        require(success, "Payment to owner failed");

        // Mark the item as sold
        isSold = true;

        // Mark the buyer
        buyer = msg.sender;

        currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery()
        public
        onlySeller
        inState(State.AWAITING_DELIVERY)
    {
        currentState = State.DELIVERY_CONFIRMED;
        deliveryConfirmedTime = block.timestamp;
    }

    function confirmReceipt()
        public
        onlyBuyer
        inState(State.DELIVERY_CONFIRMED)
    {
        // Transfer funds to the seller
        (bool success, ) = seller.call{value: price}("");
        require(success, "Payment to seller failed");

        currentState = State.COMPLETE;
    }

    function refundBuyer() public inState(State.DELIVERY_CONFIRMED) {
        require(
            block.timestamp >= deliveryConfirmedTime + 1 weeks,
            "Refund time has not been reached"
        );

        // Refund the buyer
        (bool success, ) = buyer.call{value: price}("");
        require(success, "Refund to buyer failed");

        currentState = State.AWAITING_PAYMENT;
        isSold = false;
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
            bool,
            bool,
            State
        )
    {
        return (
            itemId,
            itemName,
            itemDescription,
            itemType,
            itemImageIPFSHash,
            ownerAddress,
            price,
            isSold,
            buyerReceived,
            currentState
        );
    }
}
