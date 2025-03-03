import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Box,
  Alert,
  Snackbar,
  FormControlLabel,
  Button
} from '@mui/material';
import { adminService, User } from '../../services/adminService';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      // Convertir is_admin de número a booleano
      const formattedUsers = data.map(user => ({
        ...user,
        is_admin: Boolean(user.is_admin)
      }));
      setUsers(formattedUsers || []);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error('Error loading users:', err);
    }
  };

  const handleAdminToggle = async (userId: number, currentValue: boolean) => {
    try {
      await adminService.updateUserAdmin(userId, !currentValue);
      setSuccess('Permisos de administrador actualizados exitosamente');
      loadUsers();
    } catch (err) {
      setError('Error al actualizar los permisos de administrador');
      console.error('Error updating user role:', err);
    }
  };

  return (
    <Box sx={{ color: 'white' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#2D3748', color: 'white' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, backgroundColor: '#2D3748', color: 'white' }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ 
        p: 3,
        backgroundColor: '#1a1a1a',
        color: 'white',
        border: '1px solid #2d2d2d'
      }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Gestión de Usuarios
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>Usuario</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>Fecha de Registro</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>Administrador</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>{user.username}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid #2d2d2d' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #2d2d2d' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={user.is_admin}
                          onChange={() => handleAdminToggle(user.id, user.is_admin)}
                          color="primary"
                        />
                      }
                      label={user.is_admin ? 'Administrador' : 'Usuario'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
