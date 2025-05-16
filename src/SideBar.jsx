import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import CachedIcon from "@mui/icons-material/Cached";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CheckIcon from "@mui/icons-material/Check";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import AsRecon from "./components/AsReconTool/AsRecon";
import GstTool from "./components/GstTool/GstTool";
import BankStatement from "./components/BankStatementTool/BankStatement";
import BulkReplacer from "./components/BulkReplacerTool/BulkReplacer";
import Prediction from "./components/PredictionTooljsx/Prediction";
import AccountingRecipe from "./components/AccountingRecipe/AccountingRecipe";
import SessionHistory from "./components/AccountingRecipe/SessionHistory";
import RecipeDashboard from "./components/AccountingRecipe/RecipeDashboard";
// import TaskManager from "./components/TaskManager/TaskManager";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TaskManager from "./components/TaskManager/TaskManager2";
import DataSourceMapping from "./components/DataSourceMapping/DataSourceMapping";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FinkeepLogo from "./assets/FinkeepLogo.png";
const drawerWidth = 240;
// Icons import
import PdfIcon from "./assets/PdfIcon.png";
import CheckList from "./assets/CheckList.png";
import ToDoList from "./assets/ToDoList.png";
import Replace from "./assets/Replace.png";
import exchange from "./assets/exchange.png";
import AccountingRecipeIcon from "./assets/AccountingRecipeIcon.png";
import GstIcon from "./assets/GstIcon.png";
import AsIcon from "./assets/AsIcon.png";
import PredictionIcon from "./assets/PredictionIcon.png";
import GoogleDocIcon from "./assets/GoogleDocIcon.png";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar({ onLogout }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [menuData, setMenuData] = useState("AsRecon");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
        position="fixed"
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Box sx={{ marginTop: 1 }}>
          <img src={FinkeepLogo} alt="Logo" />
        </Box>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem onClick={onLogout}>Sign Out</MenuItem>
        </Menu>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* ------------------------- AsRecon-------------------------------- */}

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("AsRecon")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AsIcon}
                  alt="AsIcon"
                  style={{ width: 24, height: 24 }}
                />
                {/* <ArticleIcon /> */}
              </ListItemIcon>
              <ListItemText primary="AsRecon" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* ------------------------- GstTool-------------------------------- */}

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("GstTool")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <img
                  src={GstIcon}
                  alt="GstIcon"
                  style={{ width: 24, height: 24 }}
                />
                {/* <ContactPageIcon /> */}
              </ListItemIcon>
              <ListItemText primary="GstTool" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* ------------------------- Bank Statement-------------------------------- */}

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("BankStatement")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {/* <ReceiptIcon /> */}
                <img
                  src={PdfIcon}
                  alt="PDF Icon"
                  style={{ width: 24, height: 24 }}
                />
              </ListItemIcon>
              <ListItemText
                primary="BankStatement"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          {/* ------------------------- Bulk Replacer-------------------------------- */}

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("BulkReplacer")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {/* <CachedIcon /> */}
                <img
                  src={exchange}
                  alt="Exchange Icon"
                  style={{ width: 24, height: 24 }}
                />
              </ListItemIcon>
              <ListItemText
                primary="BulkReplacer"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          {/* --------------------Prediction Tool---------------------- */}

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("PredictionTool")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <img
                  src={PredictionIcon}
                  alt="PredictionIcon"
                  style={{ width: 24, height: 24 }}
                />
                {/* <FactCheckIcon /> */}
              </ListItemIcon>
              <ListItemText
                primary="PredictionTool"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          {/* --------------------Task Manager---------------------- */}

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("TaskManager")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <img
                  src={ToDoList}
                  alt="ToDoList"
                  style={{ width: 24, height: 24 }}
                />
                {/* <ChecklistIcon /> */}
              </ListItemIcon>
              <ListItemText
                primary="TaskManager"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          {/* --------------------Accounting Recipes---------------------- */}

          {/* <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("AccountingRecipe")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText
                primary="AccountingRecipe"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem> */}

          {/* --------------------Session History---------------------- */}
          {/* <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("SessionHistory")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText
                primary="SessionHistory"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem> */}

          {/* --------------------Recipe Dashboard---------------------- */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("RecipeDashboard")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <img
                  src={AccountingRecipeIcon}
                  alt="AccountingRecipe"
                  style={{ width: 24, height: 24 }}
                />
                {/* <EditNoteIcon /> */}
              </ListItemIcon>
              <ListItemText
                primary="RecipeDashboard"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => setMenuData("DataSourceMapping")}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <img
                  src={GoogleDocIcon}
                  alt="DataSourceMapping"
                  style={{ width: 24, height: 24 }}
                />
                {/* <EditNoteIcon /> */}
              </ListItemIcon>
              <ListItemText
                primary="DataSourceMapping"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
        }}
      >
        <Toolbar />
        {/* <DrawerHeader /> */}
        {menuData == "AsRecon" && <AsRecon />}
        {menuData == "GstTool" && <GstTool />}
        {menuData == "BankStatement" && <BankStatement />}
        {menuData == "BulkReplacer" && <BulkReplacer />}
        {menuData == "PredictionTool" && <Prediction />}
        {menuData == "TaskManager" && <TaskManager />}
        {/* {menuData == "AccountingRecipe" && <AccountingRecipe />} */}
        {/* {menuData == "SessionHistory" && <SessionHistory />} */}
        {menuData == "RecipeDashboard" && <RecipeDashboard />}
        {menuData == "DataSourceMapping" && <DataSourceMapping />}
      </Box>
    </Box>
  );
}
