import { Typography, Divider, Box, Button, Avatar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { emptyCart } from "../../utils/api_cart";

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const location = useLocation();
  const navigate = useNavigate();

  let pageTitle = "AudioCamp";

  if (location.pathname === "/cart") {
    pageTitle = "Cart";
  } else if (location.pathname === "/checkout") {
    pageTitle = "Checkout";
  } else if (location.pathname === "/orders") {
    pageTitle = "Orders";
  } else if (location.pathname === "/login") {
    pageTitle = "Login";
  } else if (location.pathname === "/register") {
    pageTitle = "Register";
  }

  const handleLogout = () => {
    // remove the currentUser cookie
    removeCookie("currentUser");
    // empty the cart
    emptyCart();
    // redirect back to login
    navigate("/login");
  };

  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          textAlign: "center",
          marginTop: "20px",
          marginBottm: "20px",
          fontWeight: "bold",
          fontSize: "40px",
        }}
      >
        {pageTitle}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Button
            onClick={() => {
              navigate("/");
            }}
            style={{
              textTransform: "capitalize",
            }}
          >
            Home
          </Button>
          <Button
            style={{
              textTransform: "capitalize",
              color: location.pathname === "/cart" ? "white" : "#0288d1",
              backgroundColor:
                location.pathname === "/cart" ? "#0288d1" : "white",
            }}
            onClick={() => {
              navigate("/cart");
            }}
          >
            Cart
          </Button>
          <Button
            style={{
              textTransform: "capitalize",
              color: location.pathname === "/orders" ? "white" : "#0288d1",
              backgroundColor:
                location.pathname === "/orders" ? "#0288d1" : "white",
            }}
            onClick={() => {
              navigate("/orders");
            }}
          >
            Orders
          </Button>
          <Button
            style={{
              textTransform: "capitalize",
              textAlign: "center",
              color: location.pathname === "/comments" ? "white" : "#0288d1",
              backgroundColor:
                location.pathname === "/comments" ? "#0288d1" : "white",
            }}
            onClick={() => {
              navigate("/comments");
            }}
          >
            Free Chat
          </Button>
          {currentUser && currentUser.role === "admin" ? (
            <div>
              <Button
                style={{
                  textTransform: "capitalize",
                  color: location.pathname === "/genre" ? "white" : "inherit",
                  backgroundColor:
                    location.pathname === "/genre" ? "#238be6" : "inherit",
                }}
                onClick={() => {
                  navigate("/genre");
                }}
              >
                Genre
              </Button>
              <Button
                style={{
                  textTransform: "capitalize",
                  color: location.pathname === "/artist" ? "white" : "inherit",
                  backgroundColor:
                    location.pathname === "/artist" ? "#238be6" : "inherit",
                }}
                onClick={() => {
                  navigate("/artist");
                }}
              >
                Artist
              </Button>
            </div>
          ) : null}
        </Box>
        {currentUser ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar></Avatar>
            <Button
              style={{
                textTransform: "capitalize",
                color: location.pathname === "/profile" ? "white" : "#0288d1",
                backgroundColor:
                  location.pathname === "/profile" ? "#0288d1" : "white",
              }}
              onClick={() => {
                navigate("/profile");
              }}
            >
              Profile
            </Button>

            <Button
              style={{
                textTransform: "capitalize",
              }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex" }}>
            <Button
              style={{
                textTransform: "capitalize",
                color: location.pathname === "/login" ? "white" : "#0288d1",
                backgroundColor:
                  location.pathname === "/login" ? "#0288d1" : "white",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              style={{
                textTransform: "capitalize",
                color: location.pathname === "/register" ? "white" : "#0288d1",
                backgroundColor:
                  location.pathname === "/register" ? "#0288d1" : "white",
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
      <Divider />
    </>
  );
}
