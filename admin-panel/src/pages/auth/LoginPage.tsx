import { Link } from "react-router-dom";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginData, loginSchema } from "../../utils/schemas";
import { useAuthStore } from "../../store/auth.store";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Title,
  Stack,
  Alert,
  Paper,
  Group, // <-- Pake Paper biar rapih
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

function LoginPage() {
  const navigate = useNavigate();
  const { setToken } = useAuthStore(); // Ambil 'action' login dari Zustand
  const [error, setError] = React.useState<string | null>(null);

  // Setup React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema), // Sambungin Zod
  });

  // Fungsi pas form di-submit
  const onSubmit = async (data: LoginData) => {
    setError(null);
    try {
      // Tembak API (pake Axios instance kita)
      const response = await api.post("/auth/login", data);

      const { token, user } = response.data.data;

      // Cek kalo dia bukan admin
      if (user.role !== "admin") {
        setError("Akses ditolak. Akun Anda bukan admin.");
        return;
      }

      // Kalo sukses, simpen token ke Zustand & pindah halaman
      setToken(token, user);
      navigate("/"); // Tendang ke Dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal, coba lagi");
    }
  };

  return (
    <Container
      size="xs"
      p="md"
      style={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper
        withBorder
        shadow="md"
        p={30}
        radius="md"
        style={{ width: "100%" }}
      >
        <Title order={2} ta="center" mb="lg">
          CWO Admin Login
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            {/* TAMPILIN ERROR BOX */}
            {error && (
              <Alert title="Login Gagal" color="red" icon={<IconAlertCircle />}>
                {error}
              </Alert>
            )}
            {/* Input Email (dari Mantine + RHF) */}
            <TextInput
              label="Email"
              placeholder="admin@cwo.com"
              {...register("email")}
              error={errors.email?.message}
            />
            {/* Input Password (dari Mantine + RHF) */}
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* === TAMBAHAN LINK === */}
            <Group justify="flex-end" mt="xs">
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "12px",
                  color: "#228be6",
                  textDecoration: "none",
                }}
              >
                Lupa password?
              </Link>
            </Group>

            <Button type="submit" loading={isSubmitting} fullWidth mt="xl">
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
