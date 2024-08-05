import { useRef, useState } from "react";
import { Check, Close, ContentCopy, Save } from "@mui/icons-material";
import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  PaperProps,
  Skeleton,
} from "@mui/material";
import Draggable from "react-draggable";

export type SaveDialogProps = {
  selectedZoneIDs: string[];
};

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#save-zones-dialog"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export function SaveDialog(props: SaveDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchID, setWatchID] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const textButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    setWatchID("");
    setLoading(true);
    setOpen(true);
    setCopied(false);

    const params = new URLSearchParams({
      zones: props.selectedZoneIDs.join(","),
    });

    fetch(`/api/v1/zones/watchid?${params.toString()}`).then((response) => {
      setLoading(false);
      response.json().then((data) => {
        if (!response.ok) {
          setErrorMessage(data.error ?? "An unexpected error occurred");
          return;
        }

        setWatchID(`🌩️👀 ${data.id}`);
      });
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(textButtonRef.current!.innerText);
    setCopied(true);
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        startIcon={<Save />}
        disabled={props.selectedZoneIDs.length === 0}
      >
        Save
      </Button>
      <Dialog
        onClose={handleClose}
        open={open}
        aria-labelledby="save-zones-dialog"
        PaperComponent={PaperComponent}
      >
        <DialogTitle style={{ cursor: "move" }} id="save-zones-dialog">
          Save to Your Profile
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="rounded"
              height={"90%"}
              width={"90%"}
            />
          ) : errorMessage ? (
            <DialogContentText>
              <Alert severity="error">{errorMessage}</Alert>
            </DialogContentText>
          ) : (
            <></>
          )}
          <DialogContentText>
            To use the Watchedsky Bluesky Feed, click the button below to copy
            the text, and paste it somewhere in your Bluesky profile.
          </DialogContentText>
          <Container sx={{paddingTop: 4}}>
            <ButtonGroup size="large" sx={{ width: "100%" }} ref={anchorRef}>
              <Button
                variant="outlined"
                color="primary"
                onClick={copyCode}
                sx={{ textTransform: "none", width: "90%" }}
                ref={textButtonRef}
              >
                {watchID}
              </Button>
              <Button
                variant="contained"
                color={copied ? "success" : "primary"}
                onClick={copyCode}
              >
                {copied ? <Check /> : <ContentCopy />}
              </Button>
            </ButtonGroup>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}
