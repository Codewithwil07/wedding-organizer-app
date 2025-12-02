import { useState } from "react";
import {
  TextInput,
  Button,
  Container,
  Paper,
  Title,
  Text,
  Alert,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconMail } from "@tabler/icons-react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Tembak API Backend yang sama kayak Mobile App
      await api.post("/auth/forgot-password", { email });

      // Kalo sukses, pindah ke halaman Reset sambil bawa email-nya
      // (Biar user gak usah ngetik ulang)
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      size={420}
      my={40}
      style={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{ width: "100%" }}
      >
        <Title ta="center" order={2}>
          Lupa Password?
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb={20}>
          Masukkan email admin Anda untuk mendapatkan kode OTP.
        </Text>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Gagal"
            color="red"
            mb="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email Admin"
            placeholder="admin@cwo.com"
            required
            leftSection={<IconMail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Kirim Kode OTP
          </Button>
        </form>

        <Group justify="center" mt="lg">
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "gray",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconArrowLeft size={14} style={{ marginRight: 4 }} /> Kembali ke
            Login
          </Link>
        </Group>
      </Paper>
    </Container>
  );
}
