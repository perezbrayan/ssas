import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { adminService } from '../../services/adminService';

interface VBucksRate {
  rate: number;
  created_at: string;
}

export const VBucksManagement = () => {
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [history, setHistory] = useState<VBucksRate[]>([]);
  const [open, setOpen] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar tasa actual
      const rateData = await adminService.getVBucksRate();
      if (rateData && rateData.rate) {
        // Convertir la tasa de string a número
        const numericRate = parseFloat(rateData.rate);
        if (!isNaN(numericRate)) {
          setCurrentRate(numericRate);
        } else {
          console.error('La tasa no es un número válido:', rateData.rate);
          setError('Error: La tasa no es un número válido');
        }
      } else {
        console.error('Formato de tasa inválido:', rateData);
        setError('Error: Formato de tasa inválido');
      }

      // Cargar historial
      const historyData = await adminService.getVBucksHistory();
      if (Array.isArray(historyData)) {
        // Convertir las tasas de string a número en el historial
        const formattedHistory = historyData.map(item => ({
          ...item,
          rate: parseFloat(item.rate)
        }));
        setHistory(formattedHistory);
      } else {
        console.error('Formato de historial inválido:', historyData);
        setError('Error: Formato de historial inválido');
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
    }
  };

  const handleUpdateRate = async () => {
    if (!newRate || isNaN(Number(newRate)) || Number(newRate) <= 0) {
      setError('Por favor ingresa una tasa válida mayor a 0');
      return;
    }

    try {
      await adminService.updateVBucksRate(Number(newRate));
      setSuccess('Tasa de VBucks actualizada exitosamente');
      setOpen(false);
      loadData();
      setNewRate('');
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError('Error al actualizar la tasa de VBucks');
    }
  };

  return (
    <Box sx={{ color: 'white' }}>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" component="h2">
            Gestión de VBucks
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: '#1a365d',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#2a4365'
              }
            }}
          >
            Actualizar Tasa
          </Button>
        </Box>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error" onClose={() => setError('')} sx={{ backgroundColor: '#2D3748', color: 'white' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ backgroundColor: '#2D3748', color: 'white' }}>
            {success}
          </Alert>
        </Snackbar>

        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: '#1a1a1a',
          color: 'white',
          border: '1px solid #2d2d2d'
        }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Tasa Actual
          </Typography>
          <Typography variant="h4" sx={{ color: '#3182ce' }}>
            {currentRate} USD/VBuck
          </Typography>
        </Paper>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Historial de Tasas
        </Typography>
        <TableContainer component={Paper} sx={{ 
          p: 3,
          backgroundColor: '#1a1a1a',
          color: 'white',
          border: '1px solid #2d2d2d'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>Tasa</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>Fecha de Cambio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history && history.length > 0 ? (
                history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>
                      {item.rate} USD/VBuck
                    </TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>
                    No hay historial disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle sx={{ color: 'white', backgroundColor: '#1a1a1a' }}>
            Actualizar Tasa de VBucks
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#1a1a1a' }}>
            <TextField
              autoFocus
              margin="dense"
              label="Nueva Tasa (USD/VBuck)"
              type="number"
              fullWidth
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              inputProps={{ 
                step: '0.01',
                min: '0.01'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#2d2d2d',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3182ce',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3182ce',
                  },
                  backgroundColor: '#1a1a1a',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#1a1a1a' }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateRate} 
              color="primary"
              disabled={!newRate || isNaN(Number(newRate)) || Number(newRate) <= 0}
              sx={{
                backgroundColor: '#1a365d',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#2a4365'
                }
              }}
            >
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
