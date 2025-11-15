import { useState } from 'react';
import {
  Title,
  Table,
  Button,
  Group,
  Loader,
  Alert,
  Modal,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Text, // <-- 1. Import 'Text'
  Image, // <-- 2. Import 'Image'
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { SWRConfig } from 'swr'; 

import { useAdminPaket } from '../../api/usePaket'; 
import api from '../../api'; // <-- 3. Import 'api' (Axios)
import { 
  createDokumentasiSchema, 
  type CreateDokumentasiData,
  updateDokumentasiSchema,
  type UpdateDokumentasiData
} from '../../utils/schemas'; 

// 4. IMPORT UPLOADER KITA
import { SingleImageUploader } from '../../components/SingleImageUploader';

// Tipe data
interface PaketDokumentasi {
  id_dokum: number;
  nama: string;
  harga: number;
  deskripsi: string;
  jenis: 'photo';
  image_url: string | null;
}

// ===================================================
// KOMPONEN FORM (INI YANG KITA UPGRADE)
// ===================================================
interface PaketFormProps {
  paket: PaketDokumentasi | null; 
  onClose: () => void;
  mutate: () => void; 
}

function PaketForm({ paket, onClose, mutate }: PaketFormProps) {
  const isEditMode = !!paket; 

  const {
    register,
    handleSubmit,
    setValue, // <-- 5. Kita butuh 'setValue'
    watch, // <-- 6. Kita butuh 'watch'
    formState: { errors, isSubmitting },
  } = useForm<CreateDokumentasiData | UpdateDokumentasiData>({
    resolver: zodResolver(isEditMode ? updateDokumentasiSchema : createDokumentasiSchema),
    // ===================================================
    // 7. GANTI DEFAULT VALUES (INI FIX 'VALIDASI GAGAL')
    // ===================================================
    defaultValues: isEditMode ? paket : {
      nama: '',
      deskripsi: '',
      harga: 1, // <-- FIX 1
      jenis: 'photo',
      image_url: null, // <-- FIX 2
    },
  });

  // 8. 'watch' field 'image_url'
  const imageUrlValue = watch('image_url');

  // 9. 'onSubmit' (TETAP SAMA)
  const onSubmit = async (data: CreateDokumentasiData | UpdateDokumentasiData) => {
    try {
      if (isEditMode) {
        await api.put(`/admin/paket/dokumentasi/${paket!.id_dokum}`, data);
        notifications.show({ title: 'Berhasil!', message: 'Paket di-update.', color: 'teal' });
      } else {
        await api.post('/admin/paket/dokumentasi', data);
        notifications.show({ title: 'Berhasil!', message: 'Paket dibuat.', color: 'teal' });
      }
      mutate();
      onClose();
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Terjadi kesalahan', color: 'red' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Nama Paket" {...register('nama')} error={errors.nama?.message} />
        <Textarea label="Deskripsi" {...register('deskripsi')} error={errors.deskripsi?.message} />
        <NumberInput label="Harga" min={0} {...register('harga', { valueAsNumber: true })} error={errors.harga?.message} />
        <Select label="Jenis" data={['photo']} {...register('jenis')} error={errors.jenis?.message} />

        {/* =================================================== */}
        {/* 10. GANTI 'TextInput' LAMA PAKE UPLOADER KITA */}
        {/* =================================================== */}
        <SingleImageUploader
          initialUrl={isEditMode ? paket?.image_url : null} 
          onUploadSuccess={(url) => setValue('image_url', url, { shouldValidate: true })}
        />
        {/* Tampilkan error Zod buat 'image_url' (kalo ada) */}
        {errors.image_url && <Text size="xs" c="red">{errors.image_url.message}</Text>}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditMode ? 'Update Paket' : 'Simpan Paket Baru'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}


// ===================================================
// KOMPONEN TABEL UTAMA (INI JUGA DI-UPGRADE)
// ===================================================

// +++ 11. BIKIN FUNGSI HELPER GAMBAR +++
// +++ HELPER GAMBAR YANG UDAH 100% BENER +++
const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return ''; 
  if (url.startsWith('http') || url.startsWith('blob:')) {
    return url;
  }
  return `${api.defaults.baseURL?.replace('/api', '')}${url}`;
};
function DokumentasiTable() {
  const [cursor, setCursor] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPaket, setSelectedPaket] = useState<PaketDokumentasi | null>(null);
  const { paketData, isLoading, isError, mutate } = useAdminPaket('dokumentasi', cursor);

  if (isLoading) return <Loader mt="xl" />;
  if (isError) return <Alert color="red" icon={<IconAlertCircle />}>Gagal mengambil data</Alert>;

  const handleEdit = (paket: PaketDokumentasi) => {
    setSelectedPaket(paket);
    open();
  };
  const handleCreate = () => {
    setSelectedPaket(null);
    open();
  };
  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin mau hapus paket ini?')) {
      try {
        await api.delete(`/admin/paket/dokumentasi/${id}`);
        notifications.show({ title: 'Berhasil', message: 'Paket dihapus', color: 'teal' });
        mutate();
      } catch (err: any) {
        notifications.show({ title: 'Gagal', message: err.response?.data?.message, color: 'red' });
      }
    }
  };

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={14} />} onClick={handleCreate}>
          Tambah Paket Dokumentasi
        </Button>
      </Group>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Harga</Table.Th>
            <Table.Th>Cover</Table.Th> {/* <-- 12. TAMBAH KOLOM COVER */}
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paketData?.data.map((paket) => (
            <Table.Tr key={paket.id_dokum}>
              <Table.Td>{paket.id_dokum}</Table.Td>
              <Table.Td>{paket.nama}</Table.Td>
              <Table.Td>Rp {paket.harga.toLocaleString('id-ID')}</Table.Td>
              
              {/* +++ 13. TAMBAH TAMPILAN GAMBAR +++ */}
              <Table.Td>
                {paket.image_url ? (
                  <Image
                    src={getFullImageUrl(paket.image_url)} // <-- PAKE HELPER
                    height={60}
                    w={90}
                    radius="sm"
                    fit="cover"
                    alt={paket.nama}
                  />
                ) : (
                  <Text size="xs" c="dimmed">(No Image)</Text>
                )}
              </Table.Td>

              <Table.Td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="outline"
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleEdit(paket as PaketDokumentasi)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => handleDelete(paket.id_dokum!)}
                  >
                    Hapus
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      <Group justify="center" mt="md">
        <Button 
          onClick={() => setCursor(paketData?.meta.nextCursor || null)}
          disabled={!paketData?.meta.nextCursor}
        >
          Next Page
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title={selectedPaket ? 'Edit Paket' : 'Tambah Paket Baru'}
        centered
      >
        <PaketForm
          paket={selectedPaket}
          onClose={close}
          mutate={mutate}
        />
      </Modal>
    </>
  );
}

// ===================================================
// KOMPONEN HALAMAN UTAMA
// ===================================================
function DokumentasiPage() {
  return (
    <SWRConfig> 
      <Title order={3} mb="md">Manajemen Paket Dokumentasi</Title>
      <DokumentasiTable />
    </SWRConfig>
  );
}

export default DokumentasiPage;