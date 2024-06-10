import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { getUser, updateUser } from "../../utils/api_users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import Header from "../../components/Header";
import {
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  Grid,
  CardContent,
} from "@mui/material";
import { uploadImage } from "../../utils/api_images";

export default function ProfilePage() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUser] = useState("");
  const [bio, setBio] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editUserId, setEditUserId] = useState("");

  // load the user
  const { data: user = [] } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      enqueueSnackbar("Updated User.", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      setOpenEditModal(false);
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
            My Profile
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">UserName : Rick</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Email : Rick@gmail.cpm</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">{user.bio}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5"></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5"></Typography>
            </Grid>
          </Grid>
          <Button
            onClick={() => {
              setEditUserName(user.name);
              setBio(user.bio);
            }}
          >
            Edit
          </Button>
        </CardContent>
      </Card>

      {/*      */}

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ width: "100%", marginTop: "15px" }}
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              updateUserMutation.mutate({
                _id: editUserId,
                name: editUserName,
                bio: editBio,
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
