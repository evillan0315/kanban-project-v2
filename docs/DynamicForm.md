# DynamicForm Component Documentation

## Overview
The `DynamicForm` component is a flexible and reusable form that dynamically generates input fields based on a schema fetched from an API. It supports various field types, including text, number, date, JSON, dropdowns, and color pickers.

## Props

| Prop Name       | Type         | Description |
|----------------|-------------|-------------|
| `open`         | `boolean`    | Controls whether the form is open or not. |
| `selectedStatus` | `string` (optional) | Pre-selected status value, used for status-related dropdowns. |
| `onClose`      | `() => void` | Callback function triggered when the form is closed. |
| `handleOnSubmit` | `(data: any) => void` | Function called when the form is submitted with the entered data. |
| `model`        | `string`     | Specifies the model name for API fetching and field generation. |

## Behavior
- Fetches field definitions from `/api/{model}?type=fields`.
- Populates dropdown fields based on fetched options.
- Automatically generates slugs for form entries if not provided.
- Submits form data to `/api/{model}` using a POST request.
- Displays a loading indicator (`GlobalLoader`) when fetching data or submitting.

## Field Handling
The component dynamically renders different types of input fields based on the schema:

### Skipped Fields
- `id` (Primary key)
- `createdAt` (Timestamp field)
- `slug` (Generated automatically)

### Supported Field Types
- **String Fields**: Rendered as text inputs.
- **Integer Fields**: Rendered as number inputs.
- **DateTime Fields**: Uses `DatePicker` from MUI.
- **JSON Fields**: Displays field name but lacks an interactive editor.
- **Dropdown Fields**: Fields ending in `Id` (e.g., `statusId`) are rendered as `<Select>` components with options fetched from the API.
- **Color Picker**: Uses `SketchPicker` from `react-color` for color selection.

## Example Usage
```tsx
<DynamicForm
  open={isOpen}
  model="task"
  selectedStatus="active"
  onClose={() => setIsOpen(false)}
  handleOnSubmit={(data) => console.log("Form Submitted", data)}
/>
```

## Customization
- Button position can be adjusted within the parent component.
- Additional field types can be supported by modifying the mapping logic.
- Styles can be customized via the `sx` prop in MUI components.

## Dependencies
- `@mui/material` (TextField, Select, MenuItem, DatePicker, FormControl, etc.)
- `react-hook-form` (Form handling)
- `react-color` (Color picker)
- `@mui/x-date-pickers` (Date selection)

## Notes
- Ensure the API provides a consistent schema for the form fields.
- Modify field handling logic if new data types need to be supported.
- Uses the `useLoading` hook to track loading state during data fetch and submission.

---
This component provides an easy way to create dynamic forms based on API responses, making it highly reusable across different models in your application. 🚀

