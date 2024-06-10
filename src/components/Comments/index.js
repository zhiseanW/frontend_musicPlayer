import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  getComments,
  addNewComment,
  updateComment,
  deleteComment,
} from "../../utils/api_comments";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  FormControl,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Header from "../Header";

export default function Comments(props) {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [editCommentID, setEditCommentID] = useState("");

  // load the comments
  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(),
  });

  const addNewCommentMutation = useMutation({
    mutationFn: addNewComment,
    onSuccess: () => {
      enqueueSnackbar("Comment has been added successfully.", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });

      setComment("");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      enqueueSnackbar("Comment has been updated successfully.", {
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      enqueueSnackbar("Comment has been deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["comments"],
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
    <>
      <Container>
        <Header />
        <Box display="flex" gap={"5px"} sx={{ paddingTop: "20px" }}>
          <TextField
            label="Add new Item"
            fullWidth
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
          <Button
            variant="contained"
            sx={{
              paddingLeft: "45px",
              paddingRight: "45px",
            }}
            onClick={() => {
              if (currentUser && currentUser.email) {
                addNewCommentMutation.mutate({
                  comment: comment,
                  token: token,
                });
              } else {
                enqueueSnackbar("Please login to add a comment");
              }
            }}
          >
            Add
          </Button>
        </Box>

        {comments.length > 0 ? (
          <List>
            {comments.map((item) => {
              return (
                <Paper
                  style={{ padding: "40px 20px", marginTop: 10 }}
                  sx={{ marginTop: "10" }}
                >
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                      <Avatar alt="someone" />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                      <h4 style={{ margin: 0, textAlign: "left" }}>
                        {item.username}
                      </h4>
                      <p style={{ textAlign: "left" }}>{item.comment}</p>
                      <p style={{ textAlign: "left", color: "gray" }}></p>
                    </Grid>
                    <Box style={{ display: "flex" }} gap={5}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpenEditModal(true);
                          setEditComment(item.comment);
                          setEditCommentID(item._id);
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          deleteCommentMutation.mutate({
                            _id: item._id,
                            token: token,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Grid>
                </Paper>
              );
            })}
          </List>
        ) : (
          <Typography variant="h6">No Comments.</Typography>
        )}

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Edit Genre</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              sx={{ width: "100%", marginTop: "15px" }}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                updateCommentMutation.mutate({
                  _id: editCommentID,
                  comment: editComment,
                  token: token,
                });
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
