import { styled } from "@mui/material/styles";
import { Card, Chip } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  height: "auto",
  cursor: "pointer",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

export const StatusChip = styled(Chip)(({ theme, status }) => ({
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
