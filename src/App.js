import React, {useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Box, Modal } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Logo from './logo.svg';
import html2canvas from 'html2canvas'; // Ensure you have installed html2canvas
import TextInput from './TextInput';

const projectTypes = [
  "Tunnel", "Hospital", "Office", "Residential", 
  "School", "Shopping Center", "Manufacturing", 
  "Parking Lot", "Logistic Center", "Warehouse", 
  "Terrain"
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 700 ,
  backgroundColor: 'white',
  boxShadow: 24,
  padding: '20px 20px',
  overflowY: 'scroll'
};


  const Header = () => (
  <Box
    className='capture-section'
    component="img"
    sx={{
      height: 150,
      width: '100%',
      objectFit: 'cover',
    }}
    alt="Scanning Project Header"
    src={Logo}
  />
  );

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
  const [mep, setMep] = useState('No');
  const [georeferencing, setGeoreferencing] = useState('No');
  const [teamMembers, setTeamMembers] = useState('1');
  const [travelDistance, setTravelDistance] = useState(0);
  const [facade, setFacade] = useState('No');
  const [squareMeters, setSquareMeters] = useState(0);
  const [result, setResult] = useState("");
  const [totalResult, setTotalResult] = useState("")
  const [projectId, setProjectId] = useState("")
  const [projectName, setProjectName] = useState("")
  const [open, setOpen] = useState(false)
  const [tunnelSpeed, setTunnelSpeed] = useState(500);
  const [hospitalSpeed, setHospitalSpeed] = useState(100);
  const [officeSpeed, setOfficeSpeed] = useState(1000);
  const [residentialSpeed, setResidentialSpeed] = useState(1000);
  const [schoolSpeed, setSchoolSpeed] = useState(1000);
  const [shoppingCenterSpeed, setShoppingCenterSpeed] = useState(2000);
  const [manufacturingSpeed, setManufacturingSpeed] = useState(3000);
  const [parkingLotSpeed, setParkingLotSpeed] = useState(3000);
  const [logisticCenterSpeed, setLogisticCenterSpeed] = useState(3000);
  const [warehouseSpeed, setWarehouseSpeed] = useState(3500);
  const [terrainSpeed, setTerrainSpeed] = useState(3500);
  
  

  const calculate = () => {
    setResult("")
    const scanningSpeed = calculateScanningSpeed(projectType);
    const mepFactor = mep === 'Yes' ? 1.1 : 1;
    const georeferencingHours = georeferencing === 'Yes' ? 1 : 0;
    const teamMembersFactor = teamMembers === '1' ? 1.1 : 1;
    const facadeHours = facade === 'Yes' ? 1 : 0;
  
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
      ID: ${projectId}
      Project Name: ${projectName}

      Actual Scanning Time (hours): ${scanningHours.toFixed(2)}
      Proposed Scanning Time (days): ${proposedScanningTime}
      Panoramas: ${totalPanoramas}
      Panorama Cost (CHF): ${panoramaCost.toFixed(2)}
      Processing Cost (CHF): ${processingCost.toFixed(2)}
      Storage Capacity Cost (CHF): ${storageCost.toFixed(2)}
      Scanning Workers Cost (CHF): ${scanningWorkersCost.toFixed(2)}
    `;

    const totalResult = `Total Scanning Cost (CHF): ${totalScanningCost.toFixed(2)}`
  
    setResult(results);

    setTotalResult(totalResult)
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

const saveAsPng = () => {
  const elements = document.querySelectorAll('.capture-section');
  const canvases = [];

  const captureNextElement = (index) => {
    if (index < elements.length) {
      html2canvas(elements[index], {
        onclone: (clonedDocument) => {
          const clonedElements = clonedDocument.querySelectorAll('.capture-section');
          clonedElements.forEach(el => {
            el.style.color = 'black';
            el.style.padding = '0 20px';
          });
        }
      }).then((canvas) => {
        canvases.push(canvas);
        if (index < elements.length - 1) {
          captureNextElement(index + 1);
        } else {
          combineCanvases(canvases);
        }
      });
    }
  };

  const combineCanvases = (canvases) => {
    // Combine all canvases into one
    const combinedCanvas = document.createElement('canvas');
    const combinedContext = combinedCanvas.getContext('2d');
    
    let combinedHeight = 0;
    canvases.forEach((canvas) => {
      combinedHeight += canvas.height;
    });

    combinedCanvas.width = Math.max(...canvases.map(canvas => canvas.width));
    combinedCanvas.height = combinedHeight;

    let yOffset = 0;
    canvases.forEach((canvas) => {
      combinedContext.drawImage(canvas, 0, yOffset);
      yOffset += canvas.height;
    });

    // Save the combined canvas as PNG
    const image = combinedCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'FormResults.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Start the capture process
  captureNextElement(0);
};


  const printToTxt = () => {
    // Define the headers with example values for ID and Project Name
    const headerText = `ID: ${projectId}\nProject Name: ${projectName}\n`;

    // Table headers
    const tableHeaders = [
      'Actual Scanning Time',
      'Proposed Scanning Time',
      'Panoramas',
      'Panorama Cost',
      'Processing Cost',
      'Storage Capacity Cost',
      'Scanning Workers Cost',
      'Total Scanning Cost'
    ];

    // Assuming 'result' variable holds the results data as a string in the format provided
    // Split the results string by lines
    const lines = result.split('\n').map(line => line.trim());

    // Extract the values after the colon and trim whitespace
    const values = lines.map(line => {
      const match = line.match(/:\s*(.+)/);
      return match ? match[1].trim() : '';
    });

    // Join the values, trim the leading and trailing "|", and then combine with headers
    const valuesFilter = values.filter((v) => v)

    const tableValues = valuesFilter.join(' | ').replace(/^\|\s*|\s*\|$/g, '').trim();

    // Combine headers and values into a table format
    const table = `${headerText}${tableHeaders.join(' | ')}\n${tableValues}`;

    // Convert the table string to a Blob
    const blob = new Blob([table], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ScanningResultsTable.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const handleCleanData = () => {

    setProjectId("")
    setProjectName("")
    setProjectType('Tunnel');
    setMep('No');
    setGeoreferencing('No');
    setTeamMembers('1');
    setTravelDistance(0);
    setFacade('No');
    setSquareMeters(0);
    setResult("");
    setTotalResult("")
    setProjectId("")
    setProjectName("")

    window.scrollTo({top: 0})

  }

  return (
    <Container style={{marginBottom: 50, textDecorationColor: 'black', width: '100%'}} maxWidth="md">
      <Header/> {/* Use the Header component */}
      <h2 className='capture-section' style={{marginBottom: '20px'}}>
        <strong>BF Scanning Calculator</strong>
      </h2>
      <p className='capture-section' style={{marginBottom: '20px'}}>
        Welcome to our BIM Facility's Scanning Calculator! This tool is designed for our team to efficiently estimate scanning time and cost for capturing, processing, and storing data using our cutting-edge mobile laser scanner technology, NavVis. The calculations provided are grounded in historical data from 2023, offering a solid baseline for estimation. However, it's important to note that every scanning project is unique, with distinct requirements. Therefore, while the results generated here are valuable, they should always be double-checked to ensure accuracy and relevance to the specific project at hand.<br/>For more information, please do not hesitate to contact Raúl Rentería (r.renteria@bim-facility.ch)
      </p>
      <TextInput
        label="Project ID"
        value={projectId}
        fullWidth
      />
      <TextField
      label="Project ID"
      type="text" // Changed to text to allow non-numeric characters
      value={projectId}
      onChange={(e) => setProjectId(e.target.value)}
      fullWidth
      margin="normal"
      />
      <TextInput
        label="Project Name"
        value={projectName}
        fullWidth
      />
      <TextField
      label="Project Name"
      type="text" // Changed to text to allow non-numeric characters
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      fullWidth
      margin="normal"
      />
      <TextInput
        label="Project Type"
        value={projectType}
        placeholder="Select a project type"
        fullWidth
      />
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
      <TextInput
        label="How many square meters need to be scanned (Approx. in m2)?"
        value={squareMeters}
        fullWidth
        endAdornment={<InputAdornment position="end">m2</InputAdornment>}
      />
      <TextField
      label="How many square meters need to be scanned (Approx. in m2)?"
      type="text" // Changed to text to allow non-numeric characters
      value={squareMeters}
      onChange={(e) => {
      
        const value = e.target.value;
        const reg = /^[0-9]*$/;
        if (reg.test(value) || value === "") {
          setSquareMeters(value);
        }
      
      }}
      fullWidth
      margin="normal"
      InputProps={{
        endAdornment: <InputAdornment position="end">m2</InputAdornment>,
      }}
      />
      <TextInput
        label="MEP information needs to be scanned?"
        value={mep}
        fullWidth
      />
      <TextField
        select
        label="MEP information needs to be scanned?"
        value={mep}
        onChange={(e) => setMep(e.target.value)}
        fullWidth
        margin="normal"
      >
        {['Yes', 'No'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextInput
         fullWidth
         label="Is the project Georeferenced?"
         value={georeferencing}
      />
      <TextField
        select
        label="Is the project Georeferenced?"
        value={georeferencing}
        onChange={(e) => setGeoreferencing(e.target.value)}
        fullWidth
        margin="normal"
      >
        {['Yes', 'No'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextInput
        fullWidth
        label="How many Team Members will scan?"
        value={teamMembers}
      />
      <TextField
        select
        label="How many Team Members will scan?"
        value={teamMembers}
        onChange={(e) => setTeamMembers(e.target.value)}
        fullWidth
        margin="normal"
      >
        {[1, 2, 3, 4].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextInput
        fullWidth
        label="Is facade needed?"
        value={facade}
      />
      <TextField
        select
        label="Is facade needed?"
        value={facade}
        onChange={(e) => setFacade(e.target.value)}
        fullWidth
        margin="normal"
      >
        {['Yes', 'No'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextInput
        fullWidth
        label="Travel distance to the site (Approx. in hours)"
        value={travelDistance}
        endAdornment={<InputAdornment position="end">hours</InputAdornment>}
      />
      <TextField
        label="Travel distance to the site (Approx. in hours)"
        type="text" // Changed to text to allow non-numeric characters
        value={travelDistance}
        onChange={(e) => {
      
          const value = e.target.value;
          const reg = /^[0-9]*$/;
          if (reg.test(value) || value === "") {
            setTravelDistance(value);
          }
      
        }}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: <InputAdornment position="end">hours</InputAdornment>,
        }}
      />
      <div style={{width: '100%', justifyContent: 'center', display: 'flex', marginBottom: 50, marginTop: 20}}>
      <Button style={{width: 600, alignSelf: 'center', borderRadius: 10}} variant="contained" color="primary" onClick={calculate}>
          Calculate
      </Button>
      </div>
      <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly'}}>
      {result && (
        <Typography className='capture-section' variant="body1" style={{ whiteSpace: "pre-line", marginBottom: 100}} mt={2}>
          {result}
          <Typography variant="body1" style={{ marginBottom: 100, borderWidth: 3, borderColor: 'red', borderStyle: 'groove', width: 300, padding: 10}} mt={2}>
            {totalResult}
          </Typography>
        </Typography>
      )}
      
      <div style={{marginTop: 30, flexDirection: 'column', display: 'flex'}}>

        <Button style={{marginBottom: 50, width: 200, borderRadius: 10, marginTop: 20}} disabled={!result} variant="contained" color="primary" onClick={saveAsPng}>
            Save as PNG
        </Button>

        <Button style={{marginBottom: 50, width: 200, borderRadius: 10}} disabled={!result} variant="contained" color="primary" onClick={printToTxt}>
            Print results
        </Button>

        <Button style={{marginBottom: 50, width: 200, borderRadius: 10}} variant="outlined" color="primary" onClick={handleCleanData}>
            Clear Data
        </Button>

        <Button style={{marginBottom: 50, width: 200, borderRadius: 10}} variant="contained" color="info" onClick={() => setOpen(true)}>
            Change Scanning Speed Values
        </Button>
        
        </div>
      
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={style}>

          <h2>
            <strong>Scanning Speed Modification</strong>
          </h2>



            <TextField label="Tunnel" type="number" value={tunnelSpeed} onChange={(e) => setTunnelSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Hospital" type="number" value={hospitalSpeed} onChange={(e) => setHospitalSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Office" type="number" value={officeSpeed} onChange={(e) => setOfficeSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Residential" type="number" value={residentialSpeed} onChange={(e) => setResidentialSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="School" type="number" value={schoolSpeed} onChange={(e) => setSchoolSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Shopping Center" type="number" value={shoppingCenterSpeed} onChange={(e) => setShoppingCenterSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Manufacturing" type="number" value={manufacturingSpeed} onChange={(e) => setManufacturingSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Parking Lot" type="number" value={parkingLotSpeed} onChange={(e) => setParkingLotSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Logistic Center" type="number" value={logisticCenterSpeed} onChange={(e) => setLogisticCenterSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Warehouse" type="number" value={warehouseSpeed} onChange={(e) => setWarehouseSpeed(e.target.value)} fullWidth margin="normal" />
            <TextField label="Terrain" type="number" value={terrainSpeed} onChange={(e) => setTerrainSpeed(e.target.value)} fullWidth margin="normal" />
      
            <Button style={{width: 200, borderRadius: 10}} variant="contained" color="success" onClick={() => setOpen(false)}>
              Save
            </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default ScanningCalculatorApp;
