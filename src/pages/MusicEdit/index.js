import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { uploadImage } from "../../utils/api_images";
import { getMusic, updateMusic } from "../../utils/api_music";
import { getGenres } from "../../utils/api_genres";
import { getArtists } from "../../utils/api_artists";
import { useCookies } from "react-cookie";

export default function MusicEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;
  const [music_url, setMusic] = useState("");
  const [musicName, setMusicName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");

  const {
    data: music,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["musics", id],
    queryFn: () => getMusic(id),
  });

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  const { data: artists = [] } = useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(),
  });

  useEffect(() => {
    if (music) {
      setMusicName(music.musicName);
      setMusic(music.music_url);
      setDescription(music.description);
      setPrice(music.price);
      setGenre(music.genre);
      setArtist(music.artist);
    }
  }, [music]);

  const updateMusicMutation = useMutation({
    mutationFn: updateMusic,
    onSuccess: () => {
      enqueueSnackbar("Updated Music", { variant: "success" });
      navigate("/");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  //upload image mutation
  // const uploadImageMutation = useMutation({
  //   mutationFn: uploadImage,
  //   onSuccess: (data) => {
  //     setImage(data.image_url);
  //   },
  //   onError: (error) => {
  //     enqueueSnackbar(error.response.data.message, { variant: "error" });
  //   },
  // });

  // const handleImageUpload = (event) => {
  //   // console.log(event.target.files[0]);
  //   uploadImageMutation.mutate(event.target.files[1]);
  // };
  // const uploadMusicMutation = useMutation({
  //   mutationFn: uploadMusic,
  //   onSuccess: (data) => {
  //     setMusic(data.music_url);
  //   },
  //   onError: (error) => {
  //     enqueueSnackbar(error.response.data.message, { variant: "error" });
  //   },
  // });

  // const handleMusicUpload = (event) => {
  //   // console.log(event.target.files[0]);
  //   uploadMusicMutation.mutate(event.target.files[0]);
  // };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    updateMusicMutation.mutate({
      id: id,
      musicName: musicName,
      music_url: music_url,
      description: description,
      price: price,
      genre: genre,
      artist: artist,
      token: token,
    });
  };

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>{error.response.data.message}</Container>;
  }

  return (
    <Container>
      <Header />
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              margin: "20px 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Edit Product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Music Name"
                variant="outlined"
                fullWidth
                value={musicName}
                onChange={(e) => setMusicName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Music Url"
                variant="outlined"
                fullWidth
                value={music_url}
                onChange={(e) => setMusic(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ marginTop: "10px", width: "200px", marginLeft: "10px" }}
              >
                <InputLabel id="product-select-label">Genre</InputLabel>
                <Select
                  labelId="product-select-label"
                  id="product-select"
                  label="Genre"
                  value={genre}
                  onChange={(event) => {
                    setGenre(event.target.value);
                  }}
                >
                  {genres.map((genre) => {
                    return (
                      <MenuItem key={genre._id} value={genre._id}>
                        {genre.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ marginTop: "10px", width: "200px", marginLeft: "10px" }}
              >
                <InputLabel id="product-select-label">Artist</InputLabel>
                <Select
                  labelId="product-select-label"
                  id="product-select"
                  label="Artist"
                  value={artist}
                  onChange={(event) => {
                    setArtist(event.target.value);
                  }}
                >
                  {artists.map((artist) => {
                    return (
                      <MenuItem key={artist._id} value={artist._id}>
                        {artist.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              {image !== "" ? (
                <>
                  <div>
                    <img
                      src={"http://localhost:5000/" + image}
                      width="300px"
                      height="300px"
                      alt="item"
                    />
                  </div>

                  <Button onClick={() => setImage("")}>Remove Image</Button>
                </>
              ) : (
                <input
                  type="file"
                  multiple={false}
                  onChange={handleImageUpload}
                />
              )}
            </Grid> */}

            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleFormSubmit}>
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
