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
  CircularProgress,
  Chip
} from '@mui/material';
import axios from 'axios';
import { apiConfig } from '../../config/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const BOT_URL = apiConfig.botURL;

interface FortniteOrder {
  id: number;
  user_id: number;
  username: string;
  offer_id: string;
  item_name: string;
  price: number;
  is_bundle: boolean;
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  metadata?: string;
  payment_receipt?: string;
  created_at: string;
  updated_at: string;
}

export const FortniteOrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<FortniteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<FortniteOrder | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [responseDialog, setResponseDialog] = useState<{open: boolean, message: string}>({
    open: false,
    message: ''
  });
  const [processingOrder, setProcessingOrder] = useState<number | null>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/db/api/fortnite/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (status: 'completed' | 'failed', order: FortniteOrder) => {
    if (!order) return;

    try {
      setProcessingOrder(order.id);
      const token = localStorage.getItem('token');

      if (status === 'completed') {
        try {
          // Mostrar mensaje de procesamiento
          setResponseDialog({
            open: true,
            message: 'Enviando regalo... Por favor espere.'
          });

          const vpsResponse = await axios.post(`${BOT_URL}/bot2/api/send-gift`, {
            username: order.username,
            offerId: order.offer_id,
            price: order.price,
            isBundle: order.is_bundle,
            botId: 1 // Usar el primer bot
          });

          // Mostrar la respuesta exitosa
          setResponseDialog({
            open: true,
            message: `Regalo enviado exitosamente:\n${JSON.stringify(vpsResponse.data, null, 2)}`
          });

          // Actualizar el estado en la base de datos
          await axios.put(
            `${API_URL}/db/api/fortnite/orders/${order.id}/status`,
            {
              status: 'completed'
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          // Actualizar la lista de órdenes
          fetchOrders();
        } catch (vpsError: any) {
          // Mostrar error detallado
          setResponseDialog({
            open: true,
            message: `Error al enviar el regalo:\n${JSON.stringify({
              error: vpsError.message,
              details: vpsError.response?.data || 'No hay detalles adicionales'
            }, null, 2)}`
          });
          return;
        }
      } else {
        // Si es fallo, actualizamos directamente el estado
        await axios.put(
          `${API_URL}/db/api/fortnite/orders/${order.id}/status`,
          {
            status,
            error_message: errorMessage
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchOrders();
      }

      setOpenDialog(false);
      setErrorMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el estado');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleViewReceipt = async (receipt: string | undefined) => {
    if (receipt) {
      try {
        console.log('Intentando cargar comprobante:', receipt);
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        
        // Extraer el nombre del archivo de la ruta
        const filename = receipt.split('/').pop();
        console.log('Nombre del archivo:', filename);
        
        // Obtener la imagen usando el token
        const response = await axios.get(`${API_URL}/db/api/fortnite/payment-receipt/${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        });

        console.log('Respuesta recibida:', response.status);
        
        // Crear URL para la imagen
        const imageUrl = URL.createObjectURL(response.data);
        setSelectedReceipt(imageUrl);
        setShowReceiptDialog(true);
      } catch (error: any) {
        console.error('Error al cargar el comprobante:', error);
        console.error('Detalles del error:', error.response?.data);
        setResponseDialog({
          open: true,
          message: `Error al cargar el comprobante de pago: ${error.response?.data?.error || error.message}`
        });
      }
    } else {
      setResponseDialog({
        open: true,
        message: 'No se ha subido el comprobante de pago para esta orden.'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Órdenes de Fortnite
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
              <TableCell>Usuario Web</TableCell>
              <TableCell>Usuario Fortnite</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user_id ? `ID: ${order.user_id}` : 'No registrado'}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.username} 
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{order.item_name}</TableCell>
                <TableCell>{order.price} V-Bucks</TableCell>
                <TableCell>
                  <Chip 
                    label={order.is_bundle ? 'Bundle' : 'Item'} 
                    size="small" 
                    color={order.is_bundle ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleViewReceipt(order.payment_receipt)}
                    sx={{ mr: 1 }}
                  >
                    Ver Comprobante
                  </Button>
                  {order.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusUpdate('completed', order)}
                        disabled={processingOrder === order.id}
                        sx={{ mr: 1 }}
                      >
                        {processingOrder === order.id ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Procesando...
                          </>
                        ) : (
                          'Completar'
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpenDialog(true);
                        }}
                        disabled={processingOrder === order.id}
                      >
                        Falló
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Marcar orden como fallida</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mensaje de error"
            fullWidth
            variant="outlined"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={() => handleStatusUpdate('failed', selectedOrder as FortniteOrder)} color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={responseDialog.open} 
        onClose={() => {
          if (!processingOrder) {
            setResponseDialog({open: false, message: ''});
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {processingOrder ? 'Procesando Orden' : 'Respuesta del Servidor'}
        </DialogTitle>
        <DialogContent>
          <Box 
            component="pre" 
            sx={{ 
              whiteSpace: 'pre-wrap', 
              wordWrap: 'break-word',
              bgcolor: '#f5f5f5',
              p: 2,
              borderRadius: 1
            }}
          >
            {responseDialog.message}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setResponseDialog({open: false, message: ''})}
            disabled={processingOrder !== null}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showReceiptDialog}
        onClose={() => setShowReceiptDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Comprobante de Pago</DialogTitle>
        <DialogContent>
          {selectedReceipt && (
            <img
              src={selectedReceipt}
              alt="Comprobante de pago"
              style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceiptDialog(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
