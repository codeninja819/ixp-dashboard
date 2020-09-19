/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import { shortenHex } from "../../utils/helper";
import Button from "../Button";

function ConnectMenu({ setNotification }) {
  const { connect, disconnect, connected, web3 } = useWeb3Context();
  const address = useAddress();
  const [isConnected, setConnected] = useState(connected);

  const sm = useMediaQuery("(max-width : 880px)");

  let ellipsis = address ? (sm ? "CONNECTED" : shortenHex(address)) : "CONNECT";

  let buttonText = ellipsis;

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  if (isConnected) {
    buttonText = ellipsis;
  }

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <Button
      type={"connect"}
      width={"165px"}
      height={"50px"}
      active={isConnected.toString()}
      onClick={() => (isConnected ? disconnect() : onConnect())}
    >
      <Box>{buttonText}</Box>
    </Button>
  );
}

export default ConnectMenu;
