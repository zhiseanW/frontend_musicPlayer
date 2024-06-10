import React from "react";
import { useCookies } from "react-cookie";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Container } from "@mui/material";
import Header from "../../components/Header";
import Details from "./details";
import Comments from "../../components/Comments";

export default function MusicDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  //   const { data: musics = [] } = useQuery({
  //     queryKey: ["music"],
  //     queryFn: () => getMusic(),
  //   });

  return (
    <Container>
      <Header />
      {/* <Details musics={musics} />
      <Comments musics={musics} /> */}
    </Container>
  );
}
