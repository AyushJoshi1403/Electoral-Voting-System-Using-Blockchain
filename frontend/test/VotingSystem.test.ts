import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingSystem } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("VotingSystem", function () {
  let votingSystem: VotingSystem;
  let admin: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;
  let nonVoter: HardhatEthersSigner;
  const electionName = "Test Election";
  
  beforeEach(async function() {
    // Get signers from hardhat
    [admin, voter1, voter2, nonVoter] = await ethers.getSigners();
    
    // Deploy the contract
    const VotingSystemFactory = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystemFactory.deploy(electionName) as VotingSystem;
    await votingSystem.waitForDeployment();
    
    // Add some candidates
    await votingSystem.addCandidate("Candidate 1", "Party A", "Manifesto A");
    await votingSystem.addCandidate("Candidate 2", "Party B", "Manifesto B");
    
    // Register voters
    await votingSystem.registerVoter(voter1.address);
    await votingSystem.registerVoter(voter2.address);
  });
  
  describe("Deployment", function() {
    it("Should set the right admin", async function() {
      expect(await votingSystem.admin()).to.equal(admin.address);
    });
    
    it("Should set the correct election name", async function() {
      expect(await votingSystem.electionName()).to.equal(electionName);
    });
    
    it("Should start with voting closed", async function() {
      const [isOpen] = await votingSystem.getVotingStatus();
      expect(isOpen).to.be.false;
    });
  });
  
  describe("Candidate management", function() {
    it("Should add candidates correctly", async function() {
      const [id, name, party, manifesto] = await votingSystem.getCandidate(0);
      expect(id).to.equal(0);
      expect(name).to.equal("Candidate 1");
      expect(party).to.equal("Party A");
      expect(manifesto).to.equal("Manifesto A");
    });
    
    it("Should return the correct candidate count", async function() {
      expect(await votingSystem.getCandidatesCount()).to.equal(2);
    });
    
    it("Should prevent non-admin from adding candidates", async function() {
      await expect(
        votingSystem.connect(voter1).addCandidate("Unauthorized", "Party", "Manifesto")
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });
  
  describe("Voter registration", function() {
    it("Should register voters correctly", async function() {
      const [isRegistered, hasVoted] = await votingSystem.getVoterStatus(voter1.address);
      expect(isRegistered).to.be.true;
      expect(hasVoted).to.be.false;
    });
    
    it("Should prevent registering a voter twice", async function() {
      await expect(
        votingSystem.registerVoter(voter1.address)
      ).to.be.revertedWith("Voter already registered");
    });
    
    it("Should prevent non-admin from registering voters", async function() {
      await expect(
        votingSystem.connect(voter1).registerVoter(nonVoter.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });
  
  describe("Voting Process", function() {
    beforeEach(async function() {
      // Start voting with 30 minutes duration
      await votingSystem.startVoting(30);
    });
    
    it("Should allow registered voters to vote", async function() {
      await votingSystem.connect(voter1).vote(0);
      const [isRegistered, hasVoted, candidateId] = await votingSystem.getVoterStatus(voter1.address);
      expect(isRegistered).to.be.true;
      expect(hasVoted).to.be.true;
      expect(candidateId).to.equal(0);
    });
    
    it("Should prevent unregistered voters from voting", async function() {
      await expect(
        votingSystem.connect(nonVoter).vote(0)
      ).to.be.revertedWith("Voter is not registered");
    });
    
    it("Should prevent double voting", async function() {
      await votingSystem.connect(voter1).vote(0);
      await expect(
        votingSystem.connect(voter1).vote(1)
      ).to.be.revertedWith("Voter has already voted");
    });
    
    it("Should increment candidate vote count", async function() {
      await votingSystem.connect(voter1).vote(0);
      const [,,,,voteCount] = await votingSystem.getCandidate(0);
      expect(voteCount).to.equal(1);
    });
  });
  
  describe("Election management", function() {
    it("Should allow admin to start voting", async function() {
      await votingSystem.startVoting(30);
      const [isOpen] = await votingSystem.getVotingStatus();
      expect(isOpen).to.be.true;
    });
    
    it("Should prevent non-admin from starting voting", async function() {
      await expect(
        votingSystem.connect(voter1).startVoting(30)
      ).to.be.revertedWith("Only admin can perform this action");
    });
    
    it("Should allow admin to end voting", async function() {
      await votingSystem.startVoting(30);
      await votingSystem.endVoting();
      const [isOpen] = await votingSystem.getVotingStatus();
      expect(isOpen).to.be.false;
    });
    
    it("Should prevent non-admin from ending voting", async function() {
      await votingSystem.startVoting(30);
      await expect(
        votingSystem.connect(voter1).endVoting()
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });
  
  describe("Results calculation", function() {
    beforeEach(async function() {
      await votingSystem.startVoting(30);
      await votingSystem.connect(voter1).vote(0);
      await votingSystem.connect(voter2).vote(0);
      await votingSystem.endVoting();
    });
    
    it("Should correctly determine the winner", async function() {
      const [winnerId, winnerName, winnerVotes] = await votingSystem.getWinner();
      expect(winnerId).to.equal(0);
      expect(winnerName).to.equal("Candidate 1");
      expect(winnerVotes).to.equal(2);
    });
  });
});
