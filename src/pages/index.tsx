import React from "react";

import Box from "@mui/material/Box";
import {MultipleContainers} from "@/components/Kanban/MultipleContainers";

export default function Home() {

  return (
    <Box sx={{ }}>
      <MultipleContainers  trashable/>
    </Box>
  );
}
Home.requireAuth = true;
