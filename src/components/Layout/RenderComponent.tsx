"client";

import Grid2 from "@mui/material/Grid2";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  Button,
  AccordionSummary,
  AppBar,
  Avatar,
  Container,
  IconButton,
  Radio,
  Select,
  Switch,
  TextField,
  Toolbar,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  Autocomplete,
  Badge,
  Breadcrumbs,
  ButtonGroup,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Pagination,
  Paper,
  Popover,
  RadioGroup,
  Rating,
  Slider,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import {
  ExpandMoreRounded as ExpandMoreIcon,
  MenuOutlined as MenuIcon,
  Edit,
  Delete,
  CopyAll,
  Add,
  Star as StarIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

const componentMap: { [key: string]: React.ElementType } = {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Container,
  Button,
  Grid2,
  AppBar,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Toolbar,
  IconButton,
  MenuIcon,
  ExpandMoreIcon,
  TextField,
  Select,
  Radio,
  Switch,
  Avatar,
  Edit,
  Delete,
  CopyAll,
  Add,
  Alert,
  AlertTitle,
  Autocomplete,
  Badge,
  Breadcrumbs,
  ButtonGroup,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Pagination,
  Paper,
  Popover,
  RadioGroup,
  Rating,
  Slider,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Tooltip,
  StarIcon,
  CloseIcon,
  SearchIcon,
  SaveIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  // Add other MUI components as needed
};
interface ComponentProps {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: { [key: string]: any };
  children?: ComponentProps[];
}

export const RenderComponent: React.FC<{ component: ComponentProps }> = ({
  component,
}) => {
  try {
    if (!component || typeof component !== "object") {
      return <div style={{ color: "red" }}>⚠️ Invalid component format</div>;
    }

    const { type, props, children } = component;
    const Component = componentMap[type];

    if (!Component) {
      return (
        <div style={{ color: "red" }}>⚠️ Unknown component type: `${type}`</div>
      );
    }

    // Check if children exists in props
    const hasStringChildrenInProps = typeof props?.children === "string";
    const hasArrayChildren = Array.isArray(children);
    const hasObjectChildren = typeof children === "object" && !hasArrayChildren;

    // Recursively render children if it's an array or object
    const childrenElements = hasArrayChildren ? (
      children.map((child, index) =>
        child && typeof child === "object" ? (
          <RenderComponent key={index} component={child} />
        ) : null
      )
    ) : hasObjectChildren ? (
      <RenderComponent component={children} />
    ) : null;

    return (
      <Component {...props}>
        {hasStringChildrenInProps && props.children}{" "}
        {/* Render string children inside props */}
        {childrenElements} {/* Render normal children */}
      </Component>
    );
  } catch (error) {
    console.error("Error rendering component:", error);
    return <div style={{ color: "red" }}>⚠️ Error rendering component</div>;
  }
};
