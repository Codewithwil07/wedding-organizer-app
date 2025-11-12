import { useState } from 'react';
import { Title, Table, Button, Group, Loader, Alert, Badge } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useAdminPesanan, Pesanan } from '../../api/usePesanan'; // <-- Hook SWR kita
import api from '../../api'; // <-- Axios instance
import { notifications } from '@mantine/notifications'; // <-- Notifikasi popup
import { StatusPesananEnum } from '../../utils/schemas';

// Komponen kecil buat nentuin warna Badge Status
const StatusBadge = ({ status }: { status: StatusPesananEnum }) => {
  const color = {
    [StatusPesananEnum.PENDING]: 'blue',
    [StatusPesananEnum.DITERIMA]: 'green',
    [StatusPesananEnum.DITOLAK]: 'red',
    [StatusPesananEnum.DIBATALKAN]: 'gray',
  };
  return <Badge color={color[status]}>{status}</Badge>;
};

function PesananPage() {
  const [cursor, setCursor] = useState<number | null>(null);
  
  // 1. PANGGIL SWR HOOK
  const { pesananData, isLoading, isError, mutate } = useAdminPesanan(cursor);
  const [isUpdating, setIsUpdating] = useState<number | null>(null); // State loading per-tombol

  // 2. FUNGSI INTI: Handle Terima / Tolak
  const handleUpdateStatus = async (id: number, status: 'DITERIMA' | 'DITOLAK') => {
    setIsUpdating(id); // Set loading buat tombol ini
    try {
      // 3. Tembak API 'PUT' (API-nya udah kita bikin di backend)
      await api.put(`/admin/pesanan/${id}/status`, { status });

      // 4. Kasih notif sukses
      notifications.show({
        title: 'Berhasil!',
        message: `Pesanan berhasil di-${status.toLowerCase()}.`,
        color: 'teal',
        icon: <IconCheck size={18} />,
      });

      // 5. REFRESH data di tabel (ini 'ajaib'-nya SWR)
      mutate(); 
    } catch (err: any) {
      // 6. Kasih notif gagal
      notifications.show({
        title: 'Gagal',
        message: err.response?.data?.message || 'Gagal update status',
        color: 'red',
        icon: <IconX size={18} />,
      });
    } finally {
      setIsUpdating(null); // Beresin loading
    }
  };

  // 7. Handle Loading & Error
  if (isLoading) return <Loader />;
  if (isError) return <Alert color="red" icon={<IconAlertCircle />}>Gagal mengambil data pesanan</Alert>;

  return (
    <>
      <Title order={3} mb="md">Dashboard Pesanan Masuk</Title>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Total Harga</Table.Th>
            <Table.Th>Tanggal</Table.Th>
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pesananData?.data.map((pesanan: Pesanan) => (
            <Table.Tr key={pesanan.id_pesan}>
              <Table.Td>{pesanan.id_pesan}</Table.Td>
              <Table.Td>{pesanan.user.nama_user}</Table.Td>
              <Table.Td>
                <StatusBadge status={pesanan.status} />
              </Table.Td>
              <Table.Td>Rp {pesanan.harga.toLocaleString('id-ID')}</Table.Td>
              <Table.Td>{new Date(pesanan.waktu_awal).toLocaleDateString('id-ID')}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {/* Cuma tampilin tombol kalo statusnya 'PENDING' */}
                  {pesanan.status === StatusPesananEnum.PENDING && (
                    <>
                      <Button
                        size="xs"
                        color="green"
                        loading={isUpdating === pesanan.id_pesan}
                        onClick={() => handleUpdateStatus(pesanan.id_pesan, 'DITERIMA')}
                      >
                        Terima
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        loading={isUpdating === pesanan.id_pesan}
                        onClick={() => handleUpdateStatus(pesanan.id_pesan, 'DITOLAK')}
                      >
                        Tolak
                      </Button>
                    </>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      {/* 8. Tombol Pagination */}
      <Group justify="center" mt="md">
        <Button 
          onClick={() => setCursor(pesananData?.meta.nextCursor || null)}
          disabled={!pesananData?.meta.nextCursor}
        >
          Next Page
        </Button>
      </Group>
    </>
  );
}

export default PesananPage;