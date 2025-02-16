'use client'
import React  from "react";
import Kanban from "@/components/Kanban";
import Container from "@mui/material/Container";


export default function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 6 }}>
      
        <Kanban />
     
    </Container>
  );
}
