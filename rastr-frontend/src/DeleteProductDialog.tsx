import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type DeleteProductType = {
    isOpen: boolean
    onClose: () => void 
    productId: number
    callback: (productId: number) => void
}

export default function DeleteProductDialog({isOpen, onClose, productId, callback}: DeleteProductType) {

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={onClose}
      >
        <DialogTitle>
          "Delete"
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
          style={{borderColor: "red", color: "red", backgroundColor: "#fbd9d3"}}
          variant='outlined' onClick={() => {
            callback(productId)
            onClose()
            }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}