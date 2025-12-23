"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import WalletConnectSignClient from "@walletconnect/sign-client";
import { getAccountAddress } from "@/libs/utils";
const projectID = "ef73587ec0fc08e3b38ae1b4e5cec735";

export default function AutoTransfer() {
  const [qrCode, setQrCode] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [signClient, setSignClient] = useState<WalletConnectSignClient | null>(
    null
  );

  const sessionTopic = useRef<string>("");

  const initiatePayment = async () => {
    if (!signClient) {
      return;
    }
    try {
      const requiredNamespaces = {
        eip155: {
          methods: ["eth_sendTransaction", "eth_signTransaction"], // 请求发送交易的方法
          chains: ["eip155:97"],
          events: ["chainChanged", "accountsChanged"],
        },
      };

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: requiredNamespaces,
      });

      if (uri) {
        setQrCode(uri);
      }

      // 5. 等待钱包端批准会话提议
      setStatus("等待钱包批准连接...");
      const session = await approval();
      sessionTopic.current = session.topic;
      setStatus(`连接成功！账户: ${session.namespaces.eip155.accounts[0]}`);

      // 6. 会话建立后，立即发起转账请求
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("发起转账请求...");
      await sendPaymentTransaction(signClient, session.topic);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`错误: ${errorMessage}`);
    }
  };

  const sendPaymentTransaction = async (
    signClient: WalletConnectSignClient,
    sessionTopic: string
  ) => {
    try {
      // 构建交易参数
      const transaction = {
        from: await getAccountAddress(signClient, sessionTopic), // 从已连接的账户获取 from 地址
        to: "0x742d35Cc6634C893292Ce8bB6239C002Ad8e6b59", // 接收方地址
        value: "0x38D7EA4C68000", // 0.001 ETH in hex (0.001 * 10^18)
        gasLimit: "0x5208", // 21000 gas
        gasPrice: "0x2540BE400", // 10 Gwei in hex
      };

      setStatus("请在钱包中确认交易...");

      // 发送交易请求
      const result = await signClient.request({
        topic: sessionTopic, // 使用建立的会话
        chainId: "eip155:97",
        request: {
          method: "eth_sendTransaction", // 方法名
          params: [transaction], // 参数
        },
      });

      // 请求成功，返回的是交易哈希
      console.log("交易已发送！交易哈希:", result);
      setStatus(
        `支付成功！交易哈希: <a href="https://etherscan.io/tx/${result}" target="_blank">${result}</a>`
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      setStatus(`交易失败: ${errorMessage}`);
    }
  };

  useEffect(() => {
    const initSignClient = async () => {
      const signClient = await WalletConnectSignClient.init({
        projectId: projectID,
        relayUrl: "wss://localhost:8546",
        metadata: {
          name: "Transfer Demo",
          description: "Transfer Demo",
          url: window.location.origin,
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      });
      setSignClient(signClient);
    };
    initSignClient();
  }, []);
  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <button
          className="p-2 px-4 border border-white rounded-lg mb-4"
          onClick={initiatePayment}
        >
          点击转账
        </button>

        <div
          className={`border-4 border-white ${
            qrCode ? "block" : "hidden"
          } h-62 w-62`}
        >
          <QRCodeSVG value={qrCode} height={240} width={240} />
        </div>

        {qrCode && (
          <div
            className="text-center mb-4 text-sm mt-2 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(qrCode);
              alert("QR Code copied to clipboard");
            }}
          >
            <p>Copy QR Code</p>
          </div>
        )}

        <div className="text-center mb-4 text-sm mt-2">
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}
