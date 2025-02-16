/* eslint-disable @typescript-eslint/no-explicit-any */

"client";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  DialogContent,
  DialogActions,
  Button,

  //OutlinedInput,
  //Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { DatePicker } from "@mui/x-date-pickers";
import {} from "@mui/x-date-pickers";
import GlobalLoader from "../GlobalLoader";
import { useLoading } from "@/hooks/useLoading";
import { AddCircleOutlineRounded } from "@mui/icons-material";

interface Field {
  name: string;
  type: string;
}

interface Attribute {
  name: string;
  args: any[];
}

interface Field {
  name: string;
  type: string;
  required: boolean;
  attributes: Attribute[];
}

interface FormData {
  [key: string]: string;
}

const DynamicForm = ({
  selectedStatus,
  onClose,
  handleOnSubmit,
  model,
}: {
  open: boolean;
  selectedStatus?: string;
  onClose: () => void;
  handleOnSubmit: (data: any) => void;
  model: string;
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { handleSubmit, reset } = useForm<FormData>();
  const [schema, setSchema] = useState<Field[]>([]);
  const [options, setOptions] = useState<Field[]>([]);
  const { loading, setLoading } = useLoading();
  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      fetch(`/api/${model}?type=fields`)
        .then((response) => response.json())
        .then(({ fields, options }) => {
          setSchema(fields);
          setOptions(options); // Store dropdown options
          setLoading(false);
        })
        .catch((error) => console.error("Error fetching schema:", error));
    };
    fetchFields();
  }, [model, setLoading]);
  const handleChange = (field: string, value: any) => {

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);


      const response = await fetch(`/api/${model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response)
      setLoading(false);
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      //setColumn()
      const result = await response.json();
      handleOnSubmit(result);
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <DialogContent sx={{ flex: 1 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",

            minHeight: 300,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Grid
            container
            direction="row"
            sx={{
              gap: 2,
              alignItems: "space-between",
              alignContent: "flex-start",
              width: "100%",
            }}
          >
            {schema.map((field) => {
              //if (field.name === "id") return null; // ✅ Skip rendering if field is "id"
              if (field.name === "createdAt") return null; // ✅ Skip rendering if field is "createdAt"
              //if (field.name === "slug") return null; // ✅ Skip rendering if field is "createdAt"

              if (field.type === "Json") {
                return  <FormControl key={field.name} fullWidth>
                <TextField
                  className="capitalize"
                  label={`${model} ${field.name}`}
                  type="text"
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  fullWidth
                  maxRows={4}
                  multiline
                  rows={4}

                />
              </FormControl>;
              }
              if (field.name.endsWith("Id")) {
                const n = field.name.replace(/Id$/, ""); // Remove "Id"
                const fieldOptions = options[n as keyof typeof options];

                if (
                  n === "status" &&
                  selectedStatus &&
                  Array.isArray(fieldOptions)
                ) {
                  fieldOptions.forEach((option: any) => {
                    if (option.id === selectedStatus) {
       
                      formData[field.name] = option.id;
                    }
                  });
                }

                return (
                  <>
                    <FormControl fullWidth>
                      <Grid
                        size={12}
                        position={"relative"}
                        sx={{ paddingRight: 7 }}
                      >
                        {field.name === "colorId" ? (
                          <>
                           <InputLabel className="capitalize">{`${model} ${n}`}</InputLabel>
                           <Select
                             fullWidth
                             readOnly={formData[field.name]}
                             required
                             value={
                               formData[field.name]
                                 ? formData[field.name]
                                 : formData[field.name] || ""
                             }
                             onChange={(e) =>
                               handleChange(field.name, e.target.value)
                             }
                           >
                             {Array.isArray(fieldOptions) // ✅ Ensure it's an array
                               ? fieldOptions.map((option: any) => (
                                   <MenuItem key={option.id} value={option.id}>
                                     {option.name}
                                   </MenuItem>
                                 ))
                               : null}{" "}
                             {/* If not an array, render nothing */}
                           </Select>
                           </>
                        ) : (
                          <>
                            <InputLabel className="capitalize">{`${model} ${n}`}</InputLabel>
                            <Select
                              fullWidth
                              readOnly={formData[field.name]}
                              required
                              value={
                                formData[field.name]
                                  ? formData[field.name]
                                  : formData[field.name] || ""
                              }
                              onChange={(e) =>
                                handleChange(field.name, e.target.value)
                              }
                            >
                              {Array.isArray(fieldOptions) // ✅ Ensure it's an array
                                ? fieldOptions.map((option: any) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
                                    </MenuItem>
                                  ))
                                : null}{" "}
                              {/* If not an array, render nothing */}
                            </Select>
                          </>
                        )}

                        <Box position={"absolute"} right={2} top={2}>
                          <IconButton size="large">
                            <AddCircleOutlineRounded />
                          </IconButton>
                        </Box>
                      </Grid>
                    </FormControl>
                  </>
                );
              }
              // Handle Fields Ending with "Id" as Select Dropdown

              // Handle Integer Fields
              if (field.type === "Int") {
                return (
                  <>
                    <Grid key={field.name} size={6}>
                      <TextField
                        key={field.name}
                        label={`Enter ${model} ${field.name}`}
                        type="number"
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        helperText={`${model} ${field.name}`}
                      />
                    </Grid>
                  </>
                );
              }

              // Handle String Fields
              if (field.type === "String") {
                if (field.name === "color") {
                  return (
                    <>
                      <Grid container direction="row" spacing={2}>
                        <Grid key={field.name} size={8}>

                            <SketchPicker
                              width="100%"
                              color={formData[field.name] || "#000000"}
                              onChange={(color) =>
                                handleChange(field.name, color.hex)
                              }
                            />
   
                        </Grid>
                        <Grid size={4}>
                          <IconButton>
                            <AddCircleOutlineRounded />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </>
                  );
                } 
                return (
<>
                    <TextField
              
                      className="capitalize"
                      label={`${model} ${field.name}`}
                      type="text"
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      fullWidth
                    />
      </>
                );
              }

              // Handle DateTime Fields
              if (field.type === "DateTime") {
                return (
                  <Stack
                    key={field.name}
                    direction={"row"}
                    spacing={2}
                    alignItems={"center"}
                    alignContent={"space-between"}
                  >
                    <InputLabel className="capitalize w-[200px]">
                      {field.name}
                    </InputLabel>

                      <DatePicker
                        className="capitalize w-full small"
                        key={field.name}
                        label={`Select ${model} ${field.name}`}
                        value={formData[field.name] || null}
                        onChange={(date) => handleChange(field.name, date)}
                        slots={{
                          textField: (params) => <TextField {...params} />,
                        }}
                      />
  
                  </Stack>
                );
              }

              return null;
            })}
            {loading && <GlobalLoader />}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

export default DynamicForm;
