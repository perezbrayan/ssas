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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { adminService, Admin } from '../../services/adminService';

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    is_super_admin: false
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (err) {
      setError('Error al cargar administradores');
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await adminService.createAdmin(newAdmin);
      setSuccess('Administrador creado exitosamente');
      setOpenDialog(false);
      loadAdmins();
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        is_super_admin: false
      });
    } catch (err) {
      setError('Error al crear administrador');
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
      try {
        await adminService.deleteAdmin(adminId);
        setSuccess('Administrador eliminado exitosamente');
        loadAdmins();
      } catch (err) {
        setError('Error al eliminar administrador');
      }
    }
  };

  const handleRoleToggle = async (adminId: number, currentValue: boolean) => {
    try {
      await adminService.updateAdminRole(adminId, !currentValue);
      setSuccess('Rol de administrador actualizado exitosamente');
      loadAdmins();
    } catch (err) {
      setError('Error al actualizar rol de administrador');
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Gestión de Administradores
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #00b8d4 30%, #00e5ff 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #00e5ff 30%, #00b8d4 90%)',
            }
          }}
        >
          Nuevo Administrador
        </Button>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Super Admin</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {new Date(admin.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={admin.is_super_admin}
                        onChange={() => handleRoleToggle(admin.id, admin.is_super_admin)}
                        color="primary"
                      />
                    }
                    label={admin.is_super_admin ? 'Super Admin' : 'Admin'}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteAdmin(admin.id)}
                    sx={{ ml: 1 }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Crear Nuevo Administrador</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de Usuario"
            type="text"
            fullWidth
            value={newAdmin.username}
            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newAdmin.is_super_admin}
                onChange={(e) => setNewAdmin({ ...newAdmin, is_super_admin: e.target.checked })}
              />
            }
            label="Super Admin"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateAdmin} variant="contained" color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
