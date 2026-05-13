import { Button, Stack } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type Props = {
  onPick: () => void;
  onSolved: () => void;
  onReset: () => void;
  solvedDisabled: boolean;
};

export default function ActionButtons({ onPick, onSolved, onReset, solvedDisabled }: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <Button fullWidth variant="contained" color="primary" onClick={onPick} startIcon={<CasinoIcon />}>
        Pick
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        onClick={onSolved}
        disabled={solvedDisabled}
        startIcon={<CheckCircleIcon />}
      >
        Solved
      </Button>
      <Button fullWidth variant="contained" color="error" onClick={onReset} startIcon={<RestartAltIcon />}>
        Reset
      </Button>
    </Stack>
  );
}
