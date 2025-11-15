import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// 1. IMPORT ICON-ICON BARU
import { 
  IconHome, 
  IconPackage, 
  IconLogout,
  IconPhoto,
  IconWoman,
  IconDiamond,
  IconReceipt
} from '@tabler/icons-react';
import {
  NavLink as RouterNavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export default function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* Header (Tetap Sama) */}
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={4}>CWO Admin Panel</Title>
        </Group>
      </AppShell.Header>

      {/* Sidebar (INI YANG KITA UBAH) */}
      <AppShell.Navbar p="md">
        {/* 1. Link Pesanan (Tetap Sama) */}
        <NavLink
          label="Pesanan"
          leftSection={<IconHome size="1rem" />}
          component={RouterNavLink}
          to="/"
          onClick={toggle}
        />
        
        {/* 2. Menu Paket (BERUBAH JADI COLLAPSIBLE) */}
        <NavLink
          label="Manajemen Paket"
          leftSection={<IconPackage size="1rem" />}
          defaultOpened // (Bikin dia kebuka dari awal)
        >
          {/* 3. Sub-Menu (BARU) */}
          <NavLink
            label="Dokumentasi" 
            leftSection={<IconPhoto size="0.8rem" />}
            component={RouterNavLink}
            to="/paket/dokumentasi" // <-- Rute baru
            onClick={toggle}
          />
          <NavLink
            label="Busana & MUA" 
            leftSection={<IconWoman size="0.8rem" />}
            component={RouterNavLink}
            to="/paket/busana" // <-- Rute baru
            onClick={toggle}
          />
          <NavLink
            label="Dekorasi" 
            leftSection={<IconDiamond size="0.8rem" />}
            component={RouterNavLink}
            to="/paket/dekorasi" // <-- Rute baru
            onClick={toggle}
          />
          <NavLink
            label="Akad & Resepsi" 
            leftSection={<IconReceipt size="0.8rem" />}
            component={RouterNavLink}
            to="/paket/akadresepsi" // <-- Rute baru
            onClick={toggle}
          />
        </NavLink>

        {/* 4. Link Logout (Tetap Sama) */}
        <NavLink
          label="Logout"
          leftSection={<IconLogout size="1rem" />}
          color="red"
          onClick={handleLogout}
        />
      </AppShell.Navbar>

      {/* Isi Halaman (Otomatis ganti sesuai rute) */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}