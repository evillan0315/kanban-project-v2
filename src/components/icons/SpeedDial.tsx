import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
//import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import IconComponent from "./IconComponent";

import { styled } from "@mui/material/styles";
//import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AppsRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(1),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    left: theme.spacing(2),
  },
}));

export default function PlaygroundSpeedDial() {
  const { enqueueSnackbar } = useSnackbar();
  const [hidden] = React.useState(false);
  //const router = useRouter()
  //   const [direction, setDirection] =
  //     React.useState<SpeedDialProps["direction"]>("left");
  //   const [hidden, setHidden] = React.useState(false);

  //   const handleDirectionChange = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     setDirection(
  //       (event.target as HTMLInputElement).value as SpeedDialProps["direction"]
  //     );
  //   };

  //   const handleHiddenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setHidden(event.target.checked);
  //   };
  const fetchModel = async () => {
    try {
      const response = await fetch(`/api/getSwingers`);
      const data = await response.json();
      enqueueSnackbar(data.message, { variant: "success" });
      console.log(data);
    } catch (error) {
      enqueueSnackbar("Error fetching data:", { variant: "success" });
      console.error("Error fetching data:", error);
    }
  };
  const actions = [
    {
      icon: <IconComponent iconName="api" size={26} />,
      name: "Fetch Data",
      onclick: () => fetchModel(),
    },
    /* { icon: <IconComponent iconName="file" size={26} />, name: "File", onclick:router.push('/file') },
    { icon: <IconComponent iconName="color" size={26} />, name: "Color", onclick:router.push('/color') },
    { icon: <IconComponent iconName="terminal" size={26} />, name: "Terminal", onclick:router.push('/terminal') },
    { icon: <IconComponent iconName="database" size={26} />, name: "Schema Editor", onclick:router.push('/schema-editor') }, */
  ];
  return (
    <Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
      <Box
        sx={{
          width: 100,
          bottom: 2,
          right: 10,
          zIndex: 20,
        }}
      >
        <StyledSpeedDial
          ariaLabel="SpeedDial"
          hidden={hidden}
          icon={<AppsRounded />}
          direction={"left"}
        >
          {actions.map((action) => (
            <SpeedDialAction
              onClick={action.onclick}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </StyledSpeedDial>
      </Box>
    </Box>
  );
}
