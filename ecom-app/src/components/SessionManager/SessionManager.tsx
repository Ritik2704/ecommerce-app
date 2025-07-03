import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SESSION_CHECK_INTERVAL = 1000;
const INACTIVITY_LIMIT = 5000;
const REFRESH_THRESHOLD = 5000;

const SessionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const lastActivityTime = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const throttleRef = useRef<number>(0);

  const resetActivity = useCallback(() => {
    if (showModal) {
      return;
    }

    const now = Date.now();
    if (now - throttleRef.current < 1000) {
      return;
    }

    throttleRef.current = now;
    lastActivityTime.current = now;
  }, [showModal]);

  //To get session expiration time which backend has set from JWT (inside payload)
  const getExpiryFromToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  };

  const handleSessionExpiry = useCallback(() => {
    setShowModal(false);
    localStorage.removeItem("auth_token");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    navigate("/session-expired");
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const oldToken = localStorage.getItem("auth_token");
      const res = await axios.post(
        "http://localhost:8080/api/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${oldToken}`,
          },
        }
      );
      localStorage.setItem("auth_token", res.data.token);
      setShowModal(false);
      lastActivityTime.current = Date.now();
    } catch {
      handleSessionExpiry();
    }
  }, [handleSessionExpiry]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetActivity));
    return () =>
      events.forEach((e) => window.removeEventListener(e, resetActivity));
  }, [resetActivity]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return;
      }

      const exp = getExpiryFromToken(token);
      const now = Date.now();
      const timeLeft = exp ? exp - now : 0;
      const inactive = now - lastActivityTime.current > INACTIVITY_LIMIT;

      const onPublicRoute = ["/login", "/signup", "/session-expired"].some(
        (path) => location.pathname.includes(path)
      );

      if (onPublicRoute) {
        setShowModal(false);
        return;
      }

      if (timeLeft <= 0) {
        handleSessionExpiry();
      } else if (timeLeft < REFRESH_THRESHOLD && inactive) {
        setShowModal(true);
      } else if (timeLeft < REFRESH_THRESHOLD && !inactive) {
        refreshToken();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [location.pathname, refreshToken, handleSessionExpiry]);

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      disableEnforceFocus
      disableAutoFocus
      disableScrollLock
    >
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          width: 400,
          mx: "auto",
          my: "20%",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Session Expiring Soon
        </Typography>
        <Typography variant="body2" gutterBottom>
          You have been inactive. Your session will expire soon.
        </Typography>
        <Button
          variant="contained"
          onClick={refreshToken}
          sx={{ mt: 2 }}
          color="secondary"
        >
          Continue Session
        </Button>
      </Box>
    </Modal>
  );
};

export default SessionManager;
