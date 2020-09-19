import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useWeb3Context } from "./hooks/web3Context";

import { Box } from "@mui/material";
import styled from 'styled-components'
import TopBar from "./components/TopBar/TopBar";
import LeftSideBar from './components/LeftSideBar/LeftSideBar'
import Migrate from './pages/Migrate'
import ComingSoon from "./pages/ComingSoon";
import Footer from './components/Footer'

import './App.css'
import Notification from "./components/Notification";

function App() {
  const { connect, hasCachedProvider } = useWeb3Context();

  const [notification, setNotification] = useState(null);
  const [curpage, setCurPage] = useState(0)

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(msg => {
        if (msg.type === 'error') {
          setNotification(msg)
        }
      });

    } else {
      // then user DOES NOT have a wallet
    }
    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>

      <TopBar setNotification={setNotification} curpage={curpage} setCurPage={setCurPage} />
      <StyledContainer>
        <LeftSideBar curpage={curpage} setCurPage={setCurPage} />
        <Routes>

          {/* <Route exact path="/" element={<Home />} />

          <Route exact path="/staking" element={<Staking setNotification={setNotification} />} /> */}
          <Route path="/" element={<Navigate replace to="/migrate" />} />
          <Route path="/home" element={<ComingSoon />} />
          <Route path="/staking" element={<ComingSoon />} />
          <Route path="/farming" element={<ComingSoon />} />
          <Route exact path="/migrate" element={<Migrate setNotification={setNotification} />} />

        </Routes>

      </StyledContainer>
      <Footer />

      <Notification data={notification} />
    </BrowserRouter >
  );
}

const StyledContainer = styled(Box)`
  display : flex;
  position : relative;
  min-height : 1300px;
  @media screen and (min-height : 1300px){
    min-height : 100vh;
  }
  @media screen and (max-width : 1200px){
    min-height : unset;
  }
`;

export default App;
