import React from "react";

import Container from "@mui/material/Container";
import {MultipleContainers} from "@/components/Kanban/MultipleContainers";

export default function Home() {

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 6 }}>
      <MultipleContainers  trashable/>
    </Container>
  );
}
Home.requireAuth = true;
