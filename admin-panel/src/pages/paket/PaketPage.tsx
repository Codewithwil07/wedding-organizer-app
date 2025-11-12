import { Title, Tabs, Loader, Alert, Table, Button, Group } from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useAdminPaket } from '../../api/usePaket'; // <-- Hook SWR kita

// 1. Tipe Paket (biar aman dari typo)
type PaketType = 'dokumentasi' | 'busana' | 'dekorasi' | 'akadresepsi';

// 2. Komponen Tabel REUSABLE
function PaketTable({ paketType }: { paketType: PaketType }) {
  const [cursor, setCursor] = useState<number | null>(null);
  
  // 3. PANGGIL SWR HOOK
  const { paketData, isLoading, isError, mutate } = useAdminPaket(paketType, cursor);

  // 4. Handle Loading
  if (isLoading) return <Loader />;
  // 5. Handle Error
  if (isError) return <Alert color="red" icon={<IconAlertCircle />}>Gagal mengambil data</Alert>;

  // 6. Handle Tombol Hapus (CONTOH)
  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin mau hapus paket ini?')) {
      try {
        // (Kita asumsikan ID-nya 'id_dokum', 'id_busana', dll)
        // await api.delete(`/admin/paket/${paketType}/${id}`);
        alert('API Delete belum disambungin!');
        mutate(); // <-- REFRESH data setelah hapus
      } catch (err) {
        alert('Gagal hapus!');
      }
    }
  };

  return (
    <>
      <Table striped withTableBorder mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Harga</Table.Th>
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paketData?.data.map((paket: any) => (
            <Table.Tr key={paket.id_dokum || paket.id_busana || paket.id_dekorasi || paket.id_ar}>
              <Table.Td>{paket.id_dokum || paket.id_busana || paket.id_dekorasi || paket.id_ar}</Table.Td>
              <Table.Td>{paket.nama}</Table.Td>
              <Table.Td>Rp {paket.harga.toLocaleString('id-ID')}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="outline">Edit</Button>
                  <Button 
                    size="xs" 
                    color="red" 
                    onClick={() => handleDelete(paket.id_dokum || paket.id_busana)}
                  >
                    Hapus
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      {/* 7. Tombol Pagination */}
      <Group justify="center" mt="md">
        <Button 
          onClick={() => setCursor(paketData?.meta.nextCursor || null)}
          disabled={!paketData?.meta.nextCursor}
        >
          Next Page
        </Button>
      </Group>
    </>
  );
}


// 8. Komponen Halaman UTAMA
function PaketPage() {
  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={3}>Manajemen Paket</Title>
        <Button leftSection={<IconPlus size={14} />}>
          Tambah Paket Baru
        </Button>
      </Group>

      {/* 9. Pake TABS buat misahin */}
      <Tabs defaultValue="dokumentasi">
        <Tabs.List>
          [cite_start]<Tabs.Tab value="dokumentasi">Dokumentasi [cite: 620-623]</Tabs.Tab>
          [cite_start]<Tabs.Tab value="busana">Busana [cite: 630-632]</Tabs.Tab>
          [cite_start]<Tabs.Tab value="dekorasi">Dekorasi [cite: 643-647]</Tabs.Tab>
          [cite_start]<Tabs.Tab value="akadresepsi">Akad & Resepsi [cite: 648-650]</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="dokumentasi">
          <PaketTable paketType="dokumentasi" />
        </Tabs.Panel>
        <Tabs.Panel value="busana">
          <PaketTable paketType="busana" />
        </Tabs.Panel>
        <Tabs.Panel value="dekorasi">
          <PaketTable paketType="dekorasi" />
        </Tabs.Panel>
        <Tabs.Panel value="akadresepsi">
          <PaketTable paketType="akadresepsi" />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default PaketPage;