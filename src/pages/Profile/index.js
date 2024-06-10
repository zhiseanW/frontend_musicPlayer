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
  Paper,
  CardContent,
  Box,
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

      <Grid container spacing={2}>
        <Grid item xs={12} container spacing={2}>
          <Grid item sm={6} md={4} align="right">
            <Paper
              style={{ border: "2px solid", height: "200px", width: "200px" }}
            >
              Profile Picture
            </Paper>
          </Grid>
          <Grid item sm={6} md={8} alignt="left" container>
            <Grid item xs={12} container alignItems="flex-end">
              <Typography variant="h4">{}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">{}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
