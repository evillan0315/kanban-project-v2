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
  Paper,

  //OutlinedInput,
  //Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useState, useEffect,  } from "react";
import { SketchPicker } from "react-color";
import { DatePicker } from "@mui/x-date-pickers";
import {} from "@mui/x-date-pickers";
import GlobalLoader from "../GlobalLoader";
import { useLoading } from "@/hooks/useLoading";
import { AddCircleOutlineRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import "dayjs/locale/en";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import AceCodeEditor from "../AceEditor";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");
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
  data,
}: {
  open: boolean;
  selectedStatus?: string;
  onClose: () => void;
  handleOnSubmit: (data: any) => void;
  model: string;
  data: FormData;
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(data?data:{});
  const { handleSubmit, reset } = useForm<FormData>();
  const [schema, setSchema] = useState<Field[]>([]);
  const [options, setOptions] = useState<Field[]>([]);
  const [code, setCode] = useState<string>();
  const { loading, setLoading } = useLoading();
  const router = useRouter()
  let method = "POST";
  if(data){
    method="PUT"
    //setFormData(data)
  }
  const { enqueueSnackbar } = useSnackbar();
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

    if(field==='props'){
      setCode(value)
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/${model}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      
      setLoading(false);
      if (!response.ok) {
        enqueueSnackbar(`Failed to submit ${model} record`, {variant:'error'})
        throw new Error("Failed to submit form");
      }
      //setColumn()
      const result = await response.json();
      handleOnSubmit(result);
      onClose();
      reset();
      enqueueSnackbar(`Submitted ${model} record`, {variant:'success'})
      router.push(router.asPath)
    } catch (error) {
      enqueueSnackbar(`Error submitting form: ${error}`, {variant:'error'})
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
            spacing={2}
            sx={{
              gap: 2,
              alignItems: "space-between",
              alignContent: "flex-start",
            
              width: "100%",
            }}
          > 
          <Grid size={5}>{JSON.stringify(code)}</Grid>
          <Grid size={7} height={"100%"}>

          <Paper variant="outlined" sx={{padding:2}}>
            {schema?.map((field) => {
              //if (field.name === "id") return null; // ✅ Skip rendering if field is "id"
              if (field.name === "createdAt") return null; // ✅ Skip rendering if field is "createdAt"
              //if (field.name === "slug") return null; // ✅ Skip rendering if field is "createdAt"

              if (field.type === "Json") {
                return (
                  <FormControl key={field.name} fullWidth>
                    <AceCodeEditor initialCode={code as string}  handleChange={(e)=>handleChange(field.name, e)} />
                    
                  </FormControl>
                );
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
                    <FormControl key={field.name} fullWidth>
                      <Grid
                        size={12}
                        position={"relative"}
                        sx={{ paddingRight: 7 }}
                        marginY={1}
                      >
                        {field.name === "colorId" ? (
                          <>
                            <InputLabel className="capitalize">{`${model} ${n}`}</InputLabel>
                            <Select
                          
                              fullWidth
                              className="margin-y-1"
                              //readOnly={formData[field.name]?true:false}
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
                       
                            className="margin-y-1"
                              fullWidth
                              //readOnly={formData[field.name]?true:false}
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
                      margin={"normal"}
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
                      <Grid container direction="row" spacing={2} marginY={2}>
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
                    {" "}
               
                      <TextField
                        margin={"normal"}
                        className="capitalize"
                        label={field.name === 'id' ? null : `${model} ${field.name}`}
                        type={field.name === 'id' ? 'hidden' : 'text'}
                        key={field.name}
                        required={field.required}
                        variant={field.name === 'content'|| field.name==='description' ? 'outlined' : 'filled'}
                        value={formData[field.name]?formData[field.name]:""} // Important: Bind the value to the state
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        maxRows={field.name==='content' || field.name==='description'? 2: 0}
                        multiline={field.name==='content' || field.name==='description'}
                        rows={field.name==='content' || field.name==='description'? 2: 0}
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
                    marginY={2}
                  >
                    <InputLabel className="capitalize w-[200px]">
                      {field.name}
                    </InputLabel>

                    <DatePicker
                   
                      className="capitalize w-full small"
                      key={field.name}
                      label={`Select ${model} ${field.name}`}
                      value={dayjs.utc(formData[field.name]) || ""}
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
             </Paper>
            </Grid>
            {loading && <GlobalLoader />}
          </Grid>
        </Box>
        
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        
      </DialogActions>
      
    </>
  );
};

export default DynamicForm;
