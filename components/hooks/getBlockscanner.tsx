function getBlockscanner(chainId: any) {
  switch (chainId) {
    case "1":
      return `https://etherscan.io/token/`;
    case '5':
      return `https://goerli.etherscan.io/token/`;
    case "137":
      return `https://polygonscan.com/token/`;

    case "80001":
      return `https://mumbai.polygonscan.com/token/`;

    case "42161":
      return `https://arbiscan.io/address/`;

    case "421611":
      return `https://goerli.arbiscan.io/address/`

    case "10":
      return `https://optimistic.etherscan.io/address/`;

    case "420":
      return `https://goerli-optimistic.etherscan.io/address/`
  }
}

export default getBlockscanner;