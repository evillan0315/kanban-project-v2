import { useLoading } from "@/hooks/useLoading";
import { Backdrop, CircularProgress } from "@mui/material";

export default function GlobalLoader() {
  const { loading } = useLoading();

  return loading ? (
    <Backdrop className="text-info" open={true} sx={{ zIndex: 1301, flexDirection: "column" }}>
      <CircularProgress color="inherit" aria-label="Loading" />
      
    </Backdrop>
  ) : null;
}

