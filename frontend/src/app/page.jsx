"use client"
// pages/index.tsx
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import ElectionSystem from "../artifacts/contracts/ElectionSystem.json"
import { Toaster, toast } from "react-hot-toast"

const CONTRACT_ADDRESS = "npx hardhat run scripts/deploy.js --network localhost"

export default function Home() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [newElection, setNewElection] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  })
  const [newCandidate, setNewCandidate] = useState({
    electionId: 0,
    name: "",
    party: ""
  })
  const [selectedElection, setSelectedElection] = useState(null)
  const [candidates, setCandidates] = useState([])

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const account = await signer.getAddress()
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ElectionSystem.abi,
          signer
        )

        setProvider(provider)
        setSigner(signer)
        setContract(contract)
        setAccount(account)

        // Check if user is admin
        const admin = await contract.admin()
        setIsAdmin(admin.toLowerCase() === account.toLowerCase())

        loadElections(contract)
      } else {
        toast.error("Please install MetaMask to use this application")
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      toast.error("Failed to connect wallet")
    }
  }

  // Load all elections
  const loadElections = async contractInstance => {
    try {
      setLoading(true)
      const count = await contractInstance.electionCount()
      const electionArray = []

      for (let i = 0; i < count; i++) {
        const details = await contractInstance.getElectionDetails(i)
        electionArray.push({
          id: i,
          name: details.name,
          description: details.description,
          startTime: new Date(details.startTime * 1000).toLocaleString(),
          endTime: new Date(details.endTime * 1000).toLocaleString(),
          isActive: details.isActive,
          candidateCount: details.candidateCount
        })
      }

      setElections(electionArray)
      setLoading(false)
    } catch (error) {
      console.error("Error loading elections:", error)
      toast.error("Failed to load elections")
      setLoading(false)
    }
  }

  // Create a new election
  const createElection = async e => {
    e.preventDefault()
    try {
      if (!contract) return

      const startTime = Math.floor(
        new Date(newElection.startDate).getTime() / 1000
      )
      const endTime = Math.floor(new Date(newElection.endDate).getTime() / 1000)

      const tx = await contract.createElection(
        newElection.name,
        newElection.description,
        startTime,
        endTime
      )

      toast.loading("Creating election...")
      await tx.wait()
      toast.dismiss()
      toast.success("Election created successfully")

      setNewElection({
        name: "",
        description: "",
        startDate: "",
        endDate: ""
      })

      loadElections(contract)
    } catch (error) {
      console.error("Error creating election:", error)
      toast.error("Failed to create election")
    }
  }

  // Add a candidate to an election
  const addCandidate = async e => {
    e.preventDefault()
    try {
      if (!contract) return

      const tx = await contract.addCandidate(
        newCandidate.electionId,
        newCandidate.name,
        newCandidate.party
      )

      toast.loading("Adding candidate...")
      await tx.wait()
      toast.dismiss()
      toast.success("Candidate added successfully")

      setNewCandidate({
        electionId: 0,
        name: "",
        party: ""
      })

      if (selectedElection !== null) {
        loadCandidates(selectedElection)
      }

      loadElections(contract)
    } catch (error) {
      console.error("Error adding candidate:", error)
      toast.error("Failed to add candidate")
    }
  }

  // Toggle election active status
  const toggleElection = async (electionId, isActive) => {
    try {
      if (!contract) return

      const tx = await contract.toggleElection(electionId, !isActive)

      toast.loading(`${isActive ? "Deactivating" : "Activating"} election...`)
      await tx.wait()
      toast.dismiss()
      toast.success(
        `Election ${isActive ? "deactivated" : "activated"} successfully`
      )

      loadElections(contract)
    } catch (error) {
      console.error("Error toggling election:", error)
      toast.error("Failed to toggle election status")
    }
  }

  // Load candidates for a specific election
  const loadCandidates = async electionId => {
    try {
      if (!contract) return

      setSelectedElection(electionId)
      const candidateCount = await contract.getCandidateCount(electionId)
      const candidateArray = []

      for (let i = 0; i < candidateCount; i++) {
        const details = await contract.getCandidateDetails(electionId, i)
        candidateArray.push({
          id: i,
          name: details.name,
          party: details.party,
          voteCount: details.voteCount.toString()
        })
      }

      setCandidates(candidateArray)
    } catch (error) {
      console.error("Error loading candidates:", error)
      toast.error("Failed to load candidates")
    }
  }

  // Cast a vote
  const castVote = async (electionId, candidateId) => {
    try {
      if (!contract) return

      // Check if user has already voted
      const hasVoted = await contract.hasVoted(electionId, account)
      if (hasVoted) {
        toast.error("You have already voted in this election")
        return
      }

      const tx = await contract.castVote(electionId, candidateId)

      toast.loading("Casting vote...")
      await tx.wait()
      toast.dismiss()
      toast.success("Vote cast successfully")

      loadCandidates(electionId)
    } catch (error) {
      console.error("Error casting vote:", error)
      toast.error("Failed to cast vote")
    }
  }

  useEffect(() => {
    connectWallet()

    // Handle account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Toaster position="top-right" />

          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">
                Blockchain Election System
              </h1>
              {account ? (
                <p className="mt-2">
                  Connected: {account.substring(0, 6)}...
                  {account.substring(account.length - 4)}
                </p>
              ) : (
                <button
                  onClick={connectWallet}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Connect Wallet
                </button>
              )}
            </div>

            {isAdmin && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-2">
                    Create New Election
                  </h3>
                  <form onSubmit={createElection} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newElection.name}
                        onChange={e =>
                          setNewElection({
                            ...newElection,
                            name: e.target.value
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={newElection.description}
                        onChange={e =>
                          setNewElection({
                            ...newElection,
                            description: e.target.value
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        value={newElection.startDate}
                        onChange={e =>
                          setNewElection({
                            ...newElection,
                            startDate: e.target.value
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={newElection.endDate}
                        onChange={e =>
                          setNewElection({
                            ...newElection,
                            endDate: e.target.value
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Create Election
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Add Candidate</h3>
                  <form onSubmit={addCandidate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Election
                      </label>
                      <select
                        value={newCandidate.electionId}
                        onChange={e =>
                          setNewCandidate({
                            ...newCandidate,
                            electionId: parseInt(e.target.value)
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      >
                        <option value="">Select Election</option>
                        {elections.map(election => (
                          <option key={election.id} value={election.id}>
                            {election.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newCandidate.name}
                        onChange={e =>
                          setNewCandidate({
                            ...newCandidate,
                            name: e.target.value
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Party
                      </label>
                      <input
                        type="text"
                        value={newCandidate.party}
                        onChange={e =>
                          setNewCandidate({
                            ...newCandidate,
                            party: e.target.value
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Candidate
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Elections</h2>
              {loading ? (
                <p>Loading elections...</p>
              ) : elections.length === 0 ? (
                <p>No elections available</p>
              ) : (
                <div className="space-y-4">
                  {elections.map(election => (
                    <div key={election.id} className="border p-4 rounded-md">
                      <h3 className="text-lg font-medium">{election.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {election.description}
                      </p>
                      <div className="mt-2 text-sm">
                        <p>Start: {election.startTime}</p>
                        <p>End: {election.endTime}</p>
                        <p>
                          Status: {election.isActive ? "Active" : "Inactive"}
                        </p>
                        <p>Candidates: {election.candidateCount}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => loadCandidates(election.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          View Candidates
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              toggleElection(election.id, election.isActive)
                            }
                            className={`${
                              election.isActive
                                ? "bg-red-500 hover:bg-red-700"
                                : "bg-green-500 hover:bg-green-700"
                            } text-white font-bold py-1 px-3 rounded text-sm`}
                          >
                            {election.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedElection !== null && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                  Candidates for{" "}
                  {elections.find(e => e.id === selectedElection)?.name}
                </h2>
                {candidates.length === 0 ? (
                  <p>No candidates available</p>
                ) : (
                  <div className="space-y-4">
                    {candidates.map(candidate => (
                      <div key={candidate.id} className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Party: {candidate.party}
                        </p>
                        <p className="text-sm">Votes: {candidate.voteCount}</p>
                        <button
                          onClick={() =>
                            castVote(selectedElection, candidate.id)
                          }
                          className="mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-sm"
                          disabled={
                            !elections.find(e => e.id === selectedElection)
                              ?.isActive
                          }
                        >
                          Vote
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
