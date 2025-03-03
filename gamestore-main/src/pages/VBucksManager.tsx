import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

interface RateHistory {
  date: string;
  rate: number;
}

const VBucksManager = () => {
  const [newRate, setNewRate] = useState('');
  const [rateHistory] = useState<RateHistory[]>([
    { date: '15/1/2025, 18:08:25', rate: 2200 },
    { date: '15/1/2025, 15:38:40', rate: 2400 },
    { date: '15/1/2025, 15:38:36', rate: 2200 },
    { date: '15/1/2025, 15:29:15', rate: 20000 },
    { date: '15/1/2025, 15:14:41', rate: 2200 },
    { date: '15/1/2025, 15:12:31', rate: 2200 },
  ]);

  const handleUpdateRate = () => {
    // Aquí iría la lógica para actualizar la tasa
    console.log('Nueva tasa:', newRate);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#F8F9F8',
      color: '#1a1a1a',
      pt: 12,
      pb: 4
    }}>
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 8
        }}>
          <Typography variant="h4" component="h1" sx={{ color: '#1a1a1a' }}>
            Gestión de Tasas VBucks
          </Typography>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained"
              sx={{
                bgcolor: '#00b8d4',
                '&:hover': {
                  bgcolor: '#00838f'
                }
              }}
            >
              Volver al Panel
            </Button>
          </Link>
        </Box>

        <Box sx={{ 
          bgcolor: 'white',
          borderRadius: 2,
          p: 3,
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1a1a1a' }}>
            Actualizar Tasa de VBucks
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Nueva tasa"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#1a1a1a',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00b8d4',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleUpdateRate}
              sx={{
                bgcolor: '#00b8d4',
                '&:hover': {
                  bgcolor: '#00838f'
                }
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        <Box sx={{ 
          bgcolor: 'white',
          borderRadius: 2,
          p: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1a1a1a' }}>
            Historial de Tasas
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: 'white', boxShadow: 'none' }}>
            <Table sx={{ 
              '& .MuiTableCell-root': {
                color: '#1a1a1a',
                borderColor: 'rgba(0, 0, 0, 0.1)'
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tasa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rateHistory.map((history, index) => (
                  <TableRow key={index}>
                    <TableCell>{history.date}</TableCell>
                    <TableCell>{history.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default VBucksManager;
