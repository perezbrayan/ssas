import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface Gift {
  id: number;
  user_id: number;
  product_id: number;
  status: string;
  created_at: string;
  username?: string;
  product_name?: string;
}

export const GiftManagement: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchGifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/db/api/admin/gifts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGifts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los regalos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleStatusUpdate = async (giftId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/db/api/admin/gifts/${giftId}/status`,
        { status: newStatus, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenDialog(false);
      setNotes('');
      fetchGifts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el estado');
    }
  };

  const handleOpenDialog = (gift: Gift) => {
    setSelectedGift(gift);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Regalos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gifts.map((gift) => (
              <TableRow key={gift.id}>
                <TableCell>{gift.id}</TableCell>
                <TableCell>{gift.username}</TableCell>
                <TableCell>{gift.product_name}</TableCell>
                <TableCell>{gift.status}</TableCell>
                <TableCell>
                  {new Date(gift.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(gift)}
                    disabled={gift.status === 'completed' || gift.status === 'rejected'}
                  >
                    Actualizar Estado
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Actualizar Estado del Regalo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notas"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={() => selectedGift && handleStatusUpdate(selectedGift.id, 'completed')}
            color="primary"
          >
            Completar
          </Button>
          <Button 
            onClick={() => selectedGift && handleStatusUpdate(selectedGift.id, 'rejected')}
            color="error"
          >
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
