import React, { useEffect, useState } from "react";
import classNames from "classnames";
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

import { Remove } from "./components";

//import styles from "./Item.module.scss";
import  useTaskData  from "@/hooks/useTaskData";
import {
  Avatar,
  Box,
  Button,
  Card,

  CardContent,
  Chip,

  Stack,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";
import "dayjs/locale/en"; // Import the locale (e.g., English)
import relativeTime from "dayjs/plugin/relativeTime"; // Example plugin
import updateLocale from "dayjs/plugin/updateLocale"; // For custom locale updates
import { Task } from "@prisma/client";
import DialogDynamicForm from "@/components/Form/DialogDynamicForm";

// Optional: Configure locale globally (do this once, maybe in _app.tsx)
dayjs.locale("en"); // Set default locale.  Good for consistency.

// Optional: Extend Day.js with plugins (do this once, maybe in _app.tsx)
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?: ()=>void;
 
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props["transform"];
    transition: Props["transition"];
    value: Props["value"];
  }): React.ReactElement;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,

        //height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref
    ) => {
      const { findPriorityById, findTaskById, getColor } = useTaskData();
      handle= true;
      const [open, setOpen] = useState(false);
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }
        
        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay, value, findTaskById]);
      const task = findTaskById(value as string);
      const openDynamicForm = (task: Task) => {
        console.log(task, 'tsk openDynamicForm')

        setOpen(true)
      }
      const handleOnSubmit = (task: Task) => {
        
        console.log(task, 'tsk handleonsubmit')
      }
      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <Box
          gap={2}
          sx={{
            overflow: "hidden",
          }}
          className={classNames(fadeIn, sorting, dragOverlay)}
          style={
            {
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(", "),
              "--translate-x": transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              "--translate-y": transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              "--scale-x": transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              "--scale-y": transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              "--index": index,
              "--color": color,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <Card
            variant="elevation"
            sx={{
              padding: 0,
              maxHeight: 90,
              marginBottom: 1,
              position: "relative",
            }}
            className={classNames(
              `shadow-lg border border-neutral-800`,
              dragging,
              handle,
              dragOverlay,
              disabled
            )}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            <CardContent
              sx={{
                paddingX: 1,
                paddingY: 3,
                flex: 1,
                borderLeft: 3,
                borderColor: getColor(task?.id as UniqueIdentifier),
              }}
            >
              <Stack
                width="100%"
                direction="row"
                spacing={1}
               
               
                alignContent={"space-between"}
                alignItems={"center"}
              >
                
                <Box sx={{ position: "absolute", right: 1, marginTop: 6, width:50, height:50 }}>
                  
                </Box>
                <Box sx={{ position: "absolute", top: 1, width: "100%" }}>
                  <Typography
                    variant="caption"
                    className="text-right"
                    fontSize={10}
                  >
                    started {dayjs(task?.startDate).fromNow()}
                  </Typography>
                </Box>
                <Box sx={{ position: "absolute", right: 1, top: 0 }}>
                  <Remove className={""} onClick={onRemove} />
                </Box>
                <Avatar sx={{ width: 20, height: 20 }}  onClick={()=>openDynamicForm(task as Task)}></Avatar> 
                <Typography component={"button"} variant="caption" className="mt-2"> 
                <Button variant="text" onClick={()=>openDynamicForm(task as Task)}>{task?.name} </Button>
                </Typography>
                
              </Stack>
              <Chip
                size={"small"}
                variant="outlined"
                label={
                  findPriorityById(task?.priorityId as string)?.name || "draft"
                }
              />
            </CardContent>
            <Box sx={{ position: "absolute", bottom: 1, right: 1 }}>
              <Typography color={"error"} variant="caption" fontSize={10}>
                due {dayjs(task?.dueDate).fromNow()}
              </Typography>
            </Box>
          </Card>


           <DialogDynamicForm  data={task} model={'task'} selectedStatus={undefined} open={open} onClose={()=>setOpen(false)} handleOnSubmit={handleOnSubmit} />
        </Box>
      );
    }
  )
);
