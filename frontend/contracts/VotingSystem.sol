// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VotingSystem
 * @dev A smart contract for an electoral voting system
 */
contract VotingSystem {
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string manifesto;
        uint256 voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
    }

    address public admin;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    bool public votingOpen;
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    string public electionName;

    event VoterRegistered(address indexed voterAddress);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier votingIsOpen() {
        require(votingOpen, "Voting is not open");
        require(block.timestamp >= votingStartTime, "Voting has not started yet");
        require(block.timestamp <= votingEndTime, "Voting has ended");
        _;
    }

    constructor(string memory _electionName) {
        admin = msg.sender;
        electionName = _electionName;
        votingOpen = false;
    }

    // Admin functions
    function addCandidate(string memory _name, string memory _party, string memory _manifesto) public onlyAdmin {
        require(!votingOpen, "Cannot add candidates during voting");
        uint256 candidateId = candidates.length;
        candidates.push(Candidate({
            id: candidateId,
            name: _name,
            party: _party,
            manifesto: _manifesto,
            voteCount: 0
        }));
        emit CandidateAdded(candidateId, _name);
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedCandidateId: 0
        });
        emit VoterRegistered(_voter);
    }

    function startVoting(uint256 _durationInMinutes) public onlyAdmin {
        require(!votingOpen, "Voting is already open");
        require(candidates.length > 0, "No candidates available");
        
        votingOpen = true;
        votingStartTime = block.timestamp;
        votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);
        
        emit VotingStarted(votingStartTime, votingEndTime);
    }

    function endVoting() public onlyAdmin {
        require(votingOpen, "Voting is not open");
        votingOpen = false;
        emit VotingEnded(block.timestamp);
    }

    // Voter functions
    function vote(uint256 _candidateId) public votingIsOpen {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        require(_candidateId < candidates.length, "Invalid candidate ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount += 1;

        emit VoteCast(msg.sender, _candidateId);
    }

    // View functions
    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 _candidateId) public view 
        returns (uint256 id, string memory name, string memory party, string memory manifesto, uint256 voteCount) {
        require(_candidateId < candidates.length, "Invalid candidate ID");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.party, candidate.manifesto, candidate.voteCount);
    }

    function getVoterStatus(address _voter) public view 
        returns (bool isRegistered, bool hasVoted, uint256 votedCandidateId) {
        Voter memory voter = voters[_voter];
        return (voter.isRegistered, voter.hasVoted, voter.votedCandidateId);
    }

    function getWinner() public view returns (uint256 winnerId, string memory winnerName, uint256 winnerVotes) {
        require(!votingOpen || block.timestamp > votingEndTime, "Voting is still ongoing");
        require(candidates.length > 0, "No candidates available");
        
        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;
        
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }
        
        return (winningCandidateId, candidates[winningCandidateId].name, winningVoteCount);
    }

    function getVotingStatus() public view 
        returns (bool isOpen, uint256 startTime, uint256 endTime, uint256 remainingTime) {
        uint256 remaining = 0;
        if (votingOpen && block.timestamp < votingEndTime) {
            remaining = votingEndTime - block.timestamp;
        }
        return (votingOpen, votingStartTime, votingEndTime, remaining);
    }
}
