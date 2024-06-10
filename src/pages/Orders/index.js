import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  Container,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { getOrders, deleteOrder, updateOrder } from "../../utils/api_orders";
import Header from "../../components/Header";
import { useCookies } from "react-cookie";

export default function Orders() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: orders = [] } = useQuery({
    queryKey: ["order", token],
    queryFn: () => getOrders(token),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      enqueueSnackbar("Order Deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleRemoveOrder = (_id) => {
    const answer = window.confirm("Remove Order?");
    if (answer) {
      deleteOrderMutation.mutate({
        _id: _id,
        token: token,
      });
    }
  };

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      enqueueSnackbar("Order Updated", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleUpdateOrder = (order, status) => {
    updateOrderMutation.mutate({
      ...order,
      status: status,
      token,
    });
  };

  return (
    <>
      <Container align="center">
        <Header />
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "1200px" }}
          align="center"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="left">Products</TableCell>
                <TableCell align="left">Total Amount</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Payment Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {orders.length > 0 ? (
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell align="left">
                      {order.customerName}
                      <br />({order.customerEmail})
                    </TableCell>

                    <TableCell align="left">
                      {order.products.map((product) => (
                        <Typography variant="p" display={"flex"}>
                          {product.name} ({product.quantity})
                        </Typography>
                      ))}
                    </TableCell>

                    <TableCell align="left">${order.totalPrice}</TableCell>

                    <TableCell align="left">
                      <Select
                        fullWidth
                        value={order.status}
                        label="status"
                        disabled={order.status === "pending"}
                        onChange={(e) => {
                          handleUpdateOrder(order, e.target.value);
                        }}
                      >
                        <MenuItem value={"pending"} disabled>
                          Pending
                        </MenuItem>
                        <MenuItem value={"paid"}>Paid</MenuItem>
                        <MenuItem value={"failed"}>Failed</MenuItem>
                        <MenuItem value={"completed"}>Completed</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell>{order.paid_at}</TableCell>
                    <TableCell align="right">
                      {order.status === "pending" && (
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => {
                            handleRemoveOrder(order._id);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="h6">No Orders</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
