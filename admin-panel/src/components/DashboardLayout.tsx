import { AppShell, Burger, Group, NavLink, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconPackage, IconLogout } from "@tabler/icons-react";
import {
  NavLink as RouterNavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={4}>CWO Admin Panel</Title>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="md">
        <NavLink
          label="Pesanan"
          leftSection={<IconHome size="1rem" />}
          component={RouterNavLink}
          to="/"
          onClick={toggle}
        />
        <NavLink
          label="Manajemen Paket"
          leftSection={<IconPackage size="1rem" />}
          component={RouterNavLink}
          to="/paket"
          onClick={toggle}
        />
        <NavLink
          label="Logout"
          leftSection={<IconLogout size="1rem" />}
          color="red"
          onClick={handleLogout}
        />
      </AppShell.Navbar>

      {/* Isi Halaman (PaketPage, PesananPage) */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
