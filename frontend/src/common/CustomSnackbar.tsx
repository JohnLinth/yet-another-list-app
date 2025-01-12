import React, { useState, useEffect } from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomSnackbarProps {
  message?: string;
  bgColor?: string;
  duration?: number;
  onClose?: () => void;
}

// custom snackbar component with customizable message, background color, and duration
const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  message = "I love snacks",
  bgColor = "#1976d2",
  duration = 3000,
  onClose,
}) => {
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    // automatically close the snackbar after the given duration
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      onClose={handleClose}
    >
      <SnackbarContent
        style={{
          backgroundColor: bgColor,
          fontSize: "1rem",
          minWidth: "300px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default CustomSnackbar;
