// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ElectionSystem {
    // Structure to represent a candidate
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    // Structure to represent an election
    struct Election {
        uint256 id;
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        uint256 candidateCount;
        mapping(address => bool) hasVoted;
    }

    // Mapping of election ID to election
    mapping(uint256 => Election) public elections;
    // Made private to enforce using the getter
    uint256 private _electionCount;

    address public immutable admin;
    
    // Events
    event ElectionCreated(uint256 indexed electionId, string name, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 candidateId, string name, string party);
    event VoteCast(uint256 indexed electionId, uint256 candidateId, address voter);
    event ElectionToggled(uint256 indexed electionId, bool isActive);

    constructor() {
        admin = msg.sender;
        _electionCount = 0;
    }

    // Getter function for election count
    function getElectionCount() public view returns (uint256) {
        return _electionCount;
    }

    // Modifier to restrict functions to admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Function to check if an address is admin
    function isAdmin(address _address) public view returns (bool) {
        return _address == admin;
    }

    // Create a new election
    function createElection(
        string memory _name,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyAdmin {
        require(_startTime < _endTime, "End time must be after start time");
        
        uint256 electionId = _electionCount++;
        Election storage newElection = elections[electionId];
        newElection.id = electionId;
        newElection.name = _name;
        newElection.description = _description;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.isActive = false;
        newElection.candidateCount = 0;
        
        emit ElectionCreated(electionId, _name, _startTime, _endTime);
    }

    // Add a candidate to an election
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _party
    ) public onlyAdmin {
        require(_electionId < _electionCount, "Election does not exist");
        require(!isElectionActive(_electionId), "Cannot add candidate to active election");
        
        Election storage election = elections[_electionId];
        uint256 candidateId = election.candidateCount++;
        
        Candidate storage newCandidate = election.candidates[candidateId];
        newCandidate.id = candidateId;
        newCandidate.name = _name;
        newCandidate.party = _party;
        newCandidate.voteCount = 0;
        
        emit CandidateAdded(_electionId, candidateId, _name, _party);
    }

    // Toggle election active status
    function toggleElection(uint256 _electionId, bool _isActive) public onlyAdmin {
        require(_electionId < _electionCount, "Election does not exist");
        
        Election storage election = elections[_electionId];
        election.isActive = _isActive;
        
        emit ElectionToggled(_electionId, _isActive);
    }

    // Cast a vote
    function castVote(uint256 _electionId, uint256 _candidateId) public {
        require(_electionId < _electionCount, "Election does not exist");
        require(isElectionActive(_electionId), "Election is not active");
        require(block.timestamp >= elections[_electionId].startTime, "Election has not started yet");
        require(block.timestamp <= elections[_electionId].endTime, "Election has ended");
        require(!elections[_electionId].hasVoted[msg.sender], "You have already voted in this election");
        require(_candidateId < elections[_electionId].candidateCount, "Candidate does not exist");
        
        elections[_electionId].hasVoted[msg.sender] = true;
        elections[_electionId].candidates[_candidateId].voteCount++;
        
        emit VoteCast(_electionId, _candidateId, msg.sender);
    }

    // Get election details
    function getElectionDetails(uint256 _electionId) public view returns (
        string memory name,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 candidateCount
    ) {
        require(_electionId < _electionCount, "Election does not exist");
        
        Election storage election = elections[_electionId];
        return (
            election.name,
            election.description,
            election.startTime,
            election.endTime,
            election.isActive,
            election.candidateCount
        );
    }

    // Get candidate details
    function getCandidateDetails(uint256 _electionId, uint256 _candidateId) public view returns (
        string memory name,
        string memory party,
        uint256 voteCount
    ) {
        require(_electionId < _electionCount, "Election does not exist");
        require(_candidateId < elections[_electionId].candidateCount, "Candidate does not exist");
        
        Candidate storage candidate = elections[_electionId].candidates[_candidateId];
        return (
            candidate.name,
            candidate.party,
            candidate.voteCount
        );
    }

    // Check if voter has already voted
    function hasVoted(uint256 _electionId, address _voter) public view returns (bool) {
        require(_electionId < _electionCount, "Election does not exist");
        return elections[_electionId].hasVoted[_voter];
    }

    // Check if election is active
    function isElectionActive(uint256 _electionId) public view returns (bool) {
        require(_electionId < _electionCount, "Election does not exist");
        return elections[_electionId].isActive;
    }

    // Get all candidates for an election
    function getCandidateCount(uint256 _electionId) public view returns (uint256) {
        require(_electionId < _electionCount, "Election does not exist");
        return elections[_electionId].candidateCount;
    }
}