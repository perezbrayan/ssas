import React from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface User {
  username: string;
  email: string;
  rol: string;
  registrationDate: string;
  lastAccess: string;
}

const UserManager = () => {
  // Datos de ejemplo
  const users: User[] = [
    {
      username: 'gmstore06',
      email: 'millonplazaromero@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'papa12589',
      email: 'rafaeljose280509@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'ckdcz',
      email: 'djkqdjkd@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'juanda_',
      email: 'jdkdjkdjk@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'kikl',
      email: 'kckdkikz@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'ffkgfkfkf',
      email: 'dksdksd@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'sfsdfsf',
      email: 'djskdjskd@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'Angel367xX',
      email: 'prueba903904@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    },
    {
      username: 'angel',
      email: 'dskf@gmail.com',
      rol: '',
      registrationDate: 'Invalid Date',
      lastAccess: 'Invalid Date'
    }
  ];

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
            PANEL DE ADMINISTRACIÓN
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
              Volver al panel
            </Button>
          </Link>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiPaper-root': {
              bgcolor: 'white',
              boxShadow: 'none'
            }
          }}
        >
          <Table sx={{ 
            minWidth: 650,
            '& .MuiTableCell-root': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
              color: '#1a1a1a',
              fontSize: '0.9rem'
            },
            '& .MuiTableHead-root': {
              '& .MuiTableCell-root': {
                bgcolor: '#f5f5f5',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }
            },
            '& .MuiTableBody-root': {
              '& .MuiTableRow-root': {
                '&:nth-of-type(odd)': {
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                },
                '&:hover': {
                  bgcolor: 'rgba(0, 184, 212, 0.05)'
                }
              }
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell>USUARIO</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>ROL</TableCell>
                <TableCell>FECHA DE REGISTRO</TableCell>
                <TableCell>ÚLTIMO ACCESO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.rol}</TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell>{user.lastAccess}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default UserManager;
