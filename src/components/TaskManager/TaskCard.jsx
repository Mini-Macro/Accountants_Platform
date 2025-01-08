import React from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Fade,
  Typography,
  Divider,
} from "@mui/material";
import { MdEdit, MdDelete, MdSend } from "react-icons/md";
import PersonIcon from "@mui/icons-material/Person";
import { StyledCard, StatusChip } from "./StyledComponent";
import CommentItem from "./CommentItem";

export const TaskCard = ({
  task,
  expanded,
  onExpand,
  onStatusChange,
  onEdit,
  onDelete,
  comments,
  newComment,
  setNewComment,
  onAddComment,
  onEditComment,
  onDeleteComment,
  editingComment,
  setEditingComment,
  userEmail,
}) => {
  // const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newComment.trim()) return;

    const success = await onAddComment(task.id, newComment);
    if (success) {
      setNewComment(""); // Clear input on successful submission
    }
  };

  return (
    <StyledCard
      onClick={() => onExpand(task.id)}
      sx={{
        minHeight: "150px",
        transition: "all 0.3 ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h4
          style={{
            color: "#424242", // Shade of gray (you can choose a different one)
            fontWeight: "bold",
            marginBottom: "8px",
            fontSize: "1.25rem",
          }}
        >
          {task.title}
        </h4>
        <Box>
          <StatusChip
            label={task.status}
            status={task.status}
            size="small"
            sx={{ mx: 1, fontWeight: "medium" }}
          />
          {task.createdBy === userEmail && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                size="small"
                color="primary"
              >
                <MdEdit />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                size="small"
                color="error"
              >
                <MdDelete />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" mb={2}>
        {task.description}
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <PersonIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2" fontWeight="medium">
            {task.assignee}
          </Typography>
        </Box>
        <Select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          variant="outlined"
          size="small"
          onClick={(e) => e.stopPropagation()}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </Box>

      {expanded && (
        <Fade in={expanded}>
          <Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Comments
              </Typography>
              <Box
                component="form"
                onSubmit={handleCommentSubmit}
                sx={{ display: "flex", mb: 2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <TextField
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  label="Add a comment..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: { fontSize: "0.875rem" },
                  }}
                />
                <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
                  <MdSend />
                </IconButton>
              </Box>

              <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {comments[task.id]?.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    userEmail={userEmail}
                    editingComment={editingComment}
                    setEditingComment={setEditingComment}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    taskId={task.id}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
    </StyledCard>
  );
};
