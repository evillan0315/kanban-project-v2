/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import classNames from "classnames";
import Box from "@mui/material/Box";


import { StyledContainer, Header } from "./Container.module";
import { Add, Delete, DragHandle } from "@mui/icons-material";

import { Button, CardActions, IconButton } from "@mui/material";
import { useTaskData } from "@/hooks/useTaskData";


export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: Props,
    ref
  ) => {
    const {findStatusById} = useTaskData()
    const handleCreateItem = () => {
      console.log("handle create item")
    }

    
    
    return (
      <Box
        {...props}
        component={onClick ? "button" : "div"}
        ref={ref}
        sx={{

          gridAutoRows: "max-content",

          boxSizing: "border-box",
          appearance: "none",
          outline: "none",
          minWidth: 350,
          marginX: "10px",
          borderRadius: "5px",
          minHeight: 350,
          transition: "background-color 350ms ease",
          backgroundColor: "plain.main",
          border: `1px solid #333`,
          fontSize: ".9rem",
        }}
        style={
          {
            ...style,
            "--columns": columns,
          } as React.CSSProperties
        }
        className={classNames(
          StyledContainer,
          unstyled && StyledContainer,
          horizontal && StyledContainer,
          hover && StyledContainer.__emotion_styles,
          placeholder && StyledContainer.__emotion_styles,
          scrollable && StyledContainer.__emotion_styles,
          shadow && StyledContainer
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <Header>
            {findStatusById(label)?.name}
            <CardActions>
              <IconButton size={"small"} color="error" onClick={onRemove}>
                <Delete />
              </IconButton>

              <Box {...handleProps}>
                {" "}
                <IconButton size={"small"}>
                  <DragHandle />
                </IconButton>
              </Box>
            </CardActions>
          </Header>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
        <Button startIcon={<Add />} onClick={handleCreateItem}>Create Item</Button>
      </Box>
    );
  }
);
Container.displayName = "Container";
