/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import useTaskStore, {
  Items,
  PLACEHOLDER_ID,
  TRASH_ID,
} from "@/hooks/useTaskData"; // Adjust the path accordingly
import { arrayMove } from "@dnd-kit/sortable";
import { unstable_batchedUpdates } from "react-dom";
import { UniqueIdentifier } from "@dnd-kit/core";

const useDragEndHandler = () => {
  const {
    items,
    containers,
    setItems,
    setContainers,
    findContainer,
    setActiveId,
    getNextContainerId,
  } = useTaskStore();

  // Memoize the onDragEnd handler to prevent unnecessary re-renders
  const onDragEnd = useCallback(
    ({
      active,
      over,
    }: {
      active: { id: UniqueIdentifier };
      over: { id: UniqueIdentifier | null };
    }) => {
      // Ensure active and over IDs exist before proceeding
      if (active.id in items && over?.id) {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);

        // Perform the array move directly
        const updatedContainers = arrayMove(containers, activeIndex, overIndex);

        // Now update the containers state
        setContainers(updatedContainers);
      }

      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setActiveId(null);
        return;
      }

      const overId = over?.id;

      if (overId == null) {
        setActiveId(null);
        return;
      }

      // const activeContainer: UniqueIdentifier; // Assuming this is correctly defined elsewhere

      if (overId === TRASH_ID) {
        setItems((items: Items) => {
          // Ensure that activeContainer is defined and items[activeContainer] is accessible
          const updatedItems: Items = {
            ...items,
            [activeContainer]: items[activeContainer].filter(
              (id: UniqueIdentifier) => id !== active.id // Assuming `id` is of type UniqueIdentifier
            ),
          };

          // Return the updated items which are of type Items
          return updatedItems;
        });

        setActiveId(null);
        return;
      }

      // If the item is dropped into a new placeholder
      if (overId === PLACEHOLDER_ID) {
        const newContainerId = getNextContainerId();

        unstable_batchedUpdates(() => {
          // Correctly type the containers state
          setContainers([...containers, newContainerId]);

          // Correctly type the items state, and ensure the proper update to items and containers
          setItems({
            ...items,
            [activeContainer]: items[activeContainer].filter(
              (id) => id !== active.id
            ),
            [newContainerId]: [active.id],
          });

          // Reset active ID to null
          setActiveId(null);
        });
        return;
      }

      // Handle if the item is dropped within the same container or moved between containers
      const overContainer = findContainer(overId);

      // If the over container exists, move the item within that container
      if (overContainer) {
        const activeIndex = items[activeContainer].indexOf(active.id);
        const overIndex = items[overContainer].indexOf(overId);

        if (activeIndex !== overIndex) {
          setItems((items) => {
            // Ensure immutability by using arrayMove to reorder items in the overContainer
            const updatedItems = {
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex
              ),
            };

            // Return the updated items state
            return updatedItems;
          });
        }
      }

      setActiveId(null);
    },
    [
      items,
      containers,
      setItems,
      setContainers,
      findContainer,
      setActiveId,
      getNextContainerId,
    ]
  );

  return onDragEnd;
};

export default useDragEndHandler;
