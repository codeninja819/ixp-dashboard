import React, { useEffect, useState } from 'react';
import { useAddress } from "./web3Context";
import { multicall, getTokenContract } from '../utils/contracts';
import { LOCK_ADDR } from '../abis/address';
import LockABI from '../abis/LockABI.json'
import { ethers } from 'ethers';

const defaultVal = {
    lockinfo: [{}, {}, {}],
    allowance: false,
    accountlockinfo: [{}, {}, {}],
    performanceFee: 0,
    fetchLockData: () => { },
    fetchAccountLockData: () => { },
    fetchAllowance: () => { }
}

export const LockInfoContext = React.createContext(defaultVal)

export default function useLockInfo() {
    return React.useContext(LockInfoContext);
}
let timerid = null;
export function LockInfoProvider({ children }) {

    const account = useAddress();
    const [lockinfo, setLockInfo] = useState([{}, {}, {}]);
    const [allowance, setAllowance] = useState(false);
    const [accountlockinfo, setAccountLockInfo] = useState([{}, {}, {}]);
    const [performanceFee, setPerformanceFee] = useState(0);

    async function fetchLockData() {
        try {
            let calls = [
                {
                    address: LOCK_ADDR,
                    name: 'performanceFee',
                    params: []
                }
            ]
            for (let i = 0; i < 2; i++)
                calls.push({
                    address: LOCK_ADDR,
                    name: 'lockups',
                    params: [i]
                })

            const result = await multicall(LockABI, calls);
            setPerformanceFee(result[0][0]);
            let temp = [];
            for (let i = 0; i < 2; i++) {
                const rate = result[i + 1].rate / result[i + 1].totalStaked * 36500 * 6219 * 22.93 / 21.86;
                temp.push({
                    depositFee: result[i + 1].depositFee / 100,
                    withdrawFee: result[i + 1].withdrawFee / 100,
                    duration: result[i + 1].duration / 1,
                    rate,
                    totalStaked: result[i + 1].totalStaked / Math.pow(10, 18)
                })
            }
            setLockInfo(temp);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function fetchAccountLockData() {
        try {
            let calls = [];
            for (let i = 0; i < 3; i++) {
                calls.push({
                    address: LOCK_ADDR,
                    name: 'pendingReward',
                    params: [account, i]
                })
                calls.push({
                    address: LOCK_ADDR,
                    name: 'userInfo',
                    params: [i, account]
                })
            }
            const result = await multicall(LockABI, calls);
            let temp = [];
            for (let i = 0; i < 3; i++)
                temp.push({
                    pendingReward: result[i * 2][0] / Math.pow(10, 18),
                    stakedAmount: result[i * 2 + 1][0],
                    available: result[i * 2 + 1][1]
                })
            setAccountLockInfo(temp);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function fetchAllowance() {
        try {
            const tokenContract = getTokenContract();
            const allowance = await tokenContract.allowance(account, LOCK_ADDR);
            setAllowance(allowance > ethers.utils.parseEther('10000'));
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchLockData();
        setInterval(() => {
            fetchLockData()
        }, 20000);
    }, [])

    useEffect(() => {
        if (!account) return;
        fetchAccountLockData();
        fetchAllowance();
        if (timerid) clearInterval(timerid);
        timerid = setInterval(() => {
            fetchAccountLockData();
            fetchAllowance();
        }, 20000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    return <LockInfoContext.Provider
        value={{
            lockinfo,
            allowance,
            accountlockinfo,
            performanceFee,
            fetchLockData,
            fetchAccountLockData,
            fetchAllowance
        }}
        children={children} />;
}