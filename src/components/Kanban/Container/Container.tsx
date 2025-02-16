/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import classNames from "classnames";
import Box from "@mui/material/Box";

import { Header, StyledContainer } from "./Container.module";
import { Add, Delete, DragHandle } from "@mui/icons-material";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
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
    const { findStatusById } = useTaskData();
    const handleCreateItem = () => {
      console.log("handle create item");
    };

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
          minHeight: 450,
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
        <Card variant="outlined" sx={{
                      margin:1,
          height: "100%",
          "& .MuiPaper-root": {
            display: "flex",
            flexDirection: "column",

            height: "90vh",
          },
        }}>
          {label ? (
            <>
              <Header>
                <Typography variant="h6" color="primary">
                  {findStatusById(label)?.name || "Header"}
                </Typography>
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
            </>
          ) : null}

          <CardContent sx={{p:1, flex: 1, height: "50vh", maxHeight: 440, overflow:"auto"}}>
            {placeholder ? children : <ul>{children}</ul>}
          </CardContent>
          <CardActions sx={{ p: 1 }}>
          <Button fullWidth startIcon={<Add />} onClick={handleCreateItem}>
            Create Item
          </Button>
          </CardActions>
        </Card>
      </Box>
    );
  }
);
Container.displayName = "Container";
