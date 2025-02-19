/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { Box,  IconButton, Paper, Stack } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useLoading } from "@/hooks/useLoading";
import DialogDynamicForm from "@/components/Form/DialogDynamicForm";
//import { FetchButton } from "@/components/FetchSwingers";
import { useRouter } from "next/router"; 
//import DynamicBreadcrumbs from "@/components/Page/DynamicBreadcrumbs";
import { Add, Delete } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
/* 
interface ProjectFormData {
  id: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  assignedTo: string[];
  budget: number;
  tags: string[];
  clientApproval: boolean;
  role: string;
} */
interface Field {
  name: string;
  type: string;
}
interface ModelPageProps {
  model: string;
  fields: Field[];
}

const ModelPage: React.FC<ModelPageProps> = ({ model, fields }) => {
  //const [formData, setFormData] = useState<ProjectFormData>(generateMockData(1)[0]);
  const [open, setOpen] = useState(false);
  // Access URL param
  const { loading, setLoading } = useLoading();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasModel, setHasModel] = useState<
    { id: string; [key: string]: any }[]
  >([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  //const {fetchTasks,items, setItems} =useTaskStore()
  const router = useRouter(); 
  // Fetch data
  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/${model}`);
        const data = await response.json();
        setLoading(false);
        setHasModel(data);
        const editableFields = ["name", "description"];
        //const hideFields = ["createdAt", "slug", "password"];
        // Dynamically generate columns from data keys
        if (data.length > 0) {
          const generatedColumns: GridColDef[] = Object.keys(data[0])
            //  .filter((key) => !hideFields.includes(key)) // ✅ Exclude hidden fields
            .map((key) => ({
              field: key,
              headerName: key.charAt(0).toUpperCase() + key.slice(1),
              flex: 1,
              editable: editableFields.includes(key),
            }));
          setColumns(generatedColumns);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchModel();
  }, [model, setLoading, isSubmitted]);
  const handleRowClick = (params: any) => {
    console.log(params, model);
    // You can use params.row to get the clicked row's data
    const id = params.row.id;

    router.push(`/${model}/${id}`); // Redirect to the task detail page using Next.js router
  };
  const handleRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ) => {
    try {
      const response = await fetch(`/api/${model}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) throw new Error("Failed to update");
      //router.push(router.asPath)
      return newRow; // ✅ MUI will update the UI with newRow
    } catch (error) {
      console.error("Update error:", error);
      return oldRow; // ❌ Revert to old row if API update fails
    }
  };

  const handleDelete = async (selectedIds: string[]) => {
    try {
      const response = await fetch(`/api/${model}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }), // Send array of IDs
      });

      if (!response.ok) enqueueSnackbar(`Failed to delete ${model} record`, {variant:'error'}); throw new Error("Failed to delete");

      // ✅ Explicitly type `prevRows` to avoid `never[]` issue
      setHasModel((prevRows: typeof hasModel) =>
        prevRows.filter((row) => !selectedIds.includes(row.id))
      );
      enqueueSnackbar(`Deleted ${model} record`, {variant:'success'})
      router.push(router.asPath)
    } catch (error) {
      enqueueSnackbar(`Error when deleting ${model}`, {variant:'error'});
      console.error("Delete error:", error);
    }
  };
  // const handleAddRow = async () => {
  //   const newRow = { name: "", description: "", id: Date.now().toString() }; // Example default values
  //   setHasModel((prevRows) => [...prevRows, newRow]);
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnSubmit = (data: any) => {
    console.log(data, "handleOnSubmit");
    router.push(router.asPath)
    setIsSubmitted(true);
  };
  const handleSelectionChange = (ids: GridRowSelectionModel) => {
    setSelectedRows(ids as string[]);
  };
  // const handleSave = async (row: any) => {
  //   try {
  //     const response = await fetch(`/api/${model}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(row), // Send new row data
  //     });

  //     const createdData = await response.json();
  //     if (!response.ok) throw new Error("Failed to create");

  //     // ✅ Replace temp row with real row from API (with real ID)
  //     setHasModel((prevRows) =>
  //       prevRows.map((r) => (r.id === row.id ? createdData : r))
  //     );
  //   } catch (error) {
  //     console.error("Create error:", error);
  //   }
  // };

  // function capitalizeFirstLetter(str: string): string {
  //   if (str.length === 0) {
  //     return str; // Handle empty string case
  //   }
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // }
  //const upperCaseString: string = capitalizeFirstLetter(model);

  return (
    <>

      <Box component="div">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction={"row"} spacing={2}></Stack>
          <Stack direction={"row"} spacing={2}>
            {fields && (
              <IconButton
       
                color="primary"
                onClick={() => setOpen(true)}
                sx={{}}
              >
                <Add />
              </IconButton>
            )}
           
            <IconButton
       
                color="error"
                disabled={selectedRows.length === 0}
                onClick={() => handleDelete(selectedRows)}
                sx={{}}
              >
                <Delete />
              </IconButton>
         
          </Stack>
        </Box>

        <Paper style={{ height: 400, width: "100%" }}>
          <DataGrid
            loading={loading}
            rows={hasModel}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowClick={handleRowClick} 
            onRowSelectionModelChange={handleSelectionChange}
            processRowUpdate={handleRowUpdate}
            // processRowUpdate={(updatedRow) => {
            //   handleSave(updatedRow); // Save updated row to API
            //   return updatedRow;
            // }}
            onProcessRowUpdateError={(error) => console.error(error)}
          />
        </Paper>
      </Box>
      <DialogDynamicForm
        model={model}
        open={open}
        onClose={() => setOpen(false)}
        handleOnSubmit={handleOnSubmit}
      />
    </>
  );
};

export default ModelPage;
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { model } = context.params as { model: string };

  // try {
  //   const response = await fetch(`/api/${model}?type=fields`);
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch: ${response.status}`);
  //   }

  //   const fields = await response.json();
  //   return {
  //     props: {
  //       model,
  //       fields,
  //     },
  //   };
  // } catch (error) {
  //   console.error("Error fetching fields:", error);

  //   return {
  //     props: {
  //       model,
  //       fields: [],
  //     },
  //   };
  // }
  return {
    props: {
      model,
      fields: [],
    },
  };
};
// React Component with a Button to Fetch Data
