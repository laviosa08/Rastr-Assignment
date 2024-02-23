import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Product } from './Product';

type ProductDialogProps = {
  isOpen: boolean
  onClose: () => void 
  type: string
  isLoading: boolean
  currentProduct?: Product
  callback: (product: Product) => void
}

export default function ProductDialog({isOpen, onClose, type, isLoading, currentProduct, callback}: ProductDialogProps) {
  
    return (
      <React.Fragment>
        <Dialog
          open={isOpen}
          onClose={onClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              console.log(formJson.name);
              const product: Product = {
                id: currentProduct?.id,
                name: formJson.name,
                price: formJson.price,
                details: formJson.details
              }
              callback(product);
              // TODO: Show loader or Toast
              onClose();
            },
          }}
        >
          <DialogTitle>{type} Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {type === "Create" ? 'Create New Product' : `Update Product ID: ${currentProduct?.id}`}
            </DialogContentText>
            <TextField
              required
              margin="dense"
              name="name"
              label="Name"
              defaultValue={currentProduct?.name}
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              name="price"
              type="number"
              label="Price"
              defaultValue={currentProduct?.price?.toString()}
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              name="details"
              label="Details"
              defaultValue={currentProduct?.details}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button 
            style={{borderColor: "blue", color: "blue", backgroundColor: "#dff2ff"}}
            variant='outlined' type="submit">{type === "Create" ? 'Create Product' : 'Update Product'}</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }