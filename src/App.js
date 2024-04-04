import React, { useState } from 'react';
import { Container, Typography, TextField, MenuItem, FormControlLabel, Checkbox, RadioGroup, Radio, Button, Box } from '@mui/material';

const projectTypes = [
  "Tunnel", "Hospital", "Office", "Residential", 
  "School", "Shopping Center", "Manufacturing", 
  "Parking Lot", "Logistic Center", "Warehouse", 
  "Terrain"
];

const calculateScanningSpeed = (projectType) => {
  const scanningSpeeds = {
    "Tunnel": 500, "Hospital": 100, "Office": 1000, "Residential": 1000,
    "School": 1000, "Shopping Center": 2000, "Manufacturing": 3000,
    "Parking Lot": 3000, "Logistic Center": 3000, "Warehouse": 3500,
    "Terrain": 3500
  };
  return scanningSpeeds[projectType] || 0;
};

const ScanningCalculatorApp = () => {
  const [projectType, setProjectType] = useState('Tunnel');
  const [mep, setMep] = useState(false);
  const [georeferencing, setGeoreferencing] = useState(false);
  const [teamMembers, setTeamMembers] = useState('1');
  const [travelDistance, setTravelDistance] = useState(0);
  const [facade, setFacade] = useState(false);
  const [squareMeters, setSquareMeters] = useState(0);
  const [result, setResult] = useState("");

  const calculate = () => {
    const scanningSpeed = calculateScanningSpeed(projectType);
    const mepFactor = mep ? 1.1 : 1;
    const georeferencingHours = georeferencing ? 1 : 0;
    const teamMembersFactor = teamMembers === '1' ? 1.1 : 1;
    const facadeHours = facade ? 1 : 0;
  
    const scanningHours = squareMeters / scanningSpeed * mepFactor * teamMembersFactor + georeferencingHours + parseFloat(travelDistance) + facadeHours;
    const totalPanoramas = Math.round((squareMeters / 8) / 2);
    const panoramaCost = totalPanoramas * (8875 / 25000);
    const processingCost = squareMeters * 10 * 9550 / 10000000 * 1.5;
    const storageCapacity = squareMeters * 0.005;
    const storageCost = storageCapacity * 9000 / 3200;
    const proposedScanningTime = calculateProposedTime(scanningHours);
    const scanningWorkersCost = calculateScanningWorkersCost(proposedScanningTime, teamMembers);
    const totalScanningCost = panoramaCost + storageCost + processingCost + scanningWorkersCost;
    
    const results = `
      Actual Scanning Time (hours): ${scanningHours.toFixed(2)}
      Proposed Scanning Time (days): ${proposedScanningTime}
      Panoramas: ${totalPanoramas}
      Panorama Cost (CHF): ${panoramaCost.toFixed(2)}
      Processing Cost (CHF): ${processingCost.toFixed(2)}
      Storage Capacity Cost (CHF): ${storageCost.toFixed(2)}
      Scanning Workers Cost (CHF): ${scanningWorkersCost.toFixed(2)}
      Total Scanning Cost (CHF): ${totalScanningCost.toFixed(2)}
    `;
  
    setResult(results);
  };
  
  const calculateScanningWorkersCost = (proposedScanningTime, teamMembers) => {
    const scanningDaysToCostMapping = {
      "0.5 day": 4, "1 day": 8, "1.5 days": 12, "2 days": 16, "2.5 days": 20,
      "3 days": 24, "3.5 days": 28, "4 days": 32, "4.5 days": 36, "5 days": 40
    };
    const costPerDay = scanningDaysToCostMapping[proposedScanningTime] || 0;
    return costPerDay * 135 * parseInt(teamMembers);
  };

  const calculateProposedTime = (hours) => {
    const thresholds = [4.5, 9, 13.5, 18, 22.5, 27, 31.5, 36, 40.5, 45];
    const days = ["0.5 day", "1 day", "1.5 days", "2 days", "2.5 days", "3 days", "3.5 days", "4 days", "4.5 days", "5 days"];
    for (let i = 0; i < thresholds.length; i++) {
      if (hours <= thresholds[i]) {
        return days[i];
      }
    }
    return "Over 5 days";
  };

  return (
    <Container maxWidth="sm">
      <Typography style={{marginTop: 10}} align='center' variant="h4" component="h1" gutterBottom>
        Scanning Calculator
      </Typography>
      <TextField
        select
        label="Project Type"
        value={projectType}
        onChange={(e) => setProjectType(e.target.value)}
        fullWidth
        margin="normal"
      >
        {projectTypes.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <FormControlLabel
        control={<Checkbox checked={mep} onChange={(e) => setMep(e.target.checked)} />}
        label="MEP Information"
      />
      <FormControlLabel
        control={<Checkbox checked={georeferencing} onChange={(e) => setGeoreferencing(e.target.checked)} />}
        label="Georeferencing"
      />
      <RadioGroup
        row
        value={teamMembers}
        onChange={(e) => setTeamMembers(e.target.value)}
      >
        <FormControlLabel value="1" control={<Radio />} label="One Team Member" />
        <FormControlLabel value="2" control={<Radio />} label="Two Team Members" />
      </RadioGroup>
      <TextField
        label="Travel Distance (hours)"
        type="number"
        value={travelDistance}
        onChange={(e) => setTravelDistance(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={<Checkbox checked={facade} onChange={(e) => setFacade(e.target.checked)} />}
        label="Facade Scanning"
      />
      <TextField
        label="Square Meters"
        type="number"
        value={squareMeters}
        onChange={(e) => setSquareMeters(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={calculate}>
          Calculate
        </Button>
      </Box>
      {result && (
        <Typography variant="body1" style={{ whiteSpace: "pre-line" }} mt={2}>
          {result}
        </Typography>
      )}
    </Container>
  );
};

export default ScanningCalculatorApp;
