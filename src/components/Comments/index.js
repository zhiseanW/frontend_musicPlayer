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
} from "@mui/material";
import Header from "../Header";

export default function Comments() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState("");

  // load the comments
  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(),
  });

  const addNewCommentMutation = useMutation({
    mutationFn: addNewComment,
    onSuccess: () => {
      // display success message
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
      // display success message
      enqueueSnackbar("Comment has been updated successfully.", {
        variant: "success",
      });
      // reset the comments data
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

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      // display success message
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

  const handleCommentDelete = (event) => {
    event.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirm) {
      deleteCommentMutation.mutate({
        _id: comment._id,
        token: token,
      });
    }
  };

  const handleCommentEdit = (event) => {
    event.preventDefault();
  };

  const handleCommentUpdate = (event) => {
    event.preventDefault();
    updateCommentMutation.mutate({});
  };

  return (
    <>
      <Container>
        <Header />
        <Box>
          <Typography variant="h6">Comments</Typography>
          <List>
            {comments.map((comment) => (
              <ListItem key={comment._id}>
                <Typography>{comment.name}</Typography>
                <Typography>{comment.comment}</Typography>
                <Box>
                  <TextField
                    type="text"
                    value={comment.comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button onClick={handleCommentUpdate}>Update</Button>
                </Box>
                <button onClick={handleCommentEdit}>Edit</button>
                <button onClick={handleCommentDelete}>Delete</button>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <FormControl>
            <TextField
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={() => {
                addNewCommentMutation.mutate({
                  comment: comment,
                  token: token,
                });
              }}
            >
              Add Comment
            </Button>
          </FormControl>
        </Box>
      </Container>
    </>
  );
}
