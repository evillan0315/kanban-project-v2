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
import prisma from "@/lib/prisma";
//import DynamicBreadcrumbs from "@/components/Page/DynamicBreadcrumbs";
import { Add, Delete } from "@mui/icons-material";
import CodeDisplay from "@/components/CodeDisplay";
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
interface Component {
  name: string;
  description: string;
  props: any;
};
interface ComponentPageProps {
    type?: 'component',
    componentsData: Component[]
}

const ComponentPage: React.FC<ComponentPageProps> = ({ type, componentsData }) => {
  //const [formData, setFormData] = useState<ProjectFormData>(generateMockData(1)[0]);
    const [components, setComponents] = useState<Component[]>(componentsData)
    console.log(components, 'components');
  const [open, setOpen] = useState(false);
  // Access URL param
  const { loading, setLoading } = useLoading();
  //const [isSubmitted, setIsSubmitted] = useState(false);
//   const [hasModel, setHasModel] = useState<
//     { id: string; [key: string]: any }[]
//   >([]);
  //const [columns, setColumns] = useState<GridColDef[]>([]);
  //const [selectedRows, setSelectedRows] = useState<string[]>([]);
  //const {fetchTasks,items, setItems} =useTaskStore()
  //const router = useRouter(); 
  // Fetch data
  useEffect(() => {
    /* const fetchModel = async () => {
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
    }; */

    //fetchModel();
  }, []);
  

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
            {components && (
              <IconButton
       
                color="primary"
                onClick={() => setOpen(true)}
                sx={{}}
              >
                <Add />
              </IconButton>
            )}
           
           
         
          </Stack>
        </Box>

        <Paper style={{ height: 400, width: "100%" }}>
        <CodeDisplay code={`${components[0].props}`} />
          {/* <DataGrid
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
          /> */}
        </Paper>
      </Box>
      {/* <DialogDynamicForm
        model={model}
        open={open}
        onClose={() => setOpen(false)}
        handleOnSubmit={handleOnSubmit}
      /> */}
    </>
  );
};

export default ComponentPage;
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
    const model = 'component';
  try {
    const components = await prisma.component.findMany();
    console.log(components, 'components');

    if (!components) {
      throw new Error(`Failed to fetch: ${components}`);
    }

    return {
      props: {
        type: model,
        componentsData: components, // ✅ Use a different key instead of `children`
      },
    };
  } catch (error) {
    console.error("Error fetching fields:", error);

    return {
      props: {
        type: model,
        componentsData: [], // ✅ Return an empty array on error
      },
    };
  }
};
// React Component with a Button to Fetch Data
