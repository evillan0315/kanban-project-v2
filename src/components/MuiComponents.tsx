"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  Radio,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Grid2,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface MuiComponentsProps {
  // You can add props to this interface if needed
}

const MuiComponents: React.FC<MuiComponentsProps> = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Material UI Components
      </Typography>

      {/* Basic Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Basic Components</Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Typography sx={{ ml: 2 }}>Remy Sharp</Typography>
        </Box>
        <Button variant="contained" color="primary">
          Primary Button
        </Button>
        <TextField id="standard-basic" label="Standard" variant="standard" />
      </Box>

      {/* Form Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Form Components</Typography>
        <Checkbox defaultChecked />
        <Radio />
        <FormControl>
          <FormLabel id="demo-simple-select-label">Age</FormLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={10}
            label="Age"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
        </FormGroup>
      </Box>

      {/* Layout Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Layout Components</Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Paper elevation={3}>
              <Box p={2}>Grid2 Item 1</Box>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <Paper elevation={3}>
              <Box p={2}>Grid2 Item 2</Box>
            </Paper>
          </Grid2>
        </Grid2>
      </Box>

      {/* Navigation Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Navigation Components</Typography>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              {/* Add your icon here */}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={openDrawer}>
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      {/* Data Display Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Data Display Components</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{/* Add table rows here */}</TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Media Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Media Components</Typography>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            height="140"
            image="/path/to/image.jpg"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, and have
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>

      {/* Feedback Components */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Feedback Components</Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Tooltip title="Add">
          <Button>Hover me</Button>
        </Tooltip>
        <Snackbar open>
          <Alert severity="success">This is a success message!</Alert>
        </Snackbar>
      </Box>

      {/* Dialogs */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Dialogs</Typography>
        <Button variant="outlined" onClick={() => setOpenDialog(true)}>
          Open Dialog
        </Button>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>This is a simple dialog</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Disagree</Button>
            <Button onClick={() => setOpenDialog(false)}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default MuiComponents;
