"use client";
import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  TextField,
  Tooltip,
} from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import CloseIcon from "@mui/icons-material/Close";
import { useLoading } from "@/hooks/useLoading";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function TerminalDrawer({
  terminalOpen,
  onClose,
}: {
  terminalOpen: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(terminalOpen);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { addMessage, messages, clearMessages } = useLoading();
  const [input, setInput] = useState("");

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleClose = () => {
    onClose();
    setOpen(false);
  };
  // Handle command submission
  const handleCommandSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && input.trim() !== "") {
      const eventSource = new EventSource(`/api/runCommand?command=${input}`);
      addMessage(`$ ${input}⏳ Running command...`);
      setInput(""); // Clear input
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addMessage(data.message);
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        //addMessage("❌ Error receiving updates from server.");
        eventSource.close();
      };

      // Close connection when finished
      eventSource.addEventListener("end", () => {
        //addMessage(`✅ Model ${modelName} created successfully!`);
        eventSource.close();
      });
    }
  };
  // Clear terminal messages
  const handleClearMessages = () => {
    clearMessages();
    addMessage("🚀 Terminal cleared");
  };
  return (
    <>
      {/* Toggle Button */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#222",
          color: "#fff",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        <TerminalIcon />
      </IconButton>

      {/* Terminal Drawer */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            height: "60vh", // Adjust height as needed
            backgroundColor: "#000",
            color: "#0f0", // Green text like a real terminal
            fontFamily: "monospace",
            padding: "0px",
            borderTop: "2px solid #0f0",
          },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            sx={{ fontFamily: "monospace", marginLeft: 1 }}
          >
            ⌨️ Terminal
          </Typography>
          <Box>
            <Tooltip title="Clear Terminal" arrow>
              <IconButton onClick={handleClearMessages} sx={{ color: "#0f0" }}>
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>

            {/* Close Icon */}
            <Tooltip title="Close Terminal" arrow>
              <IconButton onClick={handleClose} sx={{ color: "#0f0" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Terminal Messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            padding: 1,
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          {messages.map((msg, index) => (
            <Typography
              key={index}
              sx={{ fontFamily: "monospace", mb: 0.2, fontSize: "0.8rem" }}
            >
              {msg}
            </Typography>
          ))}
          <div ref={messagesEndRef} /> {/* Auto-scroll target */}
        </Box>
        {/* Input Field */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a Bash command..."
          value={input}
          autoComplete="off"
          inputProps={{
            autoComplete: "off", // Prevents browser autofill
          }}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommandSubmit}
          sx={{
            backgroundColor: "#111",
            input: { color: "#0f0", fontFamily: "monospace" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#0f0" },
              "&:hover fieldset": { borderColor: "#0f0" },
              "&.Mui-focused fieldset": { borderColor: "#0f0" },
            },
          }}
        />
      </Drawer>
    </>
  );
}
