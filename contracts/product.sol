
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
        uint256 existingProductsCount = 0;

        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].exists) {
                existingProductsCount++;
            }
        }
        Product[] memory allProducts = new Product[](existingProductsCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].exists) {
                allProducts[currentIndex] = products[i];
                currentIndex++;
            }
        }
        return allProducts;
    }
}
