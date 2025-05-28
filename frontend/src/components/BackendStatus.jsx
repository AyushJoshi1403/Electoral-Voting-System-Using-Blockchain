import React from 'react';
import { Box, Typography, Chip, Paper, Grid } from '@mui/material';
import { useBlockchain } from '../context/BlockchainContext';

export default function BackendStatus() {
  const { 
    backendConnected, 
    backendElections, 
    backendCandidates, 
    backendVoters,
    loadBackendData 
  } = useBlockchain();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backend Status
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Chip 
            label={backendConnected ? "Connected" : "Disconnected"}
            color={backendConnected ? "success" : "error"}
            variant="outlined"
          />
        </Grid>
        
        {backendConnected && (
          <>
            <Grid item>
              <Typography variant="body2">
                Elections: {backendElections.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                Candidates: {backendCandidates.length}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                Voters: {backendVoters.length}
              </Typography>
            </Grid>
          </>
        )}
        
        <Grid item>
          <Chip 
            label="Refresh Data"
            onClick={loadBackendData}
            color="primary"
            variant="outlined"
            size="small"
            clickable
          />
        </Grid>
      </Grid>
      
      {!backendConnected && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Make sure your backend server is running on http://localhost:5000
        </Typography>
      )}
    </Paper>
  );
}