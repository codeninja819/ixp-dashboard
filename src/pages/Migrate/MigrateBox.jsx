/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import styled from "styled-components";
import { Box, useMediaQuery } from "@mui/material";
import { MerkleTree } from "merkletreejs";
import { BiChevronDown } from "react-icons/bi";

import { IXP_ADDR, IXP_V3_ADDR, MIGRATION_ADDR } from "../../abis/address";
import Button from "../../components/Button";
import useMigrationInfo from "../../hooks/useMigrationInfo";
import { useWeb3Context } from "../../hooks/web3Context";
import { getMigrationContract, getV3TokenContract } from "../../utils/contracts";
import { shortenHex } from "../../utils/helper";
import { figureError } from "../../utils/functions";

import snapshot from "./snapshot.json";

const MigrateBox = ({ type, setNotification }) => {
  const xs = useMediaQuery("(max-width : 650px)");

  const { address: account, connect, provider } = useWeb3Context();

  const {
    balance: v3Balance,
    migratedAmount,
    allowance,
    decimals,
    claimable,
    pendingClaim,
    fetchAccountMigrationData,
    fetchTxList,
  } = useMigrationInfo();

  const [amount, setAmount] = useState("0");
  const [max, setMax] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setMax(
      snapshot.find((user) => user.address.toLowerCase() === account?.toLowerCase())?.amount ?? "0"
    );
  }, [account]);

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  const handleMax = () => {
    let maxAmount =
      Number(ethers.utils.formatUnits(v3Balance, decimals)) > Number(max)
        ? max - (ethers.utils.formatUnits(migratedAmount, decimals) * 100) / 89
        : +ethers.utils.formatUnits(v3Balance, decimals) -
          (ethers.utils.formatUnits(migratedAmount, decimals) * 100) / 89;
    maxAmount = Math.floor(maxAmount * Math.pow(10, decimals)) / Math.pow(10, decimals);
    setAmount(maxAmount.toString());
  };

  const generateProof = () => {
    const leaf = snapshot.find((user) => user.address.toLowerCase() === account?.toLowerCase());
    if (!leaf) return [];

    const leaves = snapshot.map((user) =>
      solidityKeccak256(
        ["address", "uint256"],
        [user.address, ethers.utils.parseUnits((+user.amount).toFixed(decimals), decimals)._hex]
      )
    );
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    return tree.getHexProof(
      solidityKeccak256(
        ["address", "uint256"],
        [account, ethers.utils.parseUnits(max, decimals)._hex]
      )
    );
  };

  const onApproveContract = async () => {
    setPending(true);
    try {
      const v3TokenContract = getV3TokenContract(provider.getSigner());
      const tx = await v3TokenContract.approve(MIGRATION_ADDR, ethers.constants.MaxUint256);
      await tx.wait();

      fetchAccountMigrationData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const onConfirm = async () => {
    if (amount > max - ethers.utils.formatUnits(migratedAmount, decimals)) {
      setNotification({
        type: "error",
        title: "Wrong amount",
        detail: "Exceed migration snapshot",
      });
      return;
    }
    if(+amount < 0) {
      setNotification({ type: "error", title: "Wrong amount", detail: "Invalid amount" });
      return;
    }

    if (+amount > +ethers.utils.formatUnits(v3Balance, decimals)) {
      setNotification({ type: "error", title: "Wrong amount", detail: "Insufficient balance" });
      return;
    }

    setPending(true);
    const leaf = snapshot.find((user) => user.address.toLowerCase() === account?.toLowerCase());
    const proof = generateProof();

    try {
      const migrateContract = getMigrationContract(provider.getSigner());
      let estimateGas;
      if (type === "from") {
        if (amount === "" || +amount === 0) {
          setNotification({
            type: "error",
            title: "Wrong amount",
            detail: "Please input amount to migrate",
          });
          setPending(false);
          return;
        }

        estimateGas = await migrateContract.estimateGas.deposit(
          ethers.utils.parseUnits(amount, decimals),
          ethers.utils.parseUnits(max),
          proof
        );
      } else {
        estimateGas = await migrateContract.estimateGas.claim();
      }
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }

      let tx;
      if (type === "from") {
        tx = await migrateContract.deposit(
          ethers.utils.parseUnits(amount, decimals),
          ethers.utils.parseUnits(leaf.amount),
          proof
        );
      } else {
        tx = await migrateContract.claim();
      }
      await tx.wait(2);

      setTimeout(fetchAccountMigrationData, 5000);
      setTimeout(fetchTxList, 5000);
    } catch (e) {
      console.log(e);
      figureError(e, setNotification);
    }

    setPending(false);
  };

  return (
    <Box width={"100%"}>
      <Panel>
        <Box fontFamily={"ChakraPetchSemiBold"} fontSize={xs ? "14px" : "16px"}>
          MIGRATE {type === "from" ? "FROM" : "TO"}{" "}
          <span style={{ fontSize: xs ? "18px" : "26px", color: "#C31B1F" }}>
            {type === "from" ? "V3" : "V4"}
          </span>
        </Box>
        <Box mt={xs ? "17px" : "24px"} fontSize={xs ? "12px" : "18px"}>
          {type === "from"
            ? "Migrate your V3 IMPACTXP tokens to V4 IMPACTXP tokens."
            : "These are the IMPACTXP V4 tokens you will receive in exchange."}
        </Box>
        <InputPanel mt={xs ? "26px" : "36px"}>
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Box display={"flex"} alignItems={"center"} style={{ cursor: "pointer" }}>
              <Box
                minWidth={xs ? "17px" : "28px"}
                minHeight={xs ? "18px" : "30px"}
                maxWidth={xs ? "17px" : "28px"}
                maxHeight={xs ? "18px" : "30px"}
              >
                <img src={"/logo.png"} width={"100%"} height={"100%"} alt={""} />
              </Box>
              <Box ml={xs ? "5px" : "8px"} fontSize={xs ? "12px" : "16px"}>
                ImpactXP
              </Box>
              <Box>
                <BiChevronDown fontSize={"20px"} />
              </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <Box
                minWidth={xs ? "10px" : "16px"}
                minHeight={xs ? "10px" : "16px"}
                maxWidth={xs ? "10px" : "16px"}
                maxHeight={xs ? "10px" : "16px"}
              >
                <img src={"/icons/etherscan.png"} width={"100%"} height={"100%"} alt={""} />
              </Box>
              <a
                href={`https://etherscan.io/token/${type === "from" ? IXP_V3_ADDR : IXP_ADDR}`}
                target={"_blank"}
                rel="noreferrer"
              >
                <Box ml={xs ? "3px" : "5px"} fontSize={xs ? "8px" : "11px"} mt={"3px"}>
                  {type === "from" ? shortenHex(IXP_V3_ADDR) : shortenHex(IXP_ADDR)}
                </Box>
              </a>
            </Box>
          </Box>
          <Box
            mt={xs ? "12px" : "17px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {type === "from" ? (
              <>
                <input
                  type={"number"}
                  placeholder={"0.0"}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
                <Button
                  type={"primary"}
                  width={xs ? "50px" : "82px"}
                  height={xs ? "20px" : "33px"}
                  fontSize={xs ? "13px" : "20px"}
                  onClick={handleMax}
                >
                  MAX
                </Button>
              </>
            ) : (
              <input
                type={"number"}
                placeholder={"0.0"}
                value={ethers.utils.formatEther(pendingClaim)}
                readOnly
              />
            )}
          </Box>
        </InputPanel>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mt={xs ? "12px" : "24px"}
          fontSize={xs ? "12px" : "16px"}
        >
          <Box>{type === "from" ? `Maximum tokens to migrate` : "Tokens to migrate"}</Box>
          <Box>
            {type === "from"
              ? Number(ethers.utils.formatUnits(v3Balance, decimals)) > Number(max)
                ? (max - (ethers.utils.formatUnits(migratedAmount, decimals) * 100) / 89).toFixed(3)
                : (
                    +ethers.utils.formatUnits(v3Balance, decimals) -
                    (ethers.utils.formatUnits(migratedAmount, decimals) * 100) / 89
                  ).toFixed(3)
              : Number(ethers.utils.formatUnits(migratedAmount, decimals)).toFixed(3)}
          </Box>
        </Box>
      </Panel>
      {type === "from" ? (
        <Button
          type={"primary"}
          width={"100%"}
          height={xs ? "34px" : "56px"}
          fontSize={xs ? "14px" : "20px"}
          disabled={pending}
          onClick={account ? (allowance ? onConfirm : onApproveContract) : onConnect}
        >
          {allowance ? `MIGRATE TOKENS` : "APPROVE TOKENS"} {pending && "..."}
        </Button>
      ) : (
        <Button
          type={"primary"}
          width={"100%"}
          height={xs ? "34px" : "56px"}
          fontSize={xs ? "14px" : "20px"}
          disabled={pending || !claimable || migratedAmount.eq(0)}
          onClick={onConfirm}
        >
          CLAIM TOKENS {pending && "..."}
        </Button>
      )}
    </Box>
  );
};
const InputPanel = styled(Box)`
  background: #181a1c;
  border: 1px solid #3e3e3e;
  padding: 13px 27px 11px 24px;
  > div > input {
    font-family: "ChakraPetchMedium";
    font-size: 26px;
    width: 100%;
    background: transparent;
    color: white;
    border: none;
  }
  @media screen and (max-width: 650px) {
    padding: 8px 16px 7px 15px;
    > div > input {
      font-size: 16px;
    }
  }
`;

const Panel = styled(Box)`
  background: #0f0f0f;
  box-shadow: 0px 3px 6px black;
  padding: 21px 20px 26px 30px;
  width: 100%;
  box-shadow: 0px 3px 6px black;
  z-index: 5;
  position: relative;
  @media screen and (max-width: 650px) {
    padding: 10px 16px 15px 18px;
  }
`;
export default MigrateBox;
