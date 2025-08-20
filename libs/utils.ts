import WalletConnectSignClient from "@walletconnect/sign-client";

export const getAccountAddress = async (
  client: WalletConnectSignClient,
  topic: string
) => {
  const session = client.session.get(topic);
  const fullAccountAddress = session.namespaces.eip155.accounts[0];
  const address = fullAccountAddress.split(":")[2];
  return address;
};
