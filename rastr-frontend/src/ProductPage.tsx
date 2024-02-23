import {
  Button,
  Card,
  CardActions,
  CardContent,
  ListItemText,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import Web3 from "web3";
import ProductDialog from "./ProductDialog";
import { Product } from "./Product";
import { ABI, ContractAddress } from "./Constants";
import DeleteProductDialog from "./DeleteProductDialog";
import { ThreeDot } from "react-loading-indicators";

export const ProductPage: React.FC = () => {
  const web3 = useRef<any>(null);
  const contract = useRef<any>(null);
  const [account, setAccount] = useState<any>(undefined);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // Set up web3 with the current provider
  const web3Instance = new Web3((window as any).ethereum);

  const loginUser = async () => {
    try {
      if ((window as any).ethereum) {
        try {
          // Request account access if needed
          await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });

          web3.current = web3Instance;
          contract.current = new web3Instance.eth.Contract(
            ABI,
            ContractAddress
          );

          // Get the current account
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask not detected!");
      }
    } catch (error) {
      console.error("Error logging in with MetaMask:", error);
    }
  };

  useEffect(() => {
    if (account !== undefined) getAllProducts();
  }, [account]);

  const createProduct = async (product: Product) => {
    setLoading(true);
    await contract.current.methods
      .createProduct(product.name, product.price, product.details)
      .send({ from: account });
    setLoading(false);
    getAllProducts();
  };

  const updateProduct = async (product: Product) => {
    console.log(product);
    setLoading(true);
    await contract.current.methods
      .updateProduct(product.id, product.name, product.price, product.details)
      .send({ from: account });
    setLoading(false);
    getAllProducts();
  };

  const deleteProduct = async (productId: number) => {
    setLoading(true);
    await contract.current.methods
      .deleteProduct(productId)
      .send({ from: account });
    setLoading(false);
    getAllProducts();
  };

  const getAllProducts = async () => {
    setLoading(true);
    const result: Product[] = await contract.current.methods
      .getAllProducts()
      .call();
    setAllProducts(result);
    setLoading(false);
  };

  return (
    <div style={{position: "absolute", top: 0, height: "100vh", padding: 28,
	width: "100vw", backgroundColor: "#D9FFFFFF" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            height: "100vh",
            width: "100vw",
            left: 0,
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThreeDot
            color="blue"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      )}

      <header className="App-header">
        <h1>Login Details</h1>
        {account ? (
          <div>
            <Typography> Connected Account: {account} </Typography>
            <br />
          </div>
        ) : (
          <div>
            <Typography variant="h6">
              Login with Metamask wallet to see all product in the store
            </Typography>
            <br />
            <Button variant="contained" onClick={loginUser}>
              Connect to MetaMask
            </Button>
          </div>
        )}
      </header>

      {account && (
        <Button
          style={{
            borderColor: "blue",
            color: "blue",
            backgroundColor: "#dff2ff",
          }}
          variant="outlined"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Product
        </Button>
      )}

      {allProducts.length > 0 && (
        <div style={{maxWidth: '50%'}} >
          <br />
          <Typography variant="h6">All Products</Typography>
            {allProducts.map((product) => (
              <div>
                <br />
                <Card style={{padding: 8}} variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <ListItemText primary="Name" secondary={product.name} />
                      <ListItemText
                        primary="Details"
                        secondary={product.details}
                      />
                      <ListItemText
                        primary="Price"
                        secondary={`$${product.price?.toString()}`}
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        style={{
                          borderColor: "green",
                          color: "green",
                          backgroundColor: "#e2fff1",
                        }}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditDialogOpen(true);
                          setSelectedProduct(product);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        style={{
                          borderColor: "red",
                          color: "red",
                          backgroundColor: "#fbd9d3",
                        }}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </React.Fragment>
                </Card>
              </div>
            ))}
        </div>
      )}

      <ProductDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        type="Create"
        isLoading={isLoading}
        callback={(product) => {
          createProduct(product);
        }}
      />

      <ProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        type="Edit"
        isLoading={isLoading}
        currentProduct={selectedProduct}
        callback={(product) => {
          updateProduct(product);
        }}
      />

      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        productId={selectedProduct?.id ?? 0}
        callback={(id) => {
          deleteProduct(id);
        }}
      />
    </div>
  );
};
