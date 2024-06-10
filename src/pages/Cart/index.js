import { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
} from "@mui/material";
import Header from "../../components/Header";
import { getCart } from "../../utils/api_cart";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const cart = getCart();
    setCartItems(cart.map((item) => ({ ...item })));
  }, []);
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const handleRemoveItem = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };
  return (
    <Container>
      <Header />
      {cartItems.length === 0 ? (
        <Box textAlign="center" mt={3}>
          <Typography variant="h5">Cart is empty</Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Song</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.description}
                    </TableCell>
                    <TableCell align="center">${item.price}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.price * item.quantity}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleRemoveItem(index)}
                        sx={{ backgroundColor: "red", color: "white" }}
                      >
                        Remove
                      </Button>{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Total: ${calculateTotal()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Box mt={3} textAlign="right">
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
