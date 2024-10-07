import React, { useState } from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Fade,
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
    <StyledCard onClick={() => onExpand(task.id)}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h6 className="font-medium text-gray-600">{task.title}</h6>
        <Box>
          <StatusChip
            label={task.status}
            status={task.status}
            size="small"
            sx={{ mx: 1 }}
          />
          {task.createdBy === userEmail && (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                size="small"
              >
                <MdEdit />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                size="small"
              >
                <MdDelete />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {expanded && (
        <Fade in={expanded}>
          <Box mt={2}>
            <p className="text-xs font-medium text-gray-600">
              {task.description}
            </p>
            <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
              <PersonIcon color="action" sx={{ mr: 1 }} />
              <p className="text-xs font-medium text-gray-600">
                {task.assignee}
              </p>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-navy-700 dark:text-white"
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </Box>
            <Box sx={{ mt: 2 }}>
              <h6 className="font-medium text-navy-700 dark:text-white">
                Comments
              </h6>
              <Box
                component="form"
                onSubmit={handleCommentSubmit}
                sx={{ display: "flex", mt: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <TextField
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    className: "text-xs font-medium text-gray-600",
                  }}
                  InputProps={{
                    className:
                      "text-sm font-medium text-navy-700 dark:text-white",
                  }}
                />
                <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
                  <MdSend />
                </IconButton>
              </Box>

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
        </Fade>
      )}
    </StyledCard>
  );
};
