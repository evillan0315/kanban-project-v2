/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

import Dialog from "@mui/material/Dialog";
import DynamicForm from "@/components/Form/DynamicForm";
import Close from "@mui/icons-material/Close";
//import { useLoading } from "@/hooks/useLoading";
import { motion } from "framer-motion";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";


interface DialogDynamicFormProps {
  model: string;
  open: boolean;
  onClose: () => void;
  handleOnSubmit: (data: any) => void;
  selectedStatus?: string;
}

export default function DialogDynamicForm({
  model,
  open,
  onClose,
  handleOnSubmit,
  selectedStatus
}: DialogDynamicFormProps) {
  // const { loading, setLoading } = useLoading();
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };
console.log(selectedStatus, 'selectedStatus');
  return (
    <motion.div
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      variants={dialogVariants}
    >
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        className=" shadow-lg shadow-slate-500 border-white border-sm "
        sx={{
          "& .MuiPaper-root": {
            display: "flex",
            flexDirection: "column",
            background: "#000009",
            height: "100vh",
          },
        }}
      >
        <DialogTitle>
          <Typography>Create {model}</Typography>

          <IconButton
            color="primary"
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DynamicForm
          model={model}
          handleOnSubmit={handleOnSubmit}
          open={open}
          onClose={onClose}
          selectedStatus={selectedStatus}
        />
      </Dialog>
    </motion.div>
  );
}
