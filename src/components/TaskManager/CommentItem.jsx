// Create a new file CommentItem.js
import React from "react";
import { Box, IconButton, TextField, Button } from "@mui/material";
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
        mt: 1,
        pl: 1,
        borderLeft: "4px solid #ccc",
        py: 1, // Add some vertical padding
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <p className="text-xs font-medium text-gray-600">
          {comment.user_email}
        </p>
        {comment.user_email === userEmail && (
          <Box>
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
              onClick={(e) => {
                e.stopPropagation();
                onDeleteComment(comment.id, taskId);
              }}
              size="small"
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
          />
          <Button
            type="submit"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // setEditingComment(null);
            }}
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
        <p className="text-sm font-medium text-navy-700 mt-1">
          {comment.content}
        </p>
      )}
    </Box>
  );
};

export default CommentItem;
