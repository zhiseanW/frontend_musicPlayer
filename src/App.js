import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import { SnackbarProvider } from "notistack";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import PaymentVerify from "./pages/PaymentVerify";
import PageLogin from "./pages/PageLogin";
import PageRegister from "./pages/PageRegister";
import { CookiesProvider } from "react-cookie";

import ProfilePage from "./pages/Profile";
import ArtistPage from "./pages/Artist";
import MusicEdit from "./pages/MusicEdit";
import MusicAdd from "./pages/MusicAdd";
import GenrePage from "./pages/Genre";
import MusicDetails from "./pages/MusicDetails";
import Comments from "./components/Comments";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "" }}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<MusicAdd />} />
              <Route path="/musics/:id" element={<MusicEdit />} />
              <Route path="/comment/:id" element={<Comments />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/verify-payment" element={<PaymentVerify />} />
              <Route path="/login" element={<PageLogin />} />
              <Route path="/register" element={<PageRegister />} />
              <Route path="/genre" element={<GenrePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/artist" element={<ArtistPage />} />
              {/* <Route path="/music/:id/edit" element={< />} /> */}
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}

export default App;
