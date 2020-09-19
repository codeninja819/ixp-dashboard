/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./menu.css";
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import Footer from "../Footer";

const Hamburger = ({ curpage, setCurPage }) => {
  const menuRef = useRef(null);
  const xs = useMediaQuery("(max-width : 650px)");
  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        let form = document.getElementById("check");
        if (form) form.checked = false;
      }
    });
  }, []);

  return (
    <nav role="navigation">
      <div id="menuToggle" ref={menuRef}>
        {/* A fake / hidden checkbox is used as click reciever,
    so you can use the :checked selector on it. */}

        <input type="checkbox" id="check" />

        {/* Some spans to act as a hamburger.
    
    They are acting like a real hamburger,
    not that McDonalds stuff. */}

        <span></span>
        <span style={{ width: "20px", marginLeft: "7px" }}></span>
        <span style={{ background: "#C31B1F" }}></span>

        {/* Too bad the menu has to be inside of the button
    but hey, it's pure CSS magic. */}

        <Menu id="menu">
          <Vector />
          <StyledContainer>
            <Box
              display={"flex"}
              minWidth={xs ? "180px" : "290px"}
              minHeight={xs ? "56px" : "90px"}
              maxWidth={xs ? "180px" : "290px"}
              maxHeight={xs ? "56px" : "90px"}
            >
              <img
                src={"/logotext.png"}
                width={"100%"}
                height={"100%"}
                alt={""}
              />
            </Box>
          </StyledContainer>
          <Menus active={curpage}>
            <Link
              to={"/home"}
              onClick={() => {
                setCurPage(1);
                let form = document.getElementById("check");
                if (form) form.checked = false;
              }}
            >
              <Box>OVERVIEW</Box>
            </Link>
            <Link
              to={"/staking"}
              onClick={() => {
                setCurPage(2);
                let form = document.getElementById("check");
                if (form) form.checked = false;
              }}
            >
              <Box>STAKING</Box>
            </Link>
            <Link
              to={"/farming"}
              onClick={() => {
                setCurPage(3);
                let form = document.getElementById("check");
                if (form) form.checked = false;
              }}
            >
              <Box>FARMING</Box>
            </Link>
            <Link
              to={"/migrate"}
              onClick={() => {
                setCurPage(4);
                let form = document.getElementById("check");
                if (form) form.checked = false;
              }}
            >
              <Box>MIGRATE</Box>
            </Link>
          </Menus>
          <Box position={"absolute"} bottom={0}>
            <Footer />
          </Box>
        </Menu>
      </div>
    </nav>
  );
};

const Menus = styled(Box)`
  display: flex;
  flex-direction: column;
  > a {
    font-family: "ChakraPetchBold";
    font-size: 18px;
    margin-bottom: 25px;
    padding: 14px 160px 14px 80px;
    cursor: pointer;
    color: white;
    transform: skew(-20deg);
    margin-left: -12px;
    transition: all 0.3s;
    :hover {
      background: linear-gradient(
        135deg,
        rgba(162, 162, 162, 0.3),
        rgba(95, 95, 95, 0.3)
      );
      box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.16);
    }
    width: fit-content;
    @media screen and (max-width: 650px) {
      font-size: 15px;
    }
  }
  > a > div {
    transform: skew(20deg);
    width: fit-content;
  }
  > a:nth-child(${({ active }) => active}) {
    background: linear-gradient(
      135deg,
      rgba(162, 162, 162, 0.5),
      rgba(95, 95, 95, 0.5)
    );
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.16);
    font-family: "ChakraPetchBoldItalic";
  }
`;

const StyledContainer = styled(Box)`
  padding: 58px 123px 95px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1200px) {
    padding-left: 40px;
  }
  @media screen and (min-width: 650px) {
    @media screen and (max-height: 800px) {
      padding-bottom: 40px;
    }
  }
  @media screen and (max-width: 650px) {
    padding: 53px 0px 95px 20px;
    @media screen and (max-height: 700px) {
      padding-bottom: 40px;
    }
  }
`;

const Menu = styled.ul`
  font-family: "ChakraPetchSemiBold";
  position: relative;
  overflow: hidden;
`;

const Vector = styled(Box)`
  position: absolute;
  background-image: url("/images/hamvector.png");
  background-size: 100% 100%;
  width: 450px;
  height: 490px;
  mix-blend-mode: color-burn;
  right: -225px;
  top: 50%;
  transform: translateY(-50%);
`;
export default Hamburger;
