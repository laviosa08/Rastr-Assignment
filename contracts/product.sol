
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductContract {
    address public owner;
    
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        string details;
        bool exists;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductCreated(uint256 productId, string name, uint256 price, string details);
    event ProductDeleted(uint256 productId);
    event ProductUpdated(uint256 productId, string newName, uint256 newPrice, string newDetails);

 //Can be used in order to make a function executable by only contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProduct(string memory _name, uint256 _price, string memory _details) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _price, _details, true);
        emit ProductCreated(productCount, _name, _price, _details);
    }

    function deleteProduct(uint256 _productId) public {
        require(products[_productId].exists, "Product does not exist");
        delete products[_productId];
        emit ProductDeleted(_productId);
    }

    function getProductDetails(uint256 _productId) public view returns (uint256 ,string memory, uint256, string memory) {
        require(products[_productId].exists, "Product does not exist");
        Product memory product = products[_productId];
        return (product.id, product.name, product.price, product.details);
    }

/**
    currently optional parameters are not supported in solidity and hence for updating a single property
    we have to either add individual functions or use update with all the other parameters having previous values.
 */
    function updateProduct(uint256 _productId, string memory _newName, uint256 _newPrice, string memory _newDetails) public onlyOwner {
        require(products[_productId].exists, "Product does not exist");
        
        Product storage product = products[_productId];
        if(bytes(_newName).length > 0){
            product.name = _newName;
        }
        if(_newPrice > 0){
            product.price = _newPrice;
        }
        if(bytes(_newDetails).length > 0){
            product.details = _newDetails;
        }

        emit ProductUpdated(_productId, _newName, _newPrice, _newDetails);
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) {
            allProducts[i - 1] = products[i];
        }
        return allProducts;
    }
}