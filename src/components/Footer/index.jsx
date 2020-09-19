/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import styled from "styled-components";
import { Box, useMediaQuery } from "@mui/material";
import Button from "../Button";

const Footer = () => {
  const socials = [
    {
      url: "/icons/facebook.png",
      link: "https://www.facebook.com/ImpactXP.Official",
    },
    {
      url: "/icons/twitter.png",
      link: "https://twitter.com/ImpactXPToken",
    },
    {
      url: "/icons/telegram.png",
      link: "t.me/ImpactXPofficial",
    },
    {
      url: "/icons/instagram.png",
      link: "https://instagram.com/officialimpactxp?igshid=YmMyMTA2M2Y=",
    },
    {
      url: "/icons/discord.png",
      link: "https://discord.com/invite/8gbwW9VXbN",
    },
    {
      url: "/icons/youtube.png",
      link: "https://www.youtube.com/channel/UCoE3K5GwXBBs9ppbwXZp7kg",
    },
  ];

  const xs = useMediaQuery("(max-width : 650px)");

  return (
    <StyledContainer>
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          type={"buy"}
          width={xs ? "151px" : "173px"}
          height={xs ? "44px" : "50px"}
          fontSize={xs ? "13px" : "16px"}
        >
          BUY IMPACTXP
        </Button>
      </Box>
      <Social>
        <Box>
          {socials.map((data, index) => {
            return (
              <SocialItem key={index}>
                <img src={data.url} />
              </SocialItem>
            );
          })}
        </Box>
      </Social>
    </StyledContainer>
  );
};

const SocialItem = styled.a`
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s;
  :hover {
    transform: scale(1.1, 1.1);
    opacity: 1;
  }
  margin-right: 55px;
  @media screen and (max-width: 650px) {
    transform: scale(0.9, 0.9);
    margin-right: 28px;
  }
  @media screen and (max-width: 350px) {
    transform: scale(0.8, 0.8);
    margin-right: 20px;
  } ;
`;
const Social = styled(Box)`
  margin-top: 55px;
  margin-left: -24px;
  margin-bottom: 50px;
  filter: drop-shadow(5px 0px 20px rgba(0, 0, 0, 0.45));
  > div {
    padding-left: 70px;
    background: #c31b1f;
    width: 600px;
    height: 80px;
    clip-path: polygon(0% 0%, 93% 0%, 100% 100%, 0% 100%);
    display: flex;
    align-items: center;
    @media screen and (max-width: 650px) {
      width: 412px;
      height: 60px;
      padding-left: 50px;
    }
    @media screen and (max-width: 350px) {
      width: 340px;
    }
  }
  @media screen and (max-width: 650px) {
    margin-top: 30px;
  }
`;

const StyledContainer = styled(Box)`
  @media screen and (min-width: 1200px) {
    display: none;
  }
  overflow: hidden;
`;

export default Footer;
