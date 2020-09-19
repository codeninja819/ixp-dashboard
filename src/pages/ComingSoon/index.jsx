import { Box } from "@mui/material";
import styled from "styled-components";

const ComingSoon = () => {
  return <StyledContainer>COMING SOON</StyledContainer>;
};

const StyledContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: calc(100vh - 500px);
  justify-content: center;
  align-items: center;
  font-size: 72px;
  font-family: "ChakraPetchBold";
  @media screen and (max-width: 1200px) {
    height: calc(100vh - 473px);
  }
  @media screen and (max-width: 650px) {
    font-size: 48px;
    height: calc(100vh - 340px);
  }
`;

export default ComingSoon;
