import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { MdAdd } from "react-icons/md";
import { useTaskManager } from "../../hooks/useTaskManager";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import useCompanyData from "../../hooks/useCompanyData";
import axios from "axios";

const TaskManager = () => {
  const { userEmail } = useCompanyData();
  const {
    tasks,
    assignees,
    expandedTaskId,
    setExpandedTaskId,
    setTasks,
    comments,
    handleStatusChange,
    fetchComments,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDeleteTask,
  } = useTaskManager(userEmail);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    status: "New",
  });
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Separate tasks into created and assigned based on userEmail
  const createdTasks = tasks.filter((task) => task.createdBy === userEmail);
  const assignedTasks = tasks.filter((task) => task.assignee === userEmail);

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

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      status: task.status,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingTask) {
        response = await axios.put(
          `https://dashboard-express-server.vercel.app/checklist/tasks/${editingTask.id}`,
          {
            ...newTask,
            userEmail,
            platform: "accountant",
          }
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id ? response.data : task
          )
        );
      } else {
        response = await axios.post(
          "https://dashboard-express-server.vercel.app/checklist/tasks",
          {
            ...newTask,
            accountantEmail: userEmail,
            platform: "accountant",
            createdBy: userEmail,
          }
        );
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };

  const handleExpandClick = (taskId) => {
    const isExpanded = expandedTaskId === taskId ? null : taskId;
    setExpandedTaskId(isExpanded);

    if (isExpanded) {
      fetchComments(taskId);
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
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
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

        {!showTaskForm && (
          // <button
          //   onClick={handleNewTask}
          //   className="rounded-lg bg-lightPrimary text-brand-500 hover:bg-gray-100 px-4 py-2 flex items-center justify-center"
          // >
          //   <MdAdd className="h-5 w-5 mr-2" />
          //   <span className="font-medium text-sm">New Task</span>
          // </button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNewTask}
            startIcon={<MdAdd />}
            sx={{
              borderRadius: "20px",
              boxShadow: 2,
              textTransform: "none",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: "primary.main",
                boxShadow: 4,
              },
            }}
          >
            <span className="font-medium text-sm">New Task</span>
          </Button>
        )}
      </Box>

      <Grid container spacing={3} direction="column">
        {showTaskForm && (
          <Grid item xs={12}>
            <TaskForm
              newTask={newTask}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleCloseForm={handleCloseForm}
              editingTask={editingTask}
              assignees={assignees}
            />
          </Grid>
        )}

        <Grid item xs={12} md={8}>
          <h3 style={{ marginBottom: "16px" }}>Tasks Created by Me</h3>
          <Grid container spacing={2} direction="column">
            {createdTasks.map((task) => (
              <Grid item xs={12} key={task.id}>
                <TaskCard
                  task={task}
                  expanded={expandedTaskId === task.id}
                  onExpand={handleExpandClick}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onDelete={() => setConfirmDelete(task.id)}
                  comments={comments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  onAddComment={handleAddComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  editingComment={editingComment}
                  setEditingComment={setEditingComment}
                  userEmail={userEmail}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Tasks Assigned to the User */}
        <Grid item xs={12} md={8} mt={4}>
          <h3 style={{ marginBottom: "16px" }}>Tasks Assigned to Me</h3>
          <Grid container spacing={2} direction="column">
            {assignedTasks.map((task) => (
              <Grid item xs={12} key={task.id}>
                <TaskCard
                  task={task}
                  expanded={expandedTaskId === task.id}
                  onExpand={handleExpandClick}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onDelete={() => setConfirmDelete(task.id)}
                  comments={comments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  onAddComment={handleAddComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  editingComment={editingComment}
                  setEditingComment={setEditingComment}
                  userEmail={userEmail}
                />
              </Grid>
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
          <Button
            onClick={() => {
              handleDeleteTask(confirmDelete);
              setConfirmDelete(null);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManager;
