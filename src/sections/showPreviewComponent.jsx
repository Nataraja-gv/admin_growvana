import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const ShowPreviewComponent = ({ invoiceData, open, onClose }) => {
  if (!invoiceData || !invoiceData.length) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          <Typography>No invoice data available</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Invoice Preview
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {invoiceData.map((invoice, index) => (
          <Paper key={invoice._id} elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Invoice
            </Typography>
            {/* Invoice Header */}

            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                customer Details
              </Typography>
              <Typography>Id: {invoice?.userId?._id}</Typography>
              <Typography>Name: {invoice?.userId?.name}</Typography>
              <Typography>Email: {invoice?.userId?.email}</Typography>
            </Box>
            {/* Order Details */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Order Details
              </Typography>
              <Typography>Order ID: {invoice._id}</Typography>
              <Typography>
                Date: {dayjs(invoice.createdAt).format("DD/MM/YYYY")}
              </Typography>
              <Typography>Status: {invoice.orderStatus}</Typography>
            </Box>

            {/* Shipping Address */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>{invoice.address.firstName}</Typography>
              <Typography>{invoice.address.streetAddress}</Typography>
              <Typography>
                {invoice.address.city}, {invoice.address.state} -{" "}
                {invoice.address.pinCode}
              </Typography>
              <Typography>Phone: {invoice.address.phoneNumber}</Typography>
            </Box>

            {/* Items Ordered */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Items Ordered
              </Typography>
              {invoice.items.map((item) => (
                <Typography key={item._id}>
                  {item.product.product_name} * {item.quantity} ={" "}
                  {item.product.offer_price} Rs
                </Typography>
              ))}
            </Box>

            {/* Payment Details */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Payment Details
              </Typography>
              <Typography>Payment Method: {invoice.paymentMethod}</Typography>
              <Typography>Payment Status: {invoice.paymentStatus}</Typography>
              <Typography>Total Amount: Rs.{invoice.totalAmount}</Typography>
            </Box>

            {/* Note */}
            <Box>
              <Typography variant="caption" fontStyle="italic">
                Note:
              </Typography>
              <Typography variant="caption" fontStyle="italic">
                This is a system-generated invoice and does not require a
                signature.
              </Typography>
            </Box>
          </Paper>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowPreviewComponent;
