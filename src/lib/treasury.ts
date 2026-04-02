const DEFAULT_EVM_TREASURY = "0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6";

export const treasuryConfig = {
  primarySupportEmail: "support@fcri.science",
  walletReferences: [
    {
      label: "USDT (ERC20 / EVM)",
      address: process.env.NEXT_PUBLIC_FCRI_USDT_EVM || DEFAULT_EVM_TREASURY,
      note: "Primary support rail for institute contributions on Ethereum-compatible networks.",
    },
    {
      label: "USDC (ERC20 / EVM)",
      address: process.env.NEXT_PUBLIC_FCRI_USDC_EVM || DEFAULT_EVM_TREASURY,
      note: "Alternative stablecoin rail for contributors sending through EVM-compatible networks.",
    },
  ],
  allocation: [
    {
      title: "Research output",
      body: "Working papers, editorial quality, publication continuity, and research operations.",
    },
    {
      title: "Programs and fellowships",
      body: "Course development, fellowship pathways, seminars, and knowledge transmission.",
    },
    {
      title: "Institutional infrastructure",
      body: "Design, hosting, archives, legal/operational continuity, and systems that keep the institute live.",
    },
  ],
};
