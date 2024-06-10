import { useState } from "react";

import Header from "../../components/Header";
import { Typography, Button, TextField, Box, Container } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

import {
  getGenres,
  addNewGenre,
  updateGenre,
  deleteGenre,
} from "../../utils/api_genres";

export default function GenrePage() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [genre, setGenre] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editGenreName, setEditGenreName] = useState("");
  const [editGenreID, setEditGenreID] = useState("");

  // load the categories
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  const addNewGenreMutation = useMutation({
    mutationFn: addNewGenre,
    onSuccess: () => {
      enqueueSnackbar("Added Genre", {
        variant: "success",
      });
      // reset the categories data
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });
      // reset the category name field
      setGenre("");
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const updateGenreMutation = useMutation({
    mutationFn: updateGenre,
    onSuccess: () => {
      enqueueSnackbar("Genre Update", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });

      setOpenEditModal(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const deleteGenreMutation = useMutation({
    mutationFn: deleteGenre,
    onSuccess: () => {
      // display success message
      enqueueSnackbar("Genre Deleted", {
        variant: "success",
      });
      // reset the categories data
      queryClient.invalidateQueries({
        queryKey: ["genres"],
      });
    },
    onError: (error) => {
      // display error message
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
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
          Genres
        </Typography>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        <TextField
          label="Genre Name"
          variant="outlined"
          sx={{ width: "100%" }}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            addNewGenreMutation.mutate({
              name: genre,
              token: token,
            });
          }}
        >
          Add
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={"70%"}>Name</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {genres.length > 0 ? (
            genres.map((item) => {
              return (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setOpenEditModal(true);

                          setEditGenreName(item.name);

                          setEditGenreID(item._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          deleteGenreMutation.mutate({
                            _id: item._id,
                            token: token,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No Genres Added.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Genre</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ width: "100%", marginTop: "15px" }}
            value={editGenreName}
            onChange={(e) => setEditGenreName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              updateGenreMutation.mutate({
                _id: editGenreID,
                name: editGenreName,
                token: token,
              });
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
