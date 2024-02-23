import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';

const ContractAddress = '0x4765b6cB73C0488f5B480CF65B5d1936bf5E37a2'; // Replace with your actual contract address
const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "details",
				"type": "string"
			}
		],
		"name": "ProductCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			}
		],
		"name": "ProductDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newDetails",
				"type": "string"
			}
		],
		"name": "ProductUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "deleteProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProducts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "exists",
						"type": "bool"
					}
				],
				"internalType": "struct ProductContract.Product[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getProductDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "details",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newDetails",
				"type": "string"
			}
		],
		"name": "updateProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

type product = {
  id: number,
  name: string,
  price: number,
  details: string,
  exists: boolean
};

const Product: React.FC = () => {

  const web3 = useRef<any>(null);
  const contract = useRef<any>(null);
  const [account, setAccount] = useState<any>(null);

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [productIdToUpdate, setProductIdToUpdate] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [productIdToDelete, setProductIdToDelete] = useState('');
  const [productIdToGetDetails, setProductIdToGetDetails] = useState('');
  const [productDetailsResult, setProductDetailsResult] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  // Set up web3 with the current provider
  const web3Instance = new Web3((window as any).ethereum);
  
  const handleLogin = async () => {
    try {
      if ((window as any).ethereum) {
        try {
          // Request account access if needed
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          
          web3.current = web3Instance;
          contract.current = new web3Instance.eth.Contract(ABI, ContractAddress);

          // Get the current account
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.error('MetaMask not detected!');
      }
    } catch (error) {
      console.error('Error logging in with MetaMask:', error);
    }
  };

  const createProduct = async () => {
    // console.log(contract);
    await (contract.current).methods.createProduct(productName, productPrice, productDetails)
      .send({ from: account});
  };

  const updateProduct = async () => {
    await (contract.current).methods.updateProduct(productIdToUpdate, newName, newPrice, newDetails)
      .send({ from: account });
  };

  const deleteProduct = async () => {
    await (contract.current).methods.deleteProduct(productIdToDelete)
      .send({ from: account });
  };

  const getProductDetails = async () => {
    const result:any = await (contract.current).methods.getProductDetails(productIdToGetDetails).call();
    setProductDetailsResult(`Name: ${result[0]}, Price: ${result[1]}, Details: ${result[2]}`);
  };

  const getAllProducts = async () => {
    const result:any = await (contract.current).methods.getAllProducts().call();
    console.log(result);
    setAllProducts(result);
  };

  return (
    <div>
       <header className="App-header">
        <h1>Ethereum MetaMask Login</h1>

        {account ? (
          <div>
            <p>Connected Account: {account}</p>
          </div>
        ) : (
          <button onClick={handleLogin}>Connect to MetaMask</button>
        )}
      </header>
      <h1>Product Management</h1>
      
      <div>
        <h2>Create Product</h2>
        <label>Name:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <label>Price:</label>
        <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
        <label>Details:</label>
        <input type="text" value={productDetails} onChange={(e) => setProductDetails(e.target.value)} />
        <button onClick={createProduct}>Create</button>
      </div>

      <div>
        <h2>Update Product</h2>
        <label>Product ID:</label>
        <input type="number" value={productIdToUpdate} onChange={(e) => setProductIdToUpdate(e.target.value)} />
        <label>New Name:</label>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <label>New Price:</label>
        <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
        <label>New Details:</label>
        <input type="text" value={newDetails} onChange={(e) => setNewDetails(e.target.value)} />
        <button onClick={updateProduct}>Update</button>
      </div>

      <div>
        <h2>Delete Product</h2>
        <label>Product ID:</label>
        <input type="number" value={productIdToDelete} onChange={(e) => setProductIdToDelete(e.target.value)} />
        <button onClick={deleteProduct}>Delete</button>
      </div>

      <div>
        <h2>Get Product Details</h2>
        <label>Product ID:</label>
        <input type="number" value={productIdToGetDetails} onChange={(e) => setProductIdToGetDetails(e.target.value)} />
        <button onClick={getProductDetails}>Get Details</button>
        <p>{productDetailsResult}</p>
      </div>

      <div>
        <h2>Get All Products</h2>
        <button onClick={getAllProducts}>Get All Products</button>
        <ul>
          {allProducts.map((product:product, index) => (
            <li key={index}>ID: {product.id.toString()}, Name: {product.name}, 
            Price: {product.price.toString()}, 
            Details: {product.details}, </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Product;