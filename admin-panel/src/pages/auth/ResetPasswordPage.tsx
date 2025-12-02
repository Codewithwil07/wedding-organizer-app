import { useState } from 'react';
import { TextInput, PasswordInput, Button, Container, Paper, Title, Text, Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconLock, IconKey } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import api from '../../api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Ambil email dari URL (?email=...)
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      return setError('Password minimal 6 karakter');
    }
    if (password !== confirmPassword) {
      return setError('Konfirmasi password tidak cocok');
    }

    setLoading(true);

    try {
      // Tembak API Reset Password
      await api.post('/auth/reset-password', {
        email,
        token, // OTP 6 digit
        password
      });

      notifications.show({
        title: 'Berhasil',
        message: 'Password berhasil diubah. Silakan login.',
        color: 'teal',
        icon: <IconCheck />,
      });

      navigate('/login');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mereset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40} style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ width: '100%' }}>
        <Title ta="center" order={2}>Reset Password</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={20}>
          Cek email Anda untuk kode OTP 6 digit.
        </Text>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="admin@cwo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Kode OTP"
              placeholder="123456"
              required
              leftSection={<IconKey size={16} />}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
            />
            <PasswordInput
              label="Password Baru"
              placeholder="Minimal 6 karakter"
              required
              leftSection={<IconLock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordInput
              label="Konfirmasi Password"
              placeholder="Ulangi password baru"
              required
              leftSection={<IconLock size={16} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Ubah Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}