"use client";
import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid2";
import GlobalLoader from "@/components/GlobalLoader";
import { useRouter } from "next/router";

import MarkdownViewer from "@/components/MarkdownViewer";
import {
  Box,
  Container,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import AceCodeEditor from "@/components/AceEditor";
import { Code, Html } from "@mui/icons-material";

export default function ModelDetail() {
  const router = useRouter();
  const { model, id } = router.query; // Get id from the URL parameter
  const [hasModel, setHasModel] = useState<any>(null);
  const [code, setCode] = useState<string>();
  const [show, setShow] = useState(false);
  const [alignment, setAlignment] = React.useState('preview');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };
  useEffect(() => {
    if (!id) return; // Do nothing if id is not available

    const fetchModeldetails = async () => {
      const response = await fetch(`/api/${model}/${id}`);
      const data = await response.json();
      console.log(data, "data");
      setHasModel(data); // Set the fetched model data
    };

    fetchModeldetails();
  }, [id]); // Fetch data when id changes

  if (!hasModel) return <GlobalLoader />;
 const handleClick = ()=>{
    console.log('Click')
 }
  return (
    <Container className="max-w-lg ">
      <Grid
        container
        direction={"row"}
        spacing={2}
        alignContent={"space-between"}
        alignItems={"center"}
      >
        <Grid size={10}>
          <Typography variant="h4">{hasModel?.name}</Typography>
        </Grid>
        <Grid size={2} textAlign={"right"}>
          <ToggleButtonGroup
            color="info"
            value={alignment || "preview"}
            exclusive
            size="small"
            onChange={() => handleChange}
            aria-label="Platform"
            sx={{mb:1}}
          >
            <ToggleButton size="small" value="code" onClick={()=>setAlignment("code")}><Code /></ToggleButton>
            <ToggleButton size="small" value="preview" onClick={()=>setAlignment("preview")}><Html /></ToggleButton>
          </ToggleButtonGroup>

        </Grid>
      </Grid>
      <Paper component={"div"} className={alignment==="code"?"p-3":"hidden"}>
        <AceCodeEditor
          initialCode={hasModel?.content}
          handleChange={() => handleChange}
          
        />
      </Paper>
      <Box className={alignment==="preview"?"":"hidden"}>
        <MarkdownViewer content={hasModel.content} />
      </Box>
    </Container>
  );
}
ModelDetail.requireAuth = true;
