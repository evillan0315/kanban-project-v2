# DialogDynamicForm Component Documentation

## Overview
`DialogDynamicForm` is a reusable modal dialog component built using Material UI's `Dialog` component. It dynamically renders a form based on the provided `model` prop and supports animations using Framer Motion.

## Features
- **Dynamic Form Rendering**: Uses `DynamicForm` to generate a form based on the specified `model`.
- **Smooth Animations**: Uses Framer Motion for fade-in and scaling effects.
- **Full-Screen Modal**: The dialog adapts to a full-height layout for an immersive experience.
- **Custom Styling**: Implements a dark theme with a sleek shadow effect.
- **Actions at the Bottom**: The action buttons (Cancel & Submit) are always positioned at the bottom.

---

## Props
| Prop Name       | Type                     | Description |
|---------------|------------------------|-------------|
| `model`        | `string`                 | The name of the model, displayed in the dialog title. |
| `open`         | `boolean`                | Controls whether the dialog is open or closed. |
| `onClose`      | `() => void`             | Callback function triggered when the dialog is closed. |
| `handleOnSubmit` | `(data: any) => void`    | Function to handle form submission. |

---

## Usage Example

```tsx
import { useState } from "react";
import DialogDynamicForm from "@/components/DialogDynamicForm";

export default function Example() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Form Submitted", data);
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Form</button>
      <DialogDynamicForm model="Task" open={open} onClose={() => setOpen(false)} handleOnSubmit={handleSubmit} />
    </div>
  );
}
```

---

## Implementation Details

### **1. Framer Motion Animation**
```tsx
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};
```
- The modal fades in and scales up smoothly when opened.
- `hidden`: Initial state when the dialog is not visible.
- `visible`: The final state when the dialog is fully open.

### **2. Material UI Dialog Configuration**
```tsx
<Dialog
  open={open}
  onClose={onClose}
  fullWidth
  maxWidth="lg"
  sx={{
    "& .MuiPaper-root": {
      display: "flex",
      flexDirection: "column",
      background: "#000009",
      height: "100vh",
    },
  }}
>
```
- `fullWidth`: Ensures the dialog takes up the full width.
- `maxWidth="lg"`: Provides ample space for large forms.
- `background: "#000009"`: Dark mode styling.

### **3. Close Button in Top-Right Corner**
```tsx
<IconButton
  color="primary"
  onClick={onClose}
  sx={{
    position: "absolute",
    top: 8,
    right: 8,
  }}
>
  <Close />
</IconButton>
```
- Ensures that users can close the modal easily.
- Positioned at the top-right of the `DialogTitle`.

### **4. Action Buttons at the Bottom**
```tsx
<DialogActions sx={{ p: 2 }}>
  <Button variant="outlined" color="primary" onClick={onClose}>Cancel</Button>
  <Button type="submit" variant="contained" color="primary">Submit</Button>
</DialogActions>
```
- Positioned at the bottom for consistency.
- Uses `DialogActions` for structured button layout.

---

## Customization
You can easily customize the dialog by adjusting the styles and animations:

### **Change Dialog Background Color**
Modify the `background` property inside `sx`:
```tsx
sx={{ "& .MuiPaper-root": { background: "#1a1a2e" } }}
```

### **Adjust Animation Speed**
Modify the `duration` inside `dialogVariants`:
```tsx
transition: { duration: 0.5 }
```

---

## Conclusion
`DialogDynamicForm` is a highly customizable and reusable modal dialog that enhances user experience with animations and structured layouts. It seamlessly integrates with dynamic forms and supports various data models.

