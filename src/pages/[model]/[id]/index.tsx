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
import { AppRegistration, Code, Html, Preview } from "@mui/icons-material";
import CodeDisplay from "@/components/CodeDisplay";
import { BsMarkdown, BsMarkdownFill } from "react-icons/bs";
import { RenderComponent } from "@/components/Layout/RenderComponent";

export default function ModelDetail() {
  const router = useRouter();
  const { model, id } = router.query; // Get id from the URL parameter
  const [hasModel, setHasModel] = useState<any>(null);
  const [code, setCode] = useState<string>();
  const [show, setShow] = useState(false);
  const [alignment, setAlignment] = React.useState("preview");
  const [propsAlignment, setPropsAlignment] = React.useState("props");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
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
  const handleClick = () => {
    console.log("Click");
  };
  

  
  return (
    <Container className="">
      <Grid
        container
        direction={"row"}
        spacing={2}
        alignContent={"space-between"}
        alignItems={"center"}
      >
        <Grid size={10}>
          <Typography variant="h4">{hasModel?.name}</Typography>
          <Typography variant="subtitle1">{hasModel?.description}</Typography>
        </Grid>
        <Grid size={2} textAlign={"right"}>
          <ToggleButtonGroup
            color="info"
            value={alignment || "preview"}
            exclusive
            size="small"
            onChange={() => handleChange}
            aria-label="Platform"
            sx={{ mb: 1 }}
          >
            {hasModel?.code && (
              <ToggleButton
                size="small"
                value="code"
                onClick={() => setAlignment("code")}
              >
                <Code />
              </ToggleButton>
            )}
            {hasModel?.content && (
              <ToggleButton
                size="small"
                value="preview"
                onClick={() => setAlignment("preview")}
              >
                <BsMarkdownFill />
              </ToggleButton>
            )}
            {hasModel?.props && (
              <ToggleButton
                size="small"
                value="props"
                onClick={() => setAlignment("props")}
              >
                <AppRegistration />
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      {hasModel?.code && (
        <Paper
          component={"div"}
          className={alignment === "code" ? "p-3" : "hidden"}
        >
          code
          <AceCodeEditor
            initialCode={hasModel?.code}
            handleChange={() => handleChange}
          />
        </Paper>
      )}
      {hasModel?.props && (
        <Paper
          component={"div"}
          className={alignment === "props" ? "p-3" : "hidden"}
        >
          <ToggleButtonGroup
            color="info"
            value={propsAlignment || "preview"}
            exclusive
            size="small"
            onChange={() => handleChange}
            aria-label="Platform"
            sx={{ mb: 1 }}
          >
            <ToggleButton
              size="small"
              value="preview"
              onClick={() => setPropsAlignment("preview")}
            >
              <Preview /> Preview
            </ToggleButton>

            <ToggleButton
              size="small"
              value="code"
              onClick={() => setPropsAlignment("code")}
            >
              <AppRegistration /> JSON
            </ToggleButton>
          </ToggleButtonGroup>
          <Box maxHeight={400} overflow={"auto"}>
          {hasModel?.props && propsAlignment === "code" && (
            <CodeDisplay
              code={`${hasModel?.props}`}
              //handleChange={() => handleChange}
            />
          )}
          </Box>
          {hasModel?.props && propsAlignment === "preview" &&  (
            <Box sx={{p:1, my:2, background: "rgba(0,0,0,0.2)", borderRadius: 2, maxHeight: 400, overflow: "auto"}}>
              <RenderComponent component={JSON.parse(hasModel?.props)} />
            </Box>
          )}
        </Paper>
      )}
      {hasModel?.content && (
        <Paper
          className={
            alignment === "preview" || propsAlignment === "preview"
              ? ""
              : "hidden"
          }
        >
          <MarkdownViewer content={hasModel?.content} />
        </Paper>
      )}
    </Container>
  );
}
ModelDetail.requireAuth = true;
