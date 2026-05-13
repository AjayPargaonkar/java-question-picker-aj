import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SHORTCUTS: Array<{ keys: string[]; label: string }> = [
  { keys: ["Space"], label: "Pick a random question" },
  { keys: ["Enter"], label: "Mark current question as solved" },
  { keys: ["Ctrl", "Enter"], label: "Run code (from inside editor)" },
  { keys: ["?"], label: "Toggle this help" },
  { keys: ["Esc"], label: "Close this dialog" },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        display: "inline-block",
        padding: "2px 8px",
        border: "1px solid rgba(127,127,127,0.4)",
        borderRadius: 5,
        background: "rgba(127,127,127,0.12)",
        fontFamily: "monospace",
        fontSize: "0.78rem",
        minWidth: 22,
        textAlign: "center",
      }}
    >
      {children}
    </kbd>
  );
}

export default function ShortcutsDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Keyboard Shortcuts
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List dense>
          {SHORTCUTS.map((s) => (
            <ListItem key={s.label} disableGutters>
              <Stack direction="row" spacing={0.5} sx={{ minWidth: 120 }}>
                {s.keys.map((k, i) => (
                  <Kbd key={i}>{k}</Kbd>
                ))}
              </Stack>
              <ListItemText primary={s.label} sx={{ ml: 2 }} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
