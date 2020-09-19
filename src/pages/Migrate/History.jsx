/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { Box, useMediaQuery } from "@mui/material";
import useMigrationInfo from "../../hooks/useMigrationInfo";
import { shortenHex } from "../../utils/helper";

const History = () => {
  const xs = useMediaQuery("(max-width : 650px)");
  const { histories, decimals } = useMigrationInfo();

  return (
    <Box width={"100%"} position={"relative"}>
      <Title>MIGRATION HISTORY</Title>
      <Panel>
        <Box display={"flex"} justifyContent={"space-between"} fontSize={xs ? "10px" : "16px"}>
          <Box textAlign={"center"} width={"30%"}>
            Date
          </Box>
          <Box textAlign={"center"} width={"20%"}>
            Type
          </Box>
          <Box textAlign={"center"} width={"20%"}>
            Amount
          </Box>
          <Box textAlign={"center"} width={"30%"}>
            Transaction
          </Box>
        </Box>
        <Box mt={"15px"} display={"flex"} flexDirection={"column"}>
          {histories.length ? (
            histories.map((data) => {
              return (
                <Item key={data.hash}>
                  <Box width={"30%"}>
                    {new Date(parseInt(data.timeStamp, 10) * 1000).toLocaleTimeString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Box>
                  <Box width={"20%"}>{data.name}</Box>
                  <Box width={"20%"} textAlign="right">
                    {
                      +Number(
                        ethers.utils.formatUnits(data.amount, data.name === "Claim" ? 18 : decimals)
                      ).toFixed(6)
                    }
                    {data.name === "Claim" ? ` IXP` : ` IMPACTXP`}
                  </Box>
                  <Box textAlign={"center"} width={"30%"}>
                    <a
                      href={`https://etherscan.io/tx/${data.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {shortenHex(data.hash, 8)}
                    </a>
                  </Box>
                </Item>
              );
            })
          ) : (
            <Box
              textAlign={"center"}
              fontSize={xs ? "16px" : "24px"}
              mt={xs ? "8px" : "30px"}
              mb={xs ? "5px" : "20px"}
            >
              No Histories Yet.
            </Box>
          )}
        </Box>
      </Panel>
    </Box>
  );
};

const Item = styled(Box)`
  margin: 5px 0;
  background: #0f0f0f;
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  > div {
    text-align: center;
  }
  box-shadow: 0px 3px 6px #0f0f0f;
`;

const Title = styled(Box)`
  background: #c31b1f;
  font-family: "ChakraPetchSemiBold";
  font-size: 18px;
  max-width: 282px;
  padding: 16px 74px 16px 30px;
  clip-path: polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%);
  @media screen and (max-width: 650px) {
    max-width: 162px;
    font-size: 12px;
    padding: 8px 30px 8px 17px;
  }
`;

const Panel = styled(Box)`
  background: linear-gradient(to bottom, #333333, #1d1d1d);
  padding: 20px 30px 25px 30px;
  font-family: "ChakraPetchSemiBold";
  height: fit-content;
  @media screen and (max-width: 650px) {
    padding: 11px 17px 18px 16px;
  }
`;
export default History;
