import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Paper,
  Popper,
  Typography,
  useTheme,
} from "@mui/material";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// How long you need to hover over an event before the peek panel shows up.
const PEEK_HOVER_OPEN_DELAY_MS = 700;
// How long the peek panel lingers after the mouse leaves it or its event.
const PEEK_HOVER_CLOSE_DELAY_MS = 300;

export interface OverlappingEventsPeekTriggerProps {
  onContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

export interface OverlappingEventsPeekPanelHoverProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export interface OverlappingEventsPeek {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  triggerProps: OverlappingEventsPeekTriggerProps;
  panelHoverProps: OverlappingEventsPeekPanelHoverProps;
  close: () => void;
}

interface UseOverlappingEventsPeekProps {
  enabled: boolean;
}

// Drives the peek panel of an event: opens it on a right click, or on a long
// enough hover, and closes it on a click away, on Escape, or when the mouse
// wanders off - unless it was opened via a right click, in which case it sticks
// around until it's explicitly dismissed.
export function useOverlappingEventsPeek(
  props: UseOverlappingEventsPeekProps,
): OverlappingEventsPeek {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelOpen = useCallback(() => {
    if (openTimeoutRef.current !== null) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    cancelOpen();
    cancelClose();
    setAnchorEl(null);
    setIsSticky(false);
  }, [cancelOpen, cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null;
      setAnchorEl(null);
      setIsSticky(false);
    }, PEEK_HOVER_CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    return () => {
      cancelOpen();
      cancelClose();
    };
  }, [cancelOpen, cancelClose]);

  useEffect(() => {
    if (!props.enabled) {
      close();
    }
  }, [props.enabled, close]);

  useEffect(() => {
    if (anchorEl === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [anchorEl, close]);

  return {
    isOpen: anchorEl !== null,
    anchorEl: anchorEl,
    close: close,
    triggerProps: {
      onContextMenu: (event) => {
        if (!props.enabled) {
          return;
        }

        event.preventDefault();
        cancelOpen();
        cancelClose();
        setAnchorEl(event.currentTarget);
        setIsSticky(true);
      },
      onMouseEnter: (event) => {
        if (!props.enabled) {
          return;
        }

        cancelClose();
        if (anchorEl !== null) {
          return;
        }

        const target = event.currentTarget;
        cancelOpen();
        openTimeoutRef.current = setTimeout(() => {
          openTimeoutRef.current = null;
          setAnchorEl(target);
        }, PEEK_HOVER_OPEN_DELAY_MS);
      },
      onMouseLeave: () => {
        cancelOpen();
        if (isSticky) {
          return;
        }

        scheduleClose();
      },
    },
    panelHoverProps: {
      onMouseEnter: cancelClose,
      onMouseLeave: () => {
        if (isSticky) {
          return;
        }

        scheduleClose();
      },
    },
  };
}

interface OverlappingEventsPeekPanelProps {
  peek: OverlappingEventsPeek;
  title: string;
  subtitle: string;
}

export function OverlappingEventsPeekPanel(
  props: PropsWithChildren<OverlappingEventsPeekPanelProps>,
) {
  const theme = useTheme();

  if (props.peek.anchorEl === null) {
    return null;
  }

  return (
    <Popper
      open={props.peek.isOpen}
      anchorEl={props.peek.anchorEl}
      placement="right-start"
      sx={{ zIndex: theme.zIndex.tooltip }}
      modifiers={[
        { name: "offset", options: { offset: [0, 8] } },
        { name: "preventOverflow", options: { padding: 8 } },
      ]}
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={props.peek.close}
      >
        <Paper
          elevation={8}
          onMouseEnter={props.peek.panelHoverProps.onMouseEnter}
          onMouseLeave={props.peek.panelHoverProps.onMouseLeave}
          onClick={props.peek.close}
          sx={{
            minWidth: "20rem",
            maxWidth: "28rem",
            maxHeight: "60vh",
            overflowY: "auto",
            padding: "0.5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{props.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {props.subtitle}
              </Typography>
            </Box>

            <IconButton size="small" onClick={props.peek.close}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ marginBottom: "0.25rem" }} />

          {props.children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
