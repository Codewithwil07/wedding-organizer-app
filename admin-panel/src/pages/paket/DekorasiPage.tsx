import { useState } from 'react';
import {
  Title, Table, Button, Group, Loader, Alert, Modal, Stack, TextInput, Textarea, NumberInput, Select, Text, Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { SWRConfig } from 'swr'; 

// 1. GANTI KE DEKORASI
import { useAdminPaket } from '../../api/usePaket'; 
import api from '../../api';
import { 
  createDekorasiSchema, 
  type CreateDekorasiData,
  updateDekorasiSchema,
  type UpdateDekorasiData
} from '../../utils/schemas'; 
import { SingleImageUploader } from '../../components/SingleImageUploader';

// 2. GANTI TIPE DATA
interface PaketDekorasi {
  id_dekorasi: number;
  nama: string;
  harga: number;
  deskripsi: string;
  jenis: 'koade';
  image_url: string | null;
}

// ===================================================
// KOMPONEN FORM (DEKORASI)
// ===================================================
interface PaketFormProps {
  paket: PaketDekorasi | null; 
  onClose: () => void;
  mutate: () => void; 
}

function PaketForm({ paket, onClose, mutate }: PaketFormProps) {
  const isEditMode = !!paket; 

  const {
    register,
    handleSubmit,
    setValue, 
    watch, 
    formState: { errors, isSubmitting },
  } = useForm<CreateDekorasiData | UpdateDekorasiData>({
    resolver: zodResolver(isEditMode ? updateDekorasiSchema : createDekorasiSchema), // GANTI SKEMA
    // FIX: defaultValues
    defaultValues: isEditMode ? paket : {
      nama: '',
      deskripsi: '',
      harga: undefined, 
      jenis: 'koade', // <-- DEFAULT VALUE 'koade'
      image_url: null, 
    },
  });

  const currentImageUrl = watch('image_url');

  const onSubmit = async (data: CreateDekorasiData | UpdateDekorasiData) => {
    try {
      if (isEditMode) {
        await api.put(`/admin/paket/dekorasi/${paket!.id_dekorasi}`, data); // GANTI URL
        notifications.show({ title: 'Berhasil!', message: 'Paket di-update.', color: 'teal' });
      } else {
        await api.post('/admin/paket/dekorasi', data); // GANTI URL
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
        
        {/* 3. FIELD 'JENIS' ADA DI SINI  */}
        <Select
          label="Jenis"
          data={['koade']}
          {...register('jenis')}
          error={errors.jenis?.message}
        />

        {/* Pake Uploader */}
        <SingleImageUploader
          urlToPreview={currentImageUrl} 
          onUploadSuccess={(url) => setValue('image_url', url, { shouldValidate: true })}
        />
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
// KOMPONEN TABEL (DEKORASI)
// ===================================================
const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return ''; 
  if (url.startsWith('http') || url.startsWith('blob:')) {
    return url;
  }
  return `${api.defaults.baseURL?.replace('/api', '')}${url}`;
};

function DekorasiTable() {
  const [cursor, setCursor] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPaket, setSelectedPaket] = useState<PaketDekorasi | null>(null);
  
  // GANTI TIPE PAKET
  const { paketData, isLoading, isError, mutate } = useAdminPaket('dekorasi', cursor);

  if (isLoading) return <Loader mt="xl" />;
  if (isError) return <Alert color="red" icon={<IconAlertCircle />}>Gagal mengambil data</Alert>;

  const handleEdit = (paket: PaketDekorasi) => {
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
        await api.delete(`/admin/paket/dekorasi/${id}`); // GANTI URL
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
          Tambah Paket Dekorasi
        </Button>
      </Group>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Harga</Table.Th>
            <Table.Th>Cover</Table.Th>
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* GANTI 'id_dokum' JADI 'id_dekorasi' */}
          {paketData?.data.map((paket: any) => (
            <Table.Tr key={paket.id_dekorasi}>
              <Table.Td>{paket.id_dekorasi}</Table.Td>
              <Table.Td>{paket.nama}</Table.Td>
              <Table.Td>Rp {paket.harga.toLocaleString('id-ID')}</Table.Td>
              
              <Table.Td>
                {paket.image_url ? (
                  <Image
                    src={getFullImageUrl(paket.image_url)}
                    height={60} w={90} radius="sm" fit="cover" alt={paket.nama}
                  />
                ) : (
                  <Text size="xs" c="dimmed">(No Image)</Text>
                )}
              </Table.Td>

              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="outline" leftSection={<IconEdit size={14} />} onClick={() => handleEdit(paket as PaketDekorasi)}>
                    Edit
                  </Button>
                  <Button size="xs" color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(paket.id_dekorasi!)}>
                    Hapus
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      <Group justify="center" mt="md">
        <Button onClick={() => setCursor(paketData?.meta.nextCursor || null)} disabled={!paketData?.meta.nextCursor}>
          Next Page
        </Button>
      </Group>

      <Modal opened={opened} onClose={close} title={selectedPaket ? 'Edit Paket' : 'Tambah Paket Baru'} centered>
        <PaketForm paket={selectedPaket} onClose={close} mutate={mutate} />
      </Modal>
    </>
  );
}

// ===================================================
// KOMPONEN HALAMAN UTAMA
// ===================================================
function DekorasiPage() {
  return (
    <SWRConfig> 
      <Title order={3} mb="md">Manajemen Paket Dekorasi</Title>
      <DekorasiTable />
    </SWRConfig>
  );
}

export default DekorasiPage;