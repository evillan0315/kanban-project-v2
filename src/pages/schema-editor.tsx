/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as yup from "yup";
import { useLoading } from "@/hooks/useLoading";
import TerminalDrawer from "@/components/TerminalDrawer";
interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "boolean"
    | "json"
    | "datetime";
  required?: boolean;
  unique?: boolean;
  validation?: yup.AnySchema;
}

const DynamicSchemaForm: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      name: "name",
      label: "Model Name",
      type: "text",
      required: true,
      validation: yup.string().required("Model name is required"),
    },
  ]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addMessage } = useLoading();
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Build dynamic validation schema
  const validationSchema = useMemo(() => {
    return yup.object().shape(
      formFields.reduce((acc, field) => {
        if (field.validation) {
          acc[field.name] = field.validation;
        }
        return acc;
      }, {} as Record<string, yup.AnySchema>)
    );
  }, [formFields]);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => {
      return formFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {} as Record<string, any>);
    }, [formFields]),
  });

  // Add new field
  const handleAddField = () => {
    const newFieldName = `field${formFields.length}`;
    setFormFields([
      ...formFields,
      {
        name: newFieldName,
        label: `New Field ${formFields.length}`,
        type: "text",
        validation: yup.string().optional(),
      },
    ]);
  };

  // Remove field
  const handleRemoveField = (index: number) => {
    setFormFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };
  const onClose = () => {
    console.log("close");
    setTerminalOpen(false);
  };
  const onSubmit = async (data: any) => {
    try {
      setTerminalOpen(true);
      //setLoading(true);
      addMessage("🚀 Creating model...");

      const modelName = data?.name;
      delete data?.name;

      // Generate Prisma Schema Fields
      const schemaFields = formFields
        .filter((field, index) => index > 0)
        .map((field) => {
          const typeFieldName = `${field.name}_type`;
          const uniqueFieldName = `${field.name}_unique`;
          const requiredFieldName = `${field.name}_required`;

          const fieldType = data[typeFieldName] || "String";
          const isUnique = data[uniqueFieldName] || false;
          const isRequired = data[requiredFieldName] || false;

          let prismaField = `${data[field.name]} ${fieldType}${
            isRequired ? "" : "?"
          }`;
          if (isUnique) prismaField += " @unique";
          if (fieldType === "DateTime") prismaField += " @updatedAt"; // Auto-timestamp

          return prismaField;
        })
        .join("\n  ");

      const prismaSchema = `
    model ${modelName} {
      id    String     @id @default(uuid())
      ${schemaFields}
    }
    `;

      addMessage("📡 Sending model to server...");

      // 🔥 Use EventSource for real-time updates
      const eventSource = new EventSource(
        `/api/createModel?schema=${encodeURIComponent(
          prismaSchema
        )}&modelName=${modelName}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addMessage(data.message);
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        addMessage("❌ Error receiving updates from server.");
        eventSource.close();
        //setLoading(false);
      };

      // Close connection when finished
      eventSource.addEventListener("end", () => {
        addMessage(`✅ Model ${modelName} created successfully!`);
        setSuccessMessage(`Model ${modelName} created successfully!`);
        setErrorMessage(null);
        eventSource.close();
        //setLoading(false);
      });
    } catch (error) {
      addMessage(`❌ Error: ${error}`);
      setErrorMessage(`Error creating model: ${error}`);
      setSuccessMessage(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dynamic Prisma Schema Manager
      </Typography>
      <Typography variant="body1" gutterBottom>
        A Next.js, MUI, and TypeScript-powered tool for managing Prisma schemas
        dynamically—complete with a GUI and an interactive terminal.
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Define your Prisma schema easily by adding fields, specifying their
        types, and setting constraints like uniqueness and required fields. Once
        your schema is ready, generate models instantly.
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Schema Editor
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((field, index) => (
          <Box
            key={field.name}
            sx={{ display: "flex", alignItems: "center", margin: "20px 0" }}
            gap={2}
          >
            <Controller
              name={field.name as never}
              control={control}
              render={({ field: formFieldControl }) => (
                <TextField
                  {...formFieldControl}
                  label={field.label}
                  fullWidth
                />
              )}
            />

            {index > 0 && (
              <>
                <Controller
                  name={`${field.name}_type` as never}
                  control={control}
                  render={({ field: typeControl }) => (
                    <TextField
                      {...typeControl}
                      select
                      fullWidth
                      label="Field Type"
                    >
                      {["String", "Int", "Boolean", "Json", "DateTime"].map(
                        (option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  )}
                />
                <Controller
                  name={`${field.name}_unique` as never}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Unique"
                    />
                  )}
                />
                <Controller
                  name={`${field.name}_required` as never}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Required"
                    />
                  )}
                />
                <Tooltip title="Remove Field">
                  <IconButton
                    onClick={() => handleRemoveField(index)}
                    color="error"
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        ))}
        <Box>
          <Button
            type="button"
            variant="outlined"
            color="info"
            onClick={handleAddField}
            sx={{ mr: 2 }}
            startIcon={<AddIcon />}
          >
            Add Field
          </Button>

          <Button
            disabled={terminalOpen}
            type="submit"
            variant="contained"
            color="info"
            sx={{}}
            startIcon={<CheckCircleIcon />}
          >
            Create Model
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Instructions
      </Typography>
      <Typography variant="body2" color="textSecondary">
        1. Enter a **model name** in the first field.
        <br />
        2. Add additional fields using the **&quot;Add Field&quot;** button.
        <br />
        3. Select the field **type**, and optionally mark it as **Unique** or
        **Required**.
        <br />
        4. Click **&quot;Create Model&quot;** to generate the Prisma schema.
        <br />
      </Typography>

      <TerminalDrawer onClose={onClose} terminalOpen={terminalOpen} />
    </Box>
  );
};

export default DynamicSchemaForm;
