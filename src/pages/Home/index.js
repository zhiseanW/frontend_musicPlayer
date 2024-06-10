import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Container,
} from "@mui/material";
import MusicCard from "../../components/MusicCard";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getMusics } from "../../utils/api_music";
import { getGenres } from "../../utils/api_genres";

export default function Home() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role } = currentUser;
  const navigate = useNavigate();

  const [genre, setGenre] = useState("all");
  const [artist, setArtist] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const { data: musics = [] } = useQuery({
    queryKey: ["musics", genre, artist, perPage, page],

    queryFn: () => getMusics(genre, artist, perPage, page),
  });
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  return (
    <Container>
      <Header />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            marginLeft: "10px",
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Songs
        </Typography>
        {role && role === "admin" ? (
          <Button
            variant="contained"
            sx={{
              marginLeft: "auto",
              marginRight: "10px",
              marginTop: "10px",
              backgroundColor: "#1BA930",
            }}
            onClick={() => {
              navigate("/add");
            }}
          >
            Add New
          </Button>
        ) : null}
      </div>
      <FormControl
        sx={{ marginTop: "10px", width: "200px", marginLeft: "10px" }}
      >
        <InputLabel id="product-select-label">Songs</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          label="Songs"
          value={genre}
          onChange={(event) => {
            setGenre(event.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {genres.map((genre) => {
            return (
              <MenuItem key={genre._id} value={genre._id}>
                {genre.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {musics
          ? musics.map((music) => (
              <Grid key={music._id} item xs={12} md={6} lg={4}>
                <MusicCard music={music} />
              </Grid>
            ))
          : null}
        {musics && musics.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" sx={{ padding: "10px 0" }}>
              No Songs Found.
            </Typography>
          </Grid>
        ) : null}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
          padding: "20px 0",
        }}
      >
        <Button
          disabled={page === 1 ? true : false}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>Page: {page}</span>
        <Button
          disabled={musics.length === 0 ? true : false}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}
