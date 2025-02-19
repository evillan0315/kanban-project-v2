"use client";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import StarIcon from "@mui/icons-material/Star";

import MarkdownList from "@/components/MarkdownList";
import MarkdownViewer from "@/components/MarkdownViewer";
import AceCodeEditor from "@/components/AceEditor";
import { useSession } from "next-auth/react";

interface MarkdownType {
  id: string;
  createdByUserId: string;
  name: string;
  content: string;
  props: object;
}

const AceEditor = () => {
  const { data: session } = useSession();
  const [markdowns, setMarkdowns] = useState<MarkdownType[]>([]);
  const [selectedMarkdown, setSelectedMarkdown] = useState<MarkdownType>({
    id: "",
    createdByUserId: "",
    name: "",
    content: "// Enter code here",
    typeId: "",
    default: false,
  });

  const [openDrawer, setOpenDrawer] = useState(false); // State for Drawer

  useEffect(() => {
    if (session && session.user.id) {
      setSelectedMarkdown((prev) => ({ ...prev, createdByUserId: session.user.id }));
    }

    const fetchMarkdowns = async () => {
      const response = await axios.get("/api/page");
      setMarkdowns(response.data);
    };

    fetchMarkdowns();
  }, [session]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        	name: selectedMarkdown.name,
        	content: selectedMarkdown.content,
        	default: false,
        	createdByUserId: session?.user?.id,
        	props: {}
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Failed to save markdown.");
      }
      alert("Saved markdown.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/page?id=${selectedMarkdown?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMarkdown),
      });

      const result = await response.json();
      
      if (!response.ok) {
        alert(result.error || "Failed to update markdown.");
      }
      alert("Updated markdown.");
    } catch (error) {
      console.error("Error updating markdown:", error);
    }
  };

  const handleCodeChange = (code: string) => {
    setSelectedMarkdown((prev) => ({ ...prev, content: code }));
  };

  const handleSelectedMarkdown = (markdown: MarkdownType) => {
    setSelectedMarkdown(markdown);
  };
const handleAddContent = () => {
    setSelectedMarkdown({
    createdByUserId: session?.user?.id,
    name: "",
    content: "// Enter code here",
    typeId: "",
    default: false,
  });
  setOpenDrawer(true)
  };
  return (
    <Box className="relative my-0 bg-zinc-950">
      <Grid container direction="row" spacing={0} justifyContent="space-between">
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => handleAddContent()}>
            Add
          </Button>
        </Grid>
        
        <Grid item xs={3}>
          
          <MarkdownList markdowns={markdowns} handleSelectedMarkdown={handleSelectedMarkdown} />
        </Grid>

        <Grid item xs={9} sx={{ }} className="px-2">
       	<Box>
       	{selectedMarkdown?.id ? (
       	<Button variant="contained" onClick={() => setOpenDrawer(true)}>
            Edit
          </Button>
       	) : `Preview`}
       	
       	<Typography variant="h3">{selectedMarkdown.name}</Typography>
           <MarkdownViewer content={selectedMarkdown?.content} />
           </Box>
        </Grid>
      </Grid>

      {/* 🔹 MUI Drawer for Markdown Preview */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: "50vw", backgroundColor: "#121212", padding: 2 } }} // Dark background
      >
        <Box spacing={4}>
        <input
            type="text"
            placeholder="Title"
            value={selectedMarkdown?.name}
            onChange={(e) =>
              setSelectedMarkdown((prev) => ({ ...prev, name: e.target.value }))
            }
            className="text-sm py-4 my-0 mx-0 px-6 border-0 border w-full"
          />
          <Box sx={{maxHeight: "500px", overflow: "hidden", margin: "1rem 0"}}>
        <AceCodeEditor
            initialCode={selectedMarkdown.content}
            mode="markdown"
            onSave={handleSave}
            handleChange={handleCodeChange}
          />
          </Box>
          <Stack direction="row" spacing={2}>
          <Button onClick={() => setOpenDrawer(false)} variant="outlined">
          Cancel
        </Button>
          <Button
          variant="contained"
            startIcon={<StarIcon />}
            onClick={selectedMarkdown?.id ? handleUpdate : handleSave}
          >
            {selectedMarkdown?.id ? `Update` : `Save`}
          </Button>
          </Stack>
          </Box>
      </Drawer>
    </Box>
  );
};

AceEditor.requireAuth = false;
export default AceEditor;

