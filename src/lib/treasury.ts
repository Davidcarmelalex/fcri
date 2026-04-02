export const treasuryConfig = {
  primarySupportEmail: "support@fcri.science",
  walletReferences: [
    {
      label: "USDT (ERC20 / EVM)",
      address: process.env.NEXT_PUBLIC_FCRI_USDT_EVM || "USDT EVM wallet pending final treasury cutover",
      note: "Primary support rail for institute contributions on Ethereum-compatible networks.",
    },
    {
      label: "USDC (ERC20 / EVM)",
      address: process.env.NEXT_PUBLIC_FCRI_USDC_EVM || "USDC EVM wallet pending final treasury cutover",
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
