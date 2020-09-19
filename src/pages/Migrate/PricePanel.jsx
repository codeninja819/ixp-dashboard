/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, useMediaQuery } from "@mui/material";
import CountUp from "react-countup";

const PricePanel = ({ version, zcount, price }) => {
  const [_price, _setPrice] = useState({
    prevalue: 0,
    value: 0,
  });
  useEffect(() => {
    let temp = {
      prevalue: 0,
      value: 0,
    };
    temp.prevalue = _price.value;
    temp.value = price;
    _setPrice(temp);
    console.log(price);
  }, [price]);

  const xs = useMediaQuery("(max-width : 650px)");
  return (
    <Box width={"100%"} position={"relative"}>
      <Title>CURRENT PRICE</Title>
      <Panel>
        <Box fontSize={xs ? "13px" : "20px"}>
          IMPACTXP {version === 3 ? "V3" : "V4"} PRICE
        </Box>
        <Box
          mt={xs ? "7px" : "16px"}
          fontSize={xs ? "20px" : "32px"}
          fontFamily={"ChakraPetchSemiBold"}
        >
          $0.
          <span
            style={{
              fontSize: xs ? "14px" : "16px",
              display: zcount ? "unset" : "none",
            }}
          >
            {zcount}
          </span>
          <CountUp
            start={_price.prevalue}
            end={_price.value}
            formattingFn={(value) => {
              return value;
            }}
          />
        </Box>
        <Vector>
          <Box color={"#707070"} mr={"11px"}>
            ETH
          </Box>
          <Box
            display={"flex"}
            minWidth={xs ? "13px" : "22px"}
            minHeight={xs ? "22px" : "37px"}
            maxWidth={xs ? "13px" : "22px"}
            maxHeight={xs ? "22px" : "37px"}
          >
            <img
              src={"/icons/eth.png"}
              width={"100%"}
              height={"100%"}
              alt={""}
            />
          </Box>
        </Vector>
        <Version>{version === 3 ? "V3" : "V4"}</Version>
      </Panel>
    </Box>
  );
};

const Vector = styled(Box)`
  position: absolute;
  display: flex;
  top: 20px;
  right: 20px;
  align-items: center;
`;

const Version = styled(Box)`
  color: #1d1d1d;
  position: absolute;
  font-size: 86px;
  right: 13px;
  bottom: -6px;
  @media screen and (max-width: 650px) {
    font-size: 49px;
  }
`;

const Title = styled(Box)`
  background: #c31b1f;
  font-family: "ChakraPetchSemiBold";
  font-size: 18px;
  max-width: 245px;
  padding: 16px 74px 16px 30px;
  clip-path: polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%);
  @media screen and (max-width: 650px) {
    max-width: 140px;
    font-size: 12px;
    padding: 8px 30px 8px 17px;
  }
`;

const Panel = styled(Box)`
  background: #0f0f0f;
  box-shadow: 0px 3px 6px black;
  padding: 47px 0px 47px 30px;
  width: 100%;
  box-shadow: 0px 3px 6px black;
  z-index: 5;
  position: relative;
  @media screen and (max-width: 650px) {
    padding: 25px 0 27px 17px;
  }
`;
export default PricePanel;
