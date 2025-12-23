"use client";
import Image from "next/image";
import { useState } from "react";

export default function FlyPage() {
  const [totalAmount, setTotalAmount] = useState(1140);
  const [refundAmount, setRefundAmount] = useState(552);
  const [orderNumber, setOrderNumber] = useState("1128138503731864");
  const [flyDay, setFlyDay] = useState("2023年4月22日");
  const [flyFrom, setFlyFrom] = useState("吉隆坡");
  const [flyTo, setFlyTo] = useState("上海");
  const [flyStartTime, setFlyStartTime] = useState("04-22 20:05");
  const [flyEndTime, setFlyEndTime] = useState("04-23 01:35");
  const readList = [
    {
      name: "乘机行李规定",
    },
    {
      name: "24/240小时中国过境提醒",
    },
    {
      name: "赴华提醒",
    },
    {
      name: "文明乘机提醒",
    },
    {
      name: "防诈骗提醒",
    },
    {
      name: "出入境提醒",
    },
  ];
  const btnList = [
    {
      name: "退款进度",
    },
    {
      name: "发票/行程单",
    },
    {
      name: "再次预订",
    },
  ];
  const serviceList = [
    {
      name: "优选权益8选1",
    },
    {
      name: "延误补偿服务",
    },
    {
      name: "接送机70元券",
    },
  ];
  return (
    <div
      className="h-screen w-screen overflow-hidden bg-[#f0f2f5] text-white font-[var(--crn_font_fbu_orderdetail)]"
      style={{
        fontFamily:
          '400 .14rem / 1.2 -apple-system, Roboto, Helvetica, Arial, Tahoma, "PingFang SC", "Hiragino Sans GB", "Lantinghei SC", "Microsoft YaHei", sans-serif;',
      }}
    >
      {/* 顶部导航栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center bg-gradient-to-r from-[#0088f6] to-[#006ff6] h-[44px] ">
        {/* left icon */}
        <div className="w-[44px] h-[44px] flex items-center justify-center">
          <svg
            className="w-[24px] text-[#fff] mb-[1px] rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        {/* center */}
        <div className="flex-1 text-[15px] font-semibold text-center">
          订单详情
        </div>
        {/* right */}
        <div className="flex flex-col justify-center items-center w-[44px] h-[44px]">
          <svg viewBox="0 0 1024 1024" height="20" width="20">
            <path
              d="M878.3 405.5h-43l1.3-0.1C825.8 238 686.2 107 518.7 107c-167.5 0-307.2 131-318 298.4l1.3 0.1h-55.4c-3.5 0-6.4 2.9-6.4 6.4v272c0 3.5 2.9 6.4 6.4 6.4h148.9c3.5 0 6.4-2.9 6.4-6.4v-272c0-3.5-2.9-6.4-6.4-6.4h-30.4c10.6-131.8 121.1-234.4 253.5-234.4s242.9 102.7 253.5 234.4h-42.8c-3.5 0-6.4 2.9-6.4 6.4v272c0 3.5 2.9 6.4 6.4 6.4h49.2c0 64.2-44.6 116.5-99.4 116.5h-73.8v-29.2c0-3.5-2.9-6.4-6.4-6.4H426.2c-3.5 0-6.4 2.9-6.4 6.4v109.7c0 3.5 2.9 6.4 6.4 6.4h172.9c3.5 0 6.4-2.9 6.4-6.4v-29.2h73.8c83.1 0 150.7-75.2 150.7-167.8h48.4c3.5 0 6.4-2.9 6.4-6.4v-272c-0.1-3.6-2.9-6.4-6.5-6.4zM237.9 626.2h-33.5V469.6h33.5v156.6z m316.3 216.2h-83.1v-20h83.1v20z m266.4-216.2h-33.5V469.6h33.5v156.6z"
              fill="#ffffff"
            ></path>
            <path
              d="M668.7 524.3h-51.3c0 57.8-47 104.9-104.9 104.9-57.8 0-104.9-47-104.9-104.9h-51.3c0 86.1 70 156.1 156.1 156.1s156.3-69.9 156.3-156.1z"
              fill="#ffffff"
            ></path>
          </svg>
          <div className="text-[11.5px]">客服</div>
        </div>
      </div>

      <div className="relative h-full w-full overflow-y-auto pt-[44px] pb-[60px]">
        {/* 1 头部卡片 */}
        <div className="relative">
          <div className="bg-linear-to-r from-[#0088f6] to-[#006ff6] absolute top-0 left-0 right-0 -bottom-2 z-0"></div>
          <div className="absolute top-0 right-0 z-0 overflow-hidden">
            <Image
              src="/images/member-bg-v2.png"
              alt="member-bg-v2"
              className="translate-x-[80px]"
              width={234}
              height={155}
            />
          </div>
          <div className="relative z-10 pt-2 pb-3 px-3 flex flex-col gap-2">
            <div className="flex items-center text-[25px] font-bold leading-[31px]">
              已退票
              <svg
                className="w-[20px] text-[#fff] mb-[1px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            {/* 出行前必读卡片 */}
            <div className="bg-white p-3 flex items-center justify-between rounded-[8px]">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="text-[15px] font-semibold text-[#111]">
                    出行前必读
                  </div>
                  <div className="border border-[#ffc899] text-[#f50] text-[11px] leading-[13px] ml-[6px] rounded-[2px] flex items-center justify-center p-[2px]">
                    {readList.length}条通知
                  </div>
                </div>
                <div className="flex flex-wrap">
                  {readList.map((item) => (
                    <div className="flex items-center mr-3" key={item.name}>
                      <div className="w-1 h-1 bg-[#f50] mr-1 rounded-full mt-[2px]"></div>
                      <span className="text-[12px] text-[#555]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <svg
                className="w-[24px] h-[24px] text-[#111]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            {/* 退款到账 */}
            <div className="bg-white p-3 flex items-center justify-between rounded-[8px]">
              <div className="text-[13px] font-semibold text-[#111]">
                退款到账
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-[13px] text-[#006ff6]">查看更多</span>
                <svg
                  className="w-4 h-4 text-[#006ff6]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 2 订单摘要卡片 */}
        <div className=" bg-white rounded-t-[8px] mb-2 overflow-hidden relative">
          {/* 2.1 金额 */}
          <div className="flex flex-col pt-4 px-3 pb-3 border-b border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-[19px] leading-[23px] font-bold text-[#111] mr-1">
                  总计
                  <span className="ml-2 text-[#006ff6]">¥{totalAmount}</span>
                </div>
                <Image
                  src="/images/question.png"
                  alt="question"
                  className="mb-[1px]"
                  width={15}
                  height={15}
                />
              </div>

              <div className="flex items-center text-gray-600">
                <span className="text-[13px] text-[#006ff6]">
                  行李额和禁带物品
                </span>
                <svg
                  className="w-[14px] h-[16px] text-[#006ff6]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            <div className="text-[12px] font-bold text-[#08a66f] py-1 mt-1">
              已退款 ¥{refundAmount}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 py-1 leading-[15px]">
                <span className="text-[12px] text-[#111]">
                  订单号: {orderNumber}
                </span>
                <span className="text-[12px] text-[#888] h-4">复制</span>
              </div>
            </div>
          </div>

          {/* 2.2 航班 */}
          <div className="px-3 pb-4">
            <div className="flex flex-col items-start justify-between pt-4">
              <div className="w-full flex items-start mb-2">
                <span className="bg-[#ebeff5] text-[#0f4999] font-medium text-xs px-1 py-0.5 rounded-[4px] mr-2">
                  单程
                </span>
                <div className="flex flex-1 items-center text-[17px] leading-[20px] font-semibold text-[#111]">
                  <span>{flyDay}</span>
                  <span className="ml-1">{flyFrom}</span>
                  <Image
                    src="/images/video_goods_icon_arrow.png"
                    alt="arrow-right"
                    className="mx-1 mb-1"
                    width={14}
                    height={18}
                  />
                  <span>{flyTo}</span>
                </div>
                <div className="flex items-center text-[12px] text-[#111]">
                  <span>展开</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-center gap-[3px] px-1 py-[1px] mb-1 border border-[#00b780] text-[#00b780] leading-[15px] rounded-[2px]">
                <span className="text-xs leading-[17px]">已退款</span>
                <svg
                  className="w-[13px] h-[16px] text-[#00b780] mb-[1px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <div className="text-xs font-semibold text-[#111] mt-2">
                <span>{flyStartTime}</span> <span className="mx-1">至</span>{" "}
                <span>{flyEndTime}</span>
              </div>
            </div>

            <button className="w-full border border-[#006ff6] text-[#006ff6] h-9 text-[13px] leading-[20px] font-medium rounded-[4px] mt-4">
              退改签和产品说明
            </button>
          </div>
        </div>

        {/* 3 已购/赠送服务 */}
        <div className="bg-white mb-2 overflow-hidden relative">
          <div className="font-bold text-[19px] leading-[20px] text-[#111] p-4">
            已购 / 赠送服务
          </div>
          <div className="flex flex-col gap-2 px-4 pb-2">
            {/* 3.1 服务卡片 */}
            <div className="p-3 rounded-[4px] bg-[#f8fafd]">
              <div className="flex items-center justify-between mb-3 text-[13px]">
                <span className="text-[#333]">延误安心包</span>
                <div className="text-[#999] flex items-center">
                  <span>详情/退订</span>
                  <svg
                    className="w-[14px] h-4 text-[#aaa] "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex w-full flex-nowrap gap-2 overflow-x-auto">
                {serviceList.length > 0 &&
                  serviceList.map((item) => (
                    <button
                      className="border border-gray-300 text-[13px] text-[#0f4999] p-4 py-2 rounded-md text-nowrap"
                      key={item.name}
                    >
                      {item.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* 3.2 优惠券 */}
            <div className="flex items-center justify-between p-3 rounded-[4px] bg-[#f8fafd]">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[#333] text-[13px]">
                  <div>优惠券</div>
                  <div className="border border-[#00b780] text-[#00b780] h-[16px] rounded-[2px] px-[2px] text-[13px] leading-[16px]">
                    赠
                  </div>
                </div>
                <span className="text-[10px] leading-[12px] text-[#999] mt-[2px]">
                  部分已退订
                </span>
              </div>

              <svg
                className="w-[14px] h-4 text-[#aaa] "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* 3.3 优惠券 */}
            <div className="flex items-center justify-between p-3 rounded-[4px] bg-[#f8fafd]">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[#333] text-[13px]">
                  <div>旅游专享券</div>
                </div>
                <span className="text-[10px] leading-[12px] text-[#999] mt-[2px]">
                  含租车券、门票券、一日游券
                </span>
              </div>

              <svg
                className="w-[14px] h-4 text-[#aaa] "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* 3.4 优惠券 */}
            <div className="flex items-center justify-between p-3 rounded-[4px] bg-[#f8fafd]">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[#333] text-[13px]">
                  <div>机场美食券</div>
                  <div className="border border-[#00b780] text-[#00b780] h-[16px] rounded-[2px] px-[2px] text-[13px] leading-[16px]">
                    赠
                  </div>
                </div>
                <span className="text-[10px] leading-[12px] text-[#999] mt-[2px]">
                  已退订
                </span>
              </div>

              <svg
                className="w-[14px] h-4 text-[#aaa] "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 4 出行信息 */}
        <div className="bg-white mb-2 overflow-hidden relative">
          <div className="font-bold text-[19px] leading-[20px] text-[#111] p-4">
            出行信息
          </div>
          <div className="h-[200px]"></div>
        </div>
        {/* 5 常见问题 */}
        <div className="bg-white mb-2 overflow-hidden relative">
          <div className="font-bold text-[19px] leading-[20px] text-[#111] p-4">
            常见问题
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div
        className="fixed bottom-0 bg-white left-0 right-0 h-[60px] px-4 py-4 flex items-center justify-between gap-2"
        style={{
          boxShadow: "rgba(17, 17, 17, 0.08) 0rem -0.04rem 0.1rem",
        }}
      >
        {btnList.map((item) => (
          <div
            className="text-sm rounded-[4px] flex-1 h-9 flex px-4 items-center justify-center font-bold text-[15px] text-white"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgb(0, 136, 246), rgb(0, 111, 246))",
            }}
            key={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
