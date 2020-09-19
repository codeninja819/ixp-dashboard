/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Button from "../Button";
import Hamburger from "./Hamburger";

function TopBar({ setNotification, curpage, setCurPage }) {
  const [, setDropDownOpen] = useState(false);

  const dialog = useRef();
  const md = useMediaQuery("(max-width : 1200px");
  const sm = useMediaQuery("(max-width : 920px)");
  const xs = useMediaQuery("(max-width : 650px)");

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dialog && dialog.current && !dialog.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    });
  }, []);

  return (
    <StyledContainer>
      <Box
        display={"flex"}
        minWidth={xs ? "180px" : "290px"}
        minHeight={xs ? "56px" : "90px"}
        maxWidth={xs ? "180px" : "290px"}
        maxHeight={xs ? "56px" : "90px"}
      >
        <img src={"/logotext.png"} width={"100%"} height={"100%"} alt={""} />
        {md ? <Hamburger curpage={curpage} setCurPage={setCurPage} /> : ""}
      </Box>
      <Box display={sm ? "none" : "flex"}>
        {/* <Button type={"buy"} width={"173px"} height={"50px"}>
          BUY IMPACTXP
        </Button>
        <Box mr={"40px"} /> */}
        <ConnectMenu setNotification={setNotification}/>
      </Box>
    </StyledContainer>
  );
}

const StyledContainer = styled(Box)`
  padding: 58px 123px 144px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1200px) {
    padding-bottom: 90px;
    padding-left: 40px;
  }
  @media screen and (max-width: 650px) {
    padding: 53px 0px 47px 20px;
  }
`;

export default TopBar;
