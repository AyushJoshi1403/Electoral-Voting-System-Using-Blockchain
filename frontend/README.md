# Electoral Voting System Using Blockchain

A secure electoral voting system built with React v19 and Ethereum blockchain technology.

## Features

- **Blockchain-based Voting**: Secure, transparent, and tamper-proof voting system
- **Smart Contract**: Ethereum smart contract handles the election logic
- **Admin Panel**: Add candidates, register voters, start and end voting periods
- **Voter Interface**: Easy-to-use interface for casting votes
- **Real-time Results**: View election results and statistics

## Tech Stack

- **Frontend**: React v19, Material-UI
- **Blockchain Interaction**: ethers.js
- **Smart Contract Development**: Solidity, Hardhat
- **Routing**: React Router

## Prerequisites

- Node.js v18+
- MetaMask browser extension or any Ethereum wallet
- Git

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile Smart Contracts

```bash
npx hardhat compile
```

### 3. Start Local Blockchain

Open a new terminal and run:

```bash
npx hardhat node
```

This will start a local Ethereum blockchain with several pre-funded accounts for testing.

### 4. Deploy Smart Contract

In a separate terminal:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Note the contract address that's displayed after deployment.

### 5. Start the Frontend Development Server

```bash
npm run dev
```

### 6. Set Up MetaMask

- Add the Hardhat local network to MetaMask:
  - Network Name: Hardhat
  - RPC URL: http://127.0.0.1:8545
  - Chain ID: 1337
  - Currency Symbol: ETH
- Import one of the accounts provided by Hardhat using its private key

## Usage

### Admin Functions

- **Add Candidates**: Enter candidate details including name, party, and manifesto
- **Register Voters**: Add wallet addresses that are allowed to vote
- **Start Voting**: Begin the voting period with a specified duration
- **End Voting**: Conclude the voting period manually

### Voter Functions

- **Cast Vote**: Select a candidate and submit your vote
- **View Results**: See the election results after voting concludes

## Smart Contract Details

The `VotingSystem.sol` contract includes:

- Candidate and voter management
- Voting functionality with checks to prevent double-voting
- Time-based voting period controls
- Results calculation and winner determination

## Development Notes

- React v19 is used for the frontend
- The application uses Vite for faster development and builds
- Material-UI provides the component library for the interface
- Component structure follows React best practices with reusable components
