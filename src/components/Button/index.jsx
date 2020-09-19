import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";

const Button = ({
  width,
  height,
  type,
  fontSize = "16px",
  children,
  disabled,
  onClick,
  color = "white",
  style,
}) => {
  return (
    <>
      {type === "buy" ? (
        <BuyButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
        >
          <Box />
          <Box />
          <Box>{children}</Box>
        </BuyButton>
      ) : type === "connect" ? (
        <ConnectButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
        >
          <Box />
          <Box />
          <Box>{children}</Box>
        </ConnectButton>
      ) : type === "primary" ? (
        <PrimaryButton
          width={width}
          height={height}
          type={type}
          fontSize={fontSize}
          disabled={disabled}
          onClick={onClick}
          style={style}
          color={color}
        >
          {children}
        </PrimaryButton>
      ) : (
        ""
      )}
    </>
  );
};

const BaseButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "ChakraPetchSemiBold";
  font-size: ${({ fontSize }) => fontSize};
  font-weight: bold;
  min-width: ${({ width }) => width};
  min-height: ${({ height }) => height};
  max-width: ${({ width }) => width};
  max-height: ${({ height }) => height};
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  transition: all 0.3s;
  :disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BuyButton = styled(BaseButton)`
  color: ${({ color }) => color};
  transform: skewX(-20deg);
  > div:nth-child(1) {
    background: #c31b1f;
    height: 100%;
    width: 16px;
    transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  }
  > div:nth-child(2) {
    border: 2px solid white;
    border-left: none;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  }
  > div:nth-child(3) {
    position: absolute;
    left: calc(50% + 8px);
    top: 50%;
    transform: skewX(20deg) translate(-50%, -50%);
    width: 100%;
  }
  :hover {
    > div:nth-child(1) {
      width: 100%;
    }
    > div:nth-child(2) {
      width: 0;
      border-color: #c31b1f;
      background: #c31b1f;
    }
  }
`;

const ConnectButton = styled(BuyButton)`
  background: black;
  > div:nth-child(2) {
    border-color: #b32f29;
  }
  >div: nth-child(3) {
    font-family: "ChakraPetchBoldItalic";
    left: calc(50% + 8px);
    top: 50%;
    transform: skewX(20deg) translate(-50%, -50%);
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: #c31b1f;
  color: white;
  :hover {
    background: white;
    color: #c31b1f;
  }
`;

export default Button;
