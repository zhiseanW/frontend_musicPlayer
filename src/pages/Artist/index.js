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
  getArtists,
  addNewArtist,
  updateArtist,
  deleteArtist,
} from "../../utils/api_artists";

export default function ArtistPage() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [artist, setArtist] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editArtistName, setEditArtistName] = useState("");
  const [editArtistID, setEditArtistID] = useState("");

  const { data: artists = [] } = useQuery({
    queryKey: ["artists"],
    queryFn: () => getArtists(),
  });

  const addNewArtistMutation = useMutation({
    mutationFn: addNewArtist,
    onSuccess: () => {
      enqueueSnackbar("Artist added", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });

      setArtist("");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const updateArtistMutation = useMutation({
    mutationFn: updateArtist,
    onSuccess: () => {
      enqueueSnackbar("Updated Artist.", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });

      setOpenEditModal(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const deleteArtistMutation = useMutation({
    mutationFn: deleteArtist,
    onSuccess: () => {
      enqueueSnackbar("Artist Removed", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });
    },
    onError: (error) => {
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
          Artists
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
          label="Artist Name"
          variant="outlined"
          sx={{ width: "100%" }}
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            addNewArtistMutation.mutate({
              name: artist,
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
          {artists.length > 0 ? (
            artists.map((item) => {
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

                          setEditArtistName(item.name);

                          setEditArtistID(item._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          deleteArtistMutation.mutate({
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
                No Artists found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Artist</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ width: "100%", marginTop: "15px" }}
            value={editArtistName}
            onChange={(e) => setEditArtistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              updateArtistMutation.mutate({
                _id: editArtistID,
                name: editArtistName,
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
