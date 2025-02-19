'use client'
import React from "react";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface MarkdownItem {
  name: string;
  content: string;
}

interface MarkdownListProps {
  markdowns: MarkdownItem[];
  // eslint-disable-next-line no-unused-vars
  handleSelectedMarkdown: (markdown: object) => void;
}

const MarkdownList: React.FC<MarkdownListProps> = ({
  markdowns,
  handleSelectedMarkdown,
}) => {
  return (
    <>
      {markdowns.map((md, idx) => (
        <ListItem key={idx} component="div" disablePadding>
          <ListItemButton onClick={() => handleSelectedMarkdown(md)}>
            <ListItemText primary={md.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default MarkdownList;
