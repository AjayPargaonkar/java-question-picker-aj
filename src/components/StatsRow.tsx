import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";

type Props = {
  total: number;
  solved: number;
};

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Paper sx={{ flex: 1, p: 1.5, textAlign: "center", border: 1, borderColor: "divider" }}>
      <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: 1, opacity: 0.7 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function StatsRow({ total, solved }: Props) {
  const remaining = total - solved;
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1}>
        <StatCard label="Total" value={total} />
        <StatCard label="Solved" value={solved} color="secondary.main" />
        <StatCard label="Remaining" value={remaining} color="warning.main" />
      </Stack>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Typography variant="body2" sx={{ minWidth: 40, textAlign: "right", opacity: 0.7 }}>
          {pct}%
        </Typography>
      </Stack>
    </Stack>
  );
}
