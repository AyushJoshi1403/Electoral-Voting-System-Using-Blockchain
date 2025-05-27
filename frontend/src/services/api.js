const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Election endpoints
  async getElections() {
    return this.request('/elections');
  }

  async createElection(electionData) {
    return this.request('/elections', {
      method: 'POST',
      body: JSON.stringify(electionData),
    });
  }

  async updateElection(id, electionData) {
    return this.request(`/elections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(electionData),
    });
  }

  // Candidate endpoints
  async getCandidates(electionId) {
    return this.request(`/candidates/election/${electionId}`);
  }

  async createCandidate(candidateData) {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  }

  // Voter endpoints
  async registerVoter(voterData) {
    return this.request('/voters', {
      method: 'POST',
      body: JSON.stringify(voterData),
    });
  }

  async getRegisteredVoters() {
    return this.request('/voters');
  }

  // Vote endpoints
  async recordVote(voteData) {
    return this.request('/votes', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  }
}

export default new ApiService();