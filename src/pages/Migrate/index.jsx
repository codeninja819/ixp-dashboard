/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import MigrateBox from "./MigrateBox";
import PricePanel from "./PricePanel";
import History from "./History";
import useTokenInfo from "../../hooks/useTokenInfo";
import { priceFormat } from "../../utils/functions";

const Migrate = ({ setNotification }) => {
  const { price } = useTokenInfo();
  const md = useMediaQuery("(max-width : 950px)");
  const xs = useMediaQuery("(max-width : 650px)");

  const makeHelp = () => {
    return (
      <>
        <Box fontFamily={"ChakraPetchSemiBold"} fontSize={xs ? "18px" : "30px"} color={"#C31B1F"}>
          NEED MORE HELP?
        </Box>
        <Box
          fontFamily={"ChakraPetch"}
          fontSize={xs ? "12px" : "20px"}
          lineHeight={"130%"}
          mt={xs ? "11px" : "26px"}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. <br /> <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Box>
      </>
    );
  };

  const makeArrowDown = () => {
    return (
      <Box
        my={xs ? "18px" : "30px"}
        maxHeight={xs ? "16px" : "26px"}
        maxWidth={xs ? "22px" : "36px"}
        mx={"auto"}
      >
        <img src={"/icons/arrowdown.png"} width={"100%"} height={"100%"} alt={""} />
      </Box>
    );
  };
  return (
    <StyledContainer>
      <Box
        display={"flex"}
        width={"100%"}
        justifyContent={"space-between"}
        maxWidth={md ? "100%" : "1425px"}
        flexDirection={md ? "column" : "row"}
      >
        <Box width={"100%"} maxWidth={md ? "100%" : "647px"} mr={md ? "0" : "60px"}>
          <Box fontFamily={"ChakraPetchSemiBold"} fontSize={xs ? "18px" : "30px"}>
            MIGRATE YOUR TOKENS
          </Box>
          <Box width={"100%"} mt={xs ? "22px" : "36px"}>
            <MigrateBox type={"from"} setNotification={setNotification} />
            {makeArrowDown()}
            <MigrateBox type={"to"} setNotification={setNotification} />
          </Box>
        </Box>
        <Box
          width={"100%"}
          maxWidth={md ? "unset" : "647px"}
          mt={md ? (xs ? "60px" : "100px") : "0"}
        >
          <Box fontFamily={"ChakraPetchSemiBold"} fontSize={xs ? "18px" : "30px"}>
            IMPACT XP VALUE
          </Box>
          <Box mt={xs ? "20px" : "36px"}>
            <PricePanel
              price={priceFormat(price).value}
              zcount={priceFormat(price).count}
              version={3}
            />
            {makeArrowDown()}
            <PricePanel price={"00"} zcount={0} version={4} />
          </Box>
          <Box mt={"93px"} display={md ? "none" : "block"}>
            {makeHelp()}
          </Box>
        </Box>
      </Box>
      <Box mt={xs ? "60px" : "100px"} width={"100%"} maxWidth={"1425px"}>
        <History />
      </Box>
      <Box mt={"48px"} display={md ? "block" : "none"}>
        {makeHelp()}
      </Box>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  padding: 16px 40px 86px 118px;
  width: 100%;
  @media screen and (max-width: 1300px) {
    padding-left: 40px;
  }
  @media screen and (max-width: 650px) {
    padding: 16px 20px 30px 20px;
  }
`;

export default Migrate;
