import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
  Chip,
  Fade,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { MdAdd, MdPerson, MdSend, MdEdit, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Grid from "@mui/material/Grid";
import useCompanyData from "../../hooks/useCompanyData";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "auto",
  cursor: "pointer",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "New"
      ? theme.palette.info.light
      : status === "In Progress"
      ? theme.palette.warning.light
      : theme.palette.success.light,
  color: theme.palette.getContrastText(
    status === "New"
      ? theme.palette.info.light
      : status === "In Progress"
      ? theme.palette.warning.light
      : theme.palette.success.light
  ),
}));

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "New",
  });
  const [assignees, setAssignees] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null); // Track the expanded task
  const [showTaskForm, setShowTaskForm] = useState(false); // Control the form visibility
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const { userEmail, error, loading } = useCompanyData();

  useEffect(() => {
    if (userEmail) {
      fetchTasks(userEmail);
      fetchAssignees(userEmail, "accountant"); // Replace with your email address
    }
  }, [userEmail]);

  const fetchTasks = async (assignee) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tasks/${assignee}`
      );
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleExpandClick = (taskId) => {
    const isExpanded = expandedTaskId === taskId ? null : taskId;
    setExpandedTaskId(isExpanded); // Toggle the expanded state

    // fetch comments for the expanded task
    if (isExpanded) {
      fetchComments(taskId);
    }
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      status: "New",
    });
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      status: "New",
    });
  };

  const fetchAssignees = async (email, platform) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/assignees/${email}/${platform}`
      );
      setAssignees(response.data);
    } catch (error) {
      console.error("Error fetching assignees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleStatusChange = async (taskId, newStatus, event) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the card
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Update local state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tasks/${taskId}/comments`
      );
      setComments((prevComments) => ({
        ...prevComments,
        [taskId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (taskId, event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent the click from bubbling up to the card
    try {
      const response = await axios.post(
        `http://localhost:3000/api/tasks/${taskId}/comments`,
        { userEmail, content: newComment },
        { headers: { "Content-Type": "application/json" } }
      );
      setComments((prevComments) => ({
        ...prevComments,
        [taskId]: [...(prevComments[taskId] || []), response.data],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/tasks/${taskId}/${userEmail}`
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditComment = async (e, commentId, newContent) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/comments/${commentId}`,
        { content: newContent, userEmail }
      );
      setComments((prevComments) => ({
        ...prevComments,
        [response.data.task_id]: prevComments[response.data.task_id].map(
          (comment) => (comment.id === commentId ? response.data : comment)
        ),
      }));
      setEditingComment(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (e, commentId, taskId) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `http://localhost:3000/api/comments/${commentId}/${userEmail}`
      );
      setComments((prevComments) => ({
        ...prevComments,
        [taskId]: prevComments[taskId].filter(
          (comment) => comment.id !== commentId
        ),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingTask) {
        response = await axios.put(
          `http://localhost:3000/api/tasks/${editingTask.id}`,
          {
            ...newTask,
            userEmail, // Include userEmail for verification
            platform: "accountant",
          }
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id ? response.data : task
          )
        );
      } else {
        response = await axios.post("http://localhost:3000/api/tasks", {
          ...newTask,
          // clientEmail: userEmail,
          accountantEmail: userEmail,
          platform: "accountant",
          createdBy: userEmail,
        });
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        maxWidth: "100%",
        height: "800px",
        overflowY: "scroll",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          // Webkit (Chrome, Safari, newer versions of Opera)
          display: "none",
        },
        msOverflowStyle: "none",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Task Management
        </h2>

        {/* New Task Button */}
        {!showTaskForm && (
          <button
            onClick={handleNewTask}
            className="rounded-lg bg-lightPrimary text-brand-500 hover:bg-gray-100 px-4 py-2 flex items-center justify-center"
          >
            <MdAdd className="h-5 w-5 mr-2" />
            <span className="font-medium text-sm">New Task</span>
          </button>
        )}
      </Box>
      <Grid container spacing={3} direction="column">
        {showTaskForm && (
          <Grid item xs={12}>
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
                        startAdornment={
                          <PersonIcon className="text-gray-600 mr-2" />
                        }
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
          </Grid>
        )}
        <Grid item xs={12} md={8}>
          {/* <Typography variant="h5" gutterBottom>
            Task List
          </Typography> */}
          <Grid container spacing={2} direction="column">
            {tasks.map((task) => (
              <Fade in={true} key={task.id}>
                <Grid item xs={12}>
                  <StyledCard onClick={() => handleExpandClick(task.id)}>
                    {/* Task title and status (always visible) */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <h6 className="font-medium text-gray-600 ">
                        {task.title}
                      </h6>
                      <Box>
                        <StatusChip
                          label={task.status}
                          status={task.status}
                          size="small"
                        />
                        {task.createdBy === userEmail && (
                          <>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                              size="small"
                            >
                              <MdEdit />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(task.id);
                              }}
                              size="small"
                            >
                              <MdDelete />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Additional details (shown only if expanded) */}
                    {expandedTaskId === task.id && (
                      <Fade in={expandedTaskId === task.id}>
                        <Box mt={2}>
                          <p className="text-xs font-medium text-gray-600">
                            {task.description}
                          </p>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{ mt: 1 }}
                          >
                            <PersonIcon color="action" sx={{ mr: 1 }} />
                            <p className="text-xs font-medium text-gray-600">
                              {task.assignee}
                            </p>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value, e)
                              }
                              fullWidth
                              variant="outlined"
                              size="small"
                              onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up
                              className="text-sm font-medium text-navy-700 dark:text-white"
                            >
                              <MenuItem value="New">New</MenuItem>
                              <MenuItem value="In Progress">
                                In Progress
                              </MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <h6 className="font-medium text-navy-700 dark:text-white">
                              Comments
                            </h6>
                            <Box
                              component="form"
                              onSubmit={(e) => handleAddComment(task.id, e)}
                              sx={{ display: "flex", mt: 1 }}
                              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
                            >
                              <TextField
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                label="Add a comment"
                                variant="outlined"
                                fullWidth
                                size="small"
                                InputLabelProps={{
                                  className:
                                    "text-xs font-medium text-gray-600",
                                }}
                                InputProps={{
                                  className:
                                    "text-sm font-medium text-navy-700 dark:text-white",
                                }}
                              />
                              <IconButton
                                type="submit"
                                color="primary"
                                sx={{ ml: 1 }}
                              >
                                <SendIcon />
                              </IconButton>
                            </Box>

                            {comments[task.id]?.map((comment) => (
                              <Box
                                key={comment.id}
                                sx={{
                                  mt: 1,
                                  pl: 1,
                                  borderLeft: "4px solid #ccc",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="text-xs font-medium text-gray-600">
                                  {comment.user_email}
                                </p>
                                {editingComment === comment.id ? (
                                  <Box
                                    component="form"
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleEditComment(
                                        e,
                                        comment.id,
                                        e.target.content.value
                                      );
                                    }}
                                  >
                                    <TextField
                                      name="content"
                                      defaultValue={comment.content}
                                      fullWidth
                                      size="small"
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      type="submit"
                                      size="small"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingComment(null);
                                      }}
                                      size="small"
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                ) : (
                                  <Box display="flex" alignItems="center">
                                    <p className="text-sm font-medium text-navy-700">
                                      {comment.content}
                                    </p>
                                    {comment.user_email === userEmail && (
                                      <>
                                        <IconButton
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingComment(comment.id);
                                          }}
                                          size="small"
                                        >
                                          <MdEdit />
                                        </IconButton>
                                        <IconButton
                                          onClick={(e) =>
                                            handleDeleteComment(
                                              e,
                                              comment.id,
                                              task.id
                                            )
                                          }
                                          size="small"
                                        >
                                          <MdDelete />
                                        </IconButton>
                                      </>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    )}
                  </StyledCard>
                </Grid>
              </Fade>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={() => handleDeleteTask(confirmDelete)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManager;
