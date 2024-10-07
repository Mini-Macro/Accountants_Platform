import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { StyledCard } from "./StyledComponent";

export const TaskForm = ({
  newTask,
  handleInputChange,
  handleSubmit,
  handleCloseForm,
  editingTask,
  assignees,
}) => {
  return (
    <StyledCard>
      <CardHeader
        title={
          <Typography variant="h6">
            {editingTask ? "Edit Task" : "Create New Task"}
          </Typography>
        }
        action={
          <IconButton onClick={handleCloseForm} aria-label="close">
            <IoMdClose />
          </IconButton>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                label="Task Title"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  className: "text-xs font-medium text-gray-600",
                }}
                InputProps={{
                  className:
                    "text-sm font-medium text-navy-700 dark:text-white",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                name="assignee"
                value={newTask.assignee}
                onChange={handleInputChange}
                label="Assignee"
                variant="outlined"
                fullWidth
                displayEmpty
                startAdornment={<PersonIcon className="text-gray-600 mr-2" />}
                className="text-sm font-medium text-navy-700 dark:text-white"
              >
                <MenuItem
                  value=""
                  disabled
                  className="text-xs font-medium text-gray-600"
                >
                  Select Assignee
                </MenuItem>
                {assignees.map((assignee) => (
                  <MenuItem
                    key={assignee}
                    value={assignee}
                    className="text-sm font-medium text-navy-700 dark:text-white"
                  >
                    {assignee}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                label="Task Description"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                InputLabelProps={{
                  className: "text-xs font-medium text-gray-600",
                }}
                InputProps={{
                  className:
                    "text-sm font-medium text-navy-700 dark:text-white",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={editingTask ? <MdEdit /> : <AddIcon />}
                fullWidth
                className="bg-brand-500 hover:bg-brand-600 text-white"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </StyledCard>
  );
};
