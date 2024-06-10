import { Container, Typography, Box, Button } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
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
import { getCart, removeProductFromCart } from "../../utils/api_cart";

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const deleteCartMutation = useMutation({
    mutationFn: removeProductFromCart,
    onSuccess: () => {
      enqueueSnackbar("Product is Removed from the cart", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total = total + item.quantity * item.price;
    });
    return total;
  };

  const handleRemoveFromCart = (_id) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this item from cart?"
    );
    if (confirm) {
      deleteCartMutation.mutate(_id);
    }
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
                  <TableCell>Songs</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.musicName}
                    </TableCell>
                    <TableCell align="center">${item.price}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          handleRemoveFromCart(item._id);
                        }}
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
                    Total: ${calculateTotal().toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
