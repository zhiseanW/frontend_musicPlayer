import { useState } from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import Header from "../../components/Header";
import { addNewMusic } from "../../utils/api_music";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getGenres } from "../../utils/api_genres";
import { getArtists } from "../../utils/api_artists";

export default function MusicAdd() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [musicName, setMusicName] = useState("");
  const [music_url, setMusic] = useState("");
  const [artist, setArtist] = useState("");

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  const { data: artists = [] } = useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(),
  });

  const addMusicMutation = useMutation({
    mutationFn: addNewMusic,
    onSuccess: () => {
      navigate("/");
    },
    onError: (e) => {
      alert(e.response.data.message);
    },
  });

  const handleMusicForm = (e) => {
    e.preventDefault();
    addMusicMutation.mutate({
      musicName: musicName,
      music_url: music_url,
      description: description,
      genre: genre,
      artist: artist,
      price: price,
      token: token,
    });
  };

  return (
    <Container>
      <Header />
      <Card sx={{ marginTop: "100px" }}>
        <CardContent>
          <Typography
            variant="h3"
            sx={{
              margin: "20px 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Add Song
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
              <Button variant="contained" fullWidth onClick={handleMusicForm}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
