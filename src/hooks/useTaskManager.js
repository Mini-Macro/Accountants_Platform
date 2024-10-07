import { useState, useEffect } from "react";
import axios from "axios";

export const useTaskManager = (userEmail) => {
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    if (userEmail) {
      fetchTasks(userEmail);
      fetchAssignees(userEmail, "accountant");
    }
  }, [userEmail]);

  const fetchTasks = async (assignee) => {
    try {
      const response = await axios.get(
        `https://dashboard-express-server.vercel.app/checklist/tasks/${assignee}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchAssignees = async (email, platform) => {
    try {
      const response = await axios.get(
        `https://dashboard-express-server.vercel.app/checklist/assignees/${email}/${platform}`
      );
      setAssignees(response.data);
    } catch (error) {
      console.error("Error fetching assignees:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `https://dashboard-express-server.vercel.app/checklist/tasks/${taskId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
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
        `https://dashboard-express-server.vercel.app/checklist/tasks/${taskId}/comments`
      );
      setComments((prevComments) => ({
        ...prevComments,
        [taskId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (taskId, content) => {
    try {
      const response = await axios.post(
        `https://dashboard-express-server.vercel.app/checklist/tasks/${taskId}/comments`,
        { userEmail, content },
        { headers: { "Content-Type": "application/json" } }
      );
      setComments((prevComments) => ({
        ...prevComments,
        [taskId]: [...(prevComments[taskId] || []), response.data],
      }));
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      return false;
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await axios.put(
        `https://dashboard-express-server.vercel.app/checklist/comments/${commentId}`,
        { content: newContent, userEmail }
      );
      setComments((prevComments) => ({
        ...prevComments,
        [response.data.task_id]: prevComments[response.data.task_id].map(
          (comment) => (comment.id === commentId ? response.data : comment)
        ),
      }));
      return true;
    } catch (error) {
      console.error("Error editing comment:", error);
      return false;
    }
  };

  const handleDeleteComment = async (commentId, taskId) => {
    try {
      await axios.delete(
        `https://dashboard-express-server.vercel.app/checklist/comments/${commentId}/${userEmail}`
      );
      setComments((prevComments) => ({
        ...prevComments,
        [taskId]: prevComments[taskId].filter(
          (comment) => comment.id !== commentId
        ),
      }));
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return false;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(
        `https://dashboard-express-server.vercel.app/checklist/tasks/${taskId}/${userEmail}`
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  };

  return {
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
  };
};
