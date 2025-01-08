// Create a new file CommentItem.js
import React from "react";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import { MdEdit, MdDelete } from "react-icons/md";

const CommentItem = ({
  comment,
  userEmail,
  editingComment,
  setEditingComment,
  onEditComment,
  onDeleteComment,
  taskId,
}) => {
  return (
    <Box
      sx={{
        mt: 2,
        py: 1,
        borderRadius: "4px",
        backgroundColor: "background.default",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box display="flex" alignItems="flex-start">
        <Avatar
          sx={{
            width: 24,
            height: 24,
            mr: 1,
            fontSize: "0.75rem",
            bgcolor: "primary.main",
          }}
        >
          {comment.user_email.charAt(0).toUpperCase()}
        </Avatar>
        <Box flexGrow={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
          >
            <Typography variant="body2" fontWeight="bold" color="text.primary">
              {comment.user_email}
            </Typography>
            {comment.user_email === userEmail && (
              <Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingComment(comment.id);
                  }}
                  size="small"
                  color="primary"
                >
                  <MdEdit />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteComment(comment.id, taskId);
                  }}
                  size="small"
                  color="error"
                >
                  <MdDelete />
                </IconButton>
              </Box>
            )}
          </Box>

          {editingComment === comment.id ? (
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                onEditComment(comment.id, e.target.content.value);
                setEditingComment(null);
              }}
            >
              <TextField
                name="content"
                defaultValue={comment.content}
                fullWidth
                size="small"
                autoFocus
                onClick={(e) => e.stopPropagation()}
                sx={{ mb: 1 }}
              />
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
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
                variant="outlined"
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="text.primary">
              {comment.content}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommentItem;
