import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CardActions,
  Chip,
  Avatar,
} from "@mui/material";

import { addToCart } from "../../utils/api_cart";
import { useCookies } from "react-cookie";
import { getComments } from "../../utils/api_comments";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";
import { deleteMusic } from "../../utils/api_music";
import { Inventory2 } from "@mui/icons-material";

export default function MusicCard(props) {
  const { music } = props;
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  console.log(music);

  // const { data: comments = [] } = useQuery({
  //   queryKey: ["comments"],
  //   queryFn: () => getComments(),
  // });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      enqueueSnackbar("Song has been added to cart", {
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

  const deleteMusicMutation = useMutation({
    mutationFn: deleteMusic,
    onSuccess: () => {
      enqueueSnackbar("Song has been removed", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["musics"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const handleMusicDelete = (event) => {
    event.preventDefault();
    const confirm = window.confirm("Confirm Deletion?");
    if (confirm) {
      deleteMusicMutation.mutate({
        _id: music._id,
        token: token,
      });
    }
  };

  return (
    <Card sx={{ borderRadius: "16px" }}>
      <CardContent>
        {/* <AudioPlayer src={"http://localhost:5000/" + musics} /> */}
        <Box>
          <ReactPlayer url={music.music_url} style={{ width: "100%" }} />
        </Box>

        <Typography fontWeight={"bold"}>{music.musicName}</Typography>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <Chip
            avatar={<Avatar>$</Avatar>}
            label={music.price}
            color="success"
          />
          <Chip
            icon={<Inventory2 />}
            label={music.genre && music.genre.name ? music.genre.name : ""}
            color="warning"
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            if (currentUser && currentUser.email) {
              addToCartMutation.mutate(music);
            } else {
              enqueueSnackbar("Please login first");
            }
          }}
        >
          Add To Cart
        </Button>
        {role && role === "admin" ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px 0",
            }}
          >
            <Button
              variant="contained"
              style={{ borderRadius: "17px" }}
              color="primary"
              onClick={() => {
                navigate("/musics/" + music._id);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              style={{ borderRadius: "17px" }}
              color="error"
              onClick={handleMusicDelete}
            >
              Delete
            </Button>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
