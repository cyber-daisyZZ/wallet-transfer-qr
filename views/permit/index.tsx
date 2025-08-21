"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import WalletConnectSignClient from "@walletconnect/sign-client";
import { keccak256, toUtf8Bytes, AbiCoder, ethers } from "ethers";

interface PermitData {
  owner: string;
  spender: string;
  value: string;
  deadline: number;
  nonce: number;
  v: number;
  r: string;
  s: string;
}

// const contractAddress = "0x4c1931F81e02C89D0a2F8559F5FAaDab5cc7cE14";
const contractAddress = "0xAa55968385640dc2BC732dbaE59bABd3910b2912";

const tokenAddress = "0x217A1FBd704c40F725E532c9Ff95c53aC8843431"; // USD2代币地址
// const tokenAddress = "0xE0109613ca37464c9F708b7690Cb9dF1fdd345Fd"; // USD1代币地址

const chainId = 97; // BSC测试网
const projectID = "ef73587ec0fc08e3b38ae1b4e5cec735"; // WalletConnect项目ID

export default function PermitPage() {
  const [permitData, setPermitData] = useState<PermitData | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [status, setStatus] = useState<string>("准备生成USD1授权QR码...");
  const [userAddress, setUserAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0"); // 1 USD1
  const [signClient, setSignClient] = useState<WalletConnectSignClient | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [sessionTopic, setSessionTopic] = useState<string>("");

  // 初始化WalletConnect客户端
  useEffect(() => {
    const initSignClient = async () => {
      try {
        const client = await WalletConnectSignClient.init({
          projectId: projectID,
          metadata: {
            name: "USD1 Permit Demo",
            description: "USD1代币授权演示",
            url: window.location.origin,
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
          },
        });
        setSignClient(client);

        // 监听会话事件
        client.on("session_event", (args) => {
          console.log("Session event:", args);
        });

        client.on("session_update", ({ topic, params }) => {
          console.log("Session updated:", topic, params);
        });

        client.on("session_delete", () => {
          console.log("Session deleted");
          setIsConnected(false);
          setSessionTopic("");
        });
      } catch (error) {
        console.error("初始化WalletConnect失败:", error);
        setStatus("初始化WalletConnect失败");
      }
    };

    initSignClient();
  }, []);

  // 连接钱包
  const connectWallet = async () => {
    if (!signClient) {
      setStatus("WalletConnect未初始化");
      return;
    }

    try {
      setStatus("正在连接钱包...");

      const requiredNamespaces = {
        eip155: {
          methods: [
            "eth_signTypedData_v4",
            "personal_sign",
            "eth_sendTransaction",
          ],
          chains: [`eip155:${chainId}`],
          events: ["chainChanged", "accountsChanged"],
        },
      };

      const { uri, approval } = await signClient.connect({
        requiredNamespaces,
      });

      if (uri) {
        // 显示连接QR码
        setQrCodeData(uri);
        setStatus("请使用钱包扫描QR码连接...");
      }

      // 等待钱包批准连接
      const session = await approval();
      setSessionTopic(session.topic);
      setIsConnected(true);

      // 获取连接的账户
      const accounts = session.namespaces.eip155.accounts;
      if (accounts.length > 0) {
        const address = accounts[0].split(":")[2];
        setUserAddress(address);
        setStatus(`钱包已连接: ${address}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`连接失败: ${errorMessage}`);
    }
  };

  // 生成EIP-2612 permit消息
  const generatePermitMessage = async () => {
    if (!userAddress) {
      setStatus("请输入用户地址");
      return;
    }

    try {
      setStatus("正在生成permit消息...");

      // 构造EIP-2612标准的permit消息
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时后过期

      // 从代币合约获取当前nonce值
      const nonce = await getCurrentNonce(userAddress);
      console.log("当前nonce值:", nonce);

      const permitMessage = {
        owner: userAddress,
        spender: contractAddress,
        value: amount,
        nonce: nonce + 1,
        deadline: deadline,
      };

      setStatus("permit消息已生成，请使用钱包签名...");

      // 生成用于签名的消息哈希
      const domain = {
        name: "USD1", // 代币名称
        version: "1", // 版本
        chainId: chainId,
        verifyingContract: tokenAddress,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      // 生成签名数据
      const signatureData = {
        domain,
        types,
        primaryType: "Permit",
        message: permitMessage,
      };

      // 保存permit数据用于后续显示
      setPermitData({
        owner: userAddress,
        spender: contractAddress,
        value: amount,
        deadline: deadline,
        nonce: nonce,
        v: 0, // 这些值将在钱包签名后生成
        r: "0x0000000000000000000000000000000000000000000000000000000000000000",
        s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      // 生成包含签名数据的QR码
      const qrData = {
        type: "eip2612_permit",
        chainId: chainId,
        token: tokenAddress,
        contract: contractAddress,
        permit: permitMessage,
        signatureData: signatureData,
      };

      setQrCodeData(JSON.stringify(qrData));
      setStatus("USD1授权QR码已生成，请使用钱包扫描并签名");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`生成失败: ${errorMessage}`);
    }
  };

  // 使用WalletConnect签名permit消息
  const signPermitMessage = async () => {
    if (!signClient || !sessionTopic || !permitData) {
      setStatus("请先连接钱包并生成permit消息");
      return;
    }

    try {
      setStatus("正在请求钱包签名...");

      // 构造EIP-712签名数据
      const domain = {
        name: "USD1",
        version: "1",
        chainId: chainId,
        verifyingContract: tokenAddress,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        owner: permitData.owner,
        spender: permitData.spender,
        value: permitData.value,
        nonce: 1,
        deadline: permitData.deadline,
      };

      console.log(message);

      const result = await signClient.request({
        topic: sessionTopic,
        chainId: `eip155:${chainId}`,
        // request: {
        //   method: "eth_signTypedData",
        //   params: [domain, types, message],
        // },

        request: {
          method: "eth_signTypedData_v4",
          params: [
            permitData.owner,
            JSON.stringify({
              types,
              primaryType: "Permit",
              domain,
              message,
            }),
          ],
        },
      });

      // 解析签名结果
      const signature = result as string;
      const { v, r, s } = parseSignature(signature);

      // 更新permit数据
      const updatedPermitData = {
        ...permitData,
        v,
        r,
        s,
      };
      setPermitData(updatedPermitData);

      // 生成包含签名的最终QR码
      const finalQRData = {
        type: "signed_permit",
        chainId: chainId,
        token: tokenAddress,
        contract: contractAddress,
        permit: updatedPermitData,
        signature: signature,
      };

      setQrCodeData(JSON.stringify(finalQRData));
      setStatus("签名完成！已生成包含签名的QR码");
    } catch (error) {
      console.log("签名失败:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`签名失败: ${errorMessage}`);
    }
  };

  // 解析签名获取v, r, s
  const parseSignature = (signature: string) => {
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);

    return { v, r, s };
  };

  // 生成EIP-681格式的QR码
  const generateEIP681QR = () => {
    if (!permitData || permitData.v === 0) {
      setStatus("请先完成签名");
      return;
    }

    // EIP-681格式：ethereum:合约地址/函数名?参数
    const eip681Data = `ethereum:${contractAddress}/depositWithPermit?token=${tokenAddress}&amount=${permitData.value}&deadline=${permitData.deadline}&v=${permitData.v}&r=${permitData.r}&s=${permitData.s}&referrer=0x0000000000000000000000000000000000000000`;
    setQrCodeData(eip681Data);
    setStatus("EIP-681格式QR码已生成");
  };

  // 通过 walletconnect 直接调用合约方法
  const contractCall = async () => {
    if (!permitData || permitData.v === 0) {
      setStatus("请先完成签名");
      return;
    }

    if (!signClient || !sessionTopic) {
      setStatus("请先连接钱包");
      return;
    }

    if (!userAddress) {
      setStatus("请先连接钱包获取用户地址");
      return;
    }

    try {
      setStatus("正在调用合约depositWithPermit方法...");

      // 构造合约调用参数
      const contractCallParams = {
        from: userAddress, // 发送方地址（当前连接的钱包地址）
        to: ethers.getAddress(contractAddress), // 目标合约地址（格式化）
        data: encodeDepositWithPermitData(), // 编码后的函数调用数据
        value: "0x0", // 不发送ETH，只调用合约方法
        gas: "0x6686A0", // 预估gas限制 (100,000)
        gasPrice: "0x3B9ACA00", // 1 Gwei
      };

      console.log("合约调用参数:", contractCallParams);
      console.log("用户地址:", userAddress);
      console.log("合约地址:", contractAddress);

      // 通过WalletConnect发送交易
      const result = await signClient.request({
        topic: sessionTopic,
        chainId: `eip155:${chainId}`,
        request: {
          method: "eth_sendTransaction",
          params: [contractCallParams],
        },
      });

      console.log("交易已发送，结果:", result);
      setStatus(`合约调用成功！交易哈希: ${result}`);

      // 生成包含交易哈希的QR码
      const successQRData = {
        type: "transaction_success",
        chainId: chainId,
        contract: contractAddress,
        method: "depositWithPermit",
        transactionHash: result,
        permit: permitData,
        description: `depositWithPermit调用成功\n交易哈希: ${result}\n金额: ${
          parseInt(permitData.value) / 1e18
        } USD1`,
      };

      setQrCodeData(JSON.stringify(successQRData));
    } catch (error) {
      console.error("合约调用失败:", error);
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`合约调用失败: ${errorMessage}`);
    }
  };

  // 获取代币合约的当前nonce值
  const getCurrentNonce = async (ownerAddress: string) => {
    try {
      // 构造nonces函数调用数据
      const noncesFunctionSignature = "nonces(address)";
      const noncesFunctionSelector = keccak256(
        toUtf8Bytes(noncesFunctionSignature)
      ).slice(0, 10);

      // 编码参数
      const encodedParams = AbiCoder.defaultAbiCoder().encode(
        ["address"],
        [ownerAddress]
      );

      const callData = noncesFunctionSelector + encodedParams.slice(2);

      // 通过WalletConnect调用合约的nonces函数
      if (signClient && sessionTopic) {
        const result = await signClient.request({
          topic: sessionTopic,
          chainId: `eip155:${chainId}`,
          request: {
            method: "eth_call",
            params: [
              {
                to: tokenAddress,
                data: callData,
              },
              "latest", // block number
            ],
          },
        });

        // 解析返回的nonce值
        const nonce = parseInt(result as string, 16);
        console.log("从合约获取的nonce:", nonce);
        return nonce;
      }

      // 如果WalletConnect不可用，返回默认值
      return 0;
    } catch (error) {
      console.error("获取nonce失败:", error);
      // 返回默认值，避免阻塞流程
      return 0;
    }
  };

  // 编码depositWithPermit函数调用数据
  const encodeDepositWithPermitData = () => {
    if (!permitData) return "0x";

    // depositWithPermit函数签名: depositWithPermit(address,uint256,uint256,uint8,bytes32,bytes32,address)
    const functionSignature =
      "depositWithPermit(address,uint256,uint256,uint8,bytes32,bytes32,address)";
    const functionSelector = keccak256(toUtf8Bytes(functionSignature)).slice(
      0,
      10
    );

    // 确保地址格式正确
    const formattedTokenAddress = ethers.getAddress(tokenAddress);

    console.log([
      formattedTokenAddress, // token
      parseInt(permitData.value).toString(), // amount (转换为wei)
      permitData.deadline, // deadline
      permitData.v, // v
      permitData.r, // r
      permitData.s, // s
      ethers.ZeroAddress, // referrer (空地址)
    ]);

    // 编码参数
    const encodedParams = AbiCoder.defaultAbiCoder().encode(
      [
        "address",
        "uint256",
        "uint256",
        "uint8",
        "bytes32",
        "bytes32",
        "address",
      ],
      [
        formattedTokenAddress, // token
        parseInt(permitData.value).toString(),
        permitData.deadline, // deadline
        permitData.v, // v
        permitData.r, // r
        permitData.s, // s
        ethers.ZeroAddress, // referrer (空地址)
      ]
    );

    // 返回完整的调用数据
    return functionSelector + encodedParams.slice(2); // 移除0x前缀
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-11xl mx-auto">
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 返回首页
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            USD1 EIP-2612 授权管理
          </h1>

          <div className="space-y-6">
            {/* 钱包连接状态 */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">钱包连接状态：</h3>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isConnected ? "已连接" : "未连接"}
                </span>
                {!isConnected && (
                  <button
                    onClick={connectWallet}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    连接钱包
                  </button>
                )}
                {isConnected && (
                  <span className="text-sm text-gray-600">
                    地址: {userAddress}
                  </span>
                )}
              </div>
            </div>

            {/* 用户输入 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  用户地址:
                </label>
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  授权金额 (USD1):
                </label>
                <input
                  type="text"
                  value={parseInt(amount) / 1e18}
                  onChange={(e) =>
                    setAmount(
                      (parseFloat(e.target.value || "0") * 1e18).toString()
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.0"
                />
              </div>
            </div>

            {/* 合约信息显示 */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">合约信息：</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">合约地址:</span>{" "}
                  {contractAddress}
                </div>
                <div>
                  <span className="font-medium">代币地址:</span> {tokenAddress}
                </div>
                <div>
                  <span className="font-medium">链ID:</span> {chainId}{" "}
                  (BSC测试网)
                </div>
                <div>
                  <span className="font-medium">代币名称:</span> USD1
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="flex justify-between gap-4 flex-wrap">
              <button
                onClick={generatePermitMessage}
                disabled={!userAddress}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                1.生成Permit Data
              </button>

              <button
                onClick={signPermitMessage}
                disabled={!isConnected || !permitData}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                2.使用WalletConnect签名
              </button>

              <button
                onClick={generateEIP681QR}
                disabled={!permitData || permitData.v === 0}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                3.1生成EIP-681格式请求
              </button>

              <button
                onClick={contractCall}
                disabled={!permitData || permitData.v === 0}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                3.2直接调用depositWithPermit
              </button>
            </div>

            {/* 状态显示 */}
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{status}</p>
            </div>

            {/* QR码显示 */}
            {qrCodeData && (
              <div className="flex flex-col items-center space-y-4">
                <div className="border-4 border-gray-300 p-4 rounded-lg">
                  <QRCodeSVG value={qrCodeData} size={256} />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    使用钱包扫描此QR码进行USD1授权
                  </p>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrCodeData);
                      alert("QR码数据已复制到剪贴板");
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    复制QR码数据
                  </button>
                </div>
              </div>
            )}

            {/* Permit数据详情 */}
            {permitData && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Permit授权详情：</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">所有者:</span>{" "}
                    {permitData.owner}
                  </div>
                  <div>
                    <span className="font-medium">授权给:</span>{" "}
                    {permitData.spender}
                  </div>
                  <div>
                    <span className="font-medium">授权金额:</span>{" "}
                    {parseInt(permitData.value) / 1e18} USD1
                  </div>
                  <div>
                    <span className="font-medium">过期时间:</span>{" "}
                    {new Date(permitData.deadline * 1000).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Nonce:</span>{" "}
                    {permitData.nonce}
                  </div>
                  {permitData.v !== 0 && (
                    <>
                      <div>
                        <span className="font-medium">V:</span> {permitData.v}
                      </div>
                      <div>
                        <span className="font-medium">R:</span> {permitData.r}
                        ...
                      </div>
                      <div>
                        <span className="font-medium">S:</span> {permitData.s}
                        ...
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 使用说明 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                EIP-2612使用说明：
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• 首先连接WalletConnect钱包</li>
                <li>• 输入用户地址和授权金额</li>
                <li>• 生成包含permit消息的QR码</li>
                <li>• 使用WalletConnect签名permit消息</li>
                <li>• 生成包含v, r, s签名的最终QR码</li>
                <li>• 生成调用depositWithPermit方法的合约调用QR码</li>
                <li>• 合约自动执行USD1授权和转账</li>
                <span className="font-medium">R:</span> {permitData?.r}
                <span className="font-medium">S:</span> {permitData?.s}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
