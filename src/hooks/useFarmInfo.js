/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAddress } from "./web3Context";
import { multicall, getPairContract } from '../utils/contracts';
import { FARM_ADDR, PAIR_ADDR } from '../abis/address';
import PairABI from '../abis/PancakePairABI.json'
import FarmABI from '../abis/FarmABI.json'
import axios from 'axios';
import { ethers } from 'ethers';
import useTokenInfo from './useTokenInfo';

const defaultVal = {
    allowance: false,
    farminfo: [{}],
    accountfarminfo: [{}],
    farmprice: 0,
    liquidity: 0,
    fetchAllowance: () => { },
    fetchFarmData: () => { },
    fetchFarmPrice: () => { },
    fetchAccountFarmData: () => { }
}

export const FarmInfoContext = React.createContext(defaultVal)

export default function useFarmInfo() {
    return React.useContext(FarmInfoContext);
}
let timerid = null, priceid = null, farmid = null;
export function FarmInfoProvider({ children }) {

    const account = useAddress();
    const { price } = useTokenInfo();
    const [allowance, setAllowance] = useState(false);
    const [farminfo, setFarmInfo] = useState([{}]);
    const [accountfarminfo, setAccountFarmInfo] = useState([{}]);
    const [farmprice, setFarmPrice] = useState(0);
    const [reserves, setReserves] = useState([0, 0])
    const [ethPrice, setEthPrice] = useState(0);

    async function fetchAllowance() {
        try {
            const pairContract = getPairContract();
            const allowance = await pairContract.allowance(account, FARM_ADDR);
            setAllowance(allowance > ethers.utils.parseEther('10000'));
        }
        catch (error) {
            console.log(error);
        }
    }

    async function fetchFarmData() {
        try {
            let calls = [
                {
                    address: FARM_ADDR,
                    name: 'performanceFee',
                    params: []
                },
                {
                    address: FARM_ADDR,
                    name: 'poolInfo',
                    params: [0]
                },
                {
                    address: FARM_ADDR,
                    name: 'rewardPerBlock',
                    params: []
                },
                {
                    address: FARM_ADDR,
                    name: 'totalStaked',
                    params: [0]
                }
            ];
            const result = await multicall(FarmABI, calls);
            setFarmInfo([{
                depositFee: result[1].depositFee / 100,
                withdrawFee: result[1].withdrawFee / 100,
                rate: farmprice ? result[2][0] * 6219 * 36500 * price / (farmprice * result[3][0]) * 244.76 / 232.16 : undefined,
                performanceFee: result[0][0],
                liquidity: price * reserves[0] / Math.pow(10, 18) + farmprice * reserves[1] / Math.pow(10, 18),
                totalStaked: result[3][0] / Math.pow(10, 18)
            }])
        }
        catch (error) {
            console.log(error);
        }
    }

    async function fetchAccountFarmData() {
        try {
            const pairContract = getPairContract();
            const _balance = await pairContract.balanceOf(account);
            let calls = [];
            calls.push({
                address: FARM_ADDR,
                name: 'pendingRewards',
                params: [0, account]
            })
            calls.push({
                address: FARM_ADDR,
                name: 'userInfo',
                params: [0, account]
            })
            const result = await multicall(FarmABI, calls);
            setAccountFarmInfo([{
                balance: _balance,
                pendingReward: result[0][0] / Math.pow(10, 18),
                stakedAmount: result[1][0],
            }]);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function fetchFarmPrice() {
        try {
            const _ethPrice = await axios.get('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX');
            const ethPrice = _ethPrice.data.result.ethusd;
            setEthPrice(ethPrice);
            let calls = [
                {
                    address: PAIR_ADDR,
                    name: 'getReserves',
                    params: []
                },
                {
                    address: PAIR_ADDR,
                    name: 'totalSupply',
                    params: []
                },

            ];
            const result = await multicall(PairABI, calls);
            const reserves = result[0];
            const totalSupply = result[1][0] / Math.pow(10, 18);
            const _price = 2 * Math.sqrt(reserves[0] / Math.pow(10, 18) * reserves[1] / Math.pow(10, 18)) *
                Math.sqrt(price * ethPrice) / totalSupply;
            setFarmPrice(_price);
            setReserves(reserves)
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFarmData();
        if (farmid) clearInterval(farmid);
        farmid = setInterval(() => {
            fetchFarmData()
        }, 20000);
    }, [farmprice])

    useEffect(() => {
        if (!account) return;
        fetchAccountFarmData();
        fetchAllowance();
        if (timerid) clearInterval(timerid);
        timerid = setInterval(() => {
            fetchAccountFarmData();
            fetchAllowance();
        }, 20000);
    }, [account])

    useEffect(() => {
        if (!price) return;
        fetchFarmPrice();
        if (priceid) clearInterval(priceid);
        priceid = setInterval(() => {
            fetchFarmPrice()
        }, 20000)
    }, [price])

    return <FarmInfoContext.Provider
        value={{
            allowance,
            farminfo,
            accountfarminfo,
            farmprice,
            liquidity: (reserves[0] * price + reserves[1] * ethPrice) / Math.pow(10, 18),
            fetchAllowance,
            fetchFarmData,
            fetchFarmPrice,
            fetchAccountFarmData
        }}
        children={children} />;
}