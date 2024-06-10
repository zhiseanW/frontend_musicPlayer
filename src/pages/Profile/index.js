import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUser, updateUser } from "../../utils/api_users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import Header from "../../components/Header";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Avatar,
  Container,
  Box,
} from "@mui/material";
import { uploadImage } from "../../utils/api_images";

export default function ProfilePage() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [image, setImage] = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Load the user
  const { data: user = {} } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(currentUser._id),
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio);
      setImage(user.profPic ? user.profPic : "");
    }
  }, [user]);

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

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImage(data.image_url); // Assuming the API response contains the image URL in 'image_url'
      enqueueSnackbar("Image uploaded successfully.", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleImageUpload = (event) => {
    setNewImage(event.target.files[0]);
  };

  const handleUpdateUser = () => {
    if (newImage) {
      uploadImageMutation.mutate(newImage, {
        onSuccess: (data) => {
          updateUserMutation.mutate({
            _id: editUserId,
            name: editUserName,
            profPic: data.image_url,
            bio: editBio,
          });
        },
      });
    } else {
      updateUserMutation.mutate({
        _id: editUserId,
        name: editUserName,
        profPic: image,
        bio: editBio,
      });
    }
  };

  return (
    <Container>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Card sx={{ width: "60%", padding: 4 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar
              alt={currentUser.name}
              src={
                "http://localhost:5000/" +
                (currentUser.profPic && currentUser.profPic !== ""
                  ? currentUser.profPic
                  : "placeholder/tempimg.png")
              }
              sx={{ width: 200, height: 200, margin: "0 auto" }}
            />
            <Typography fontWeight={"bold"} variant="h5" mt={2}>
              Username :{currentUser.name}
            </Typography>
            <Typography fontWeight={"bold"} variant="h5" mt={2}>
              Email :{currentUser.email}
            </Typography>
            <Typography variant="h5" mt={3}>
              Bio :{currentUser.bio}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenEditModal(true);
                setEditUserName(name);
                setEditBio(bio);
                setEditUserId(currentUser._id);
              }}
              sx={{ mt: 2, width: "150px", height: "50px" }}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Bio"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
          <Box mt={2}>
            <input type="file" multiple={false} onChange={handleImageUpload} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditModal(false)}
            color="primary"
            sx={{ width: "100px", height: "40px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            color="primary"
            sx={{ width: "100px", height: "40px" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
