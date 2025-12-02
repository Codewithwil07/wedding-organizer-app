import { useState } from 'react';
import {
  Title, Table, Button, Group, Loader, Alert, Modal, Stack, TextInput, PasswordInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import useSWR, { SWRConfig } from 'swr'; 
import api from '../../api';
import { z } from 'zod';

// Kita bikin schema lokal aja biar cepet (mirip register)
const adminSchema = z.object({
  username: z.string().min(3, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
});
type AdminData = z.infer<typeof adminSchema>;

const fetcher = (url: string) => api.get(url).then(res => res.data);

// FORM COMPONENT
function AdminForm({ admin, onClose, mutate }: { admin: any, onClose: () => void, mutate: () => void }) {
  const isEditMode = !!admin;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminData>({
    resolver: zodResolver(adminSchema),
    defaultValues: isEditMode ? { 
      username: admin.username, 
      email: admin.email, 
      password: '' 
    } : { username: '', email: '', password: '' },
  });

  const onSubmit = async (data: AdminData) => {
    try {
      if (isEditMode) {
        // Kalo password kosong, jangan dikirim
        if (!data.password) delete (data as any).password;
        await api.put(`/admin/users/${admin.id_user}`, data);
        notifications.show({ title: 'Berhasil', message: 'Admin diupdate', color: 'teal' });
      } else {
        if (!data.password) {
           return notifications.show({ title: 'Gagal', message: 'Password wajib diisi untuk admin baru', color: 'red' });
        }
        // Kita perlu confirmPassword buat backend validator (kalo pake registerSchema)
        await api.post('/admin/users', { ...data, confirmPassword: data.password });
        notifications.show({ title: 'Berhasil', message: 'Admin baru dibuat', color: 'teal' });
      }
      mutate();
      onClose();
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message, color: 'red' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput label="Nama Lengkap" {...register('username')} error={errors.username?.message} />
        <TextInput label="Email" {...register('email')} error={errors.email?.message} disabled={isEditMode} />
        <PasswordInput 
          label={isEditMode ? "Password Baru (Kosongkan jika tidak ubah)" : "Password"} 
          {...register('password')} 
          error={errors.password?.message} 
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={isSubmitting}>{isEditMode ? 'Update' : 'Tambah'}</Button>
        </Group>
      </Stack>
    </form>
  );
}

// TABLE COMPONENT
function AdminTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { data, isLoading, error, mutate } = useSWR('/admin/users', fetcher);

  if (isLoading) return <Loader />;
  if (error) return <Alert color="red" icon={<IconAlertCircle />}>Gagal load data</Alert>;

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus admin ini?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        mutate();
      } catch (err) { alert('Gagal hapus'); }
    }
  };

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={14} />} onClick={() => { setSelectedAdmin(null); open(); }}>
          Tambah Admin
        </Button>
      </Group>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Nama</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data?.map((item: any) => (
            <Table.Tr key={item.id_user}>
              <Table.Td>{item.id_user}</Table.Td>
              <Table.Td>{item.username}</Table.Td>
              <Table.Td>{item.email}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="outline" onClick={() => { setSelectedAdmin(item); open(); }}><IconEdit size={14} /></Button>
                  <Button size="xs" color="red" onClick={() => handleDelete(item.id_user)}><IconTrash size={14} /></Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={selectedAdmin ? "Edit Admin" : "Tambah Admin"} centered>
        <AdminForm admin={selectedAdmin} onClose={close} mutate={mutate} />
      </Modal>
    </>
  );
}

export default function AdminPage() {
  return (
    <SWRConfig>
      <Title order={3} mb="md">Manajemen Admin</Title>
      <AdminTable />
    </SWRConfig>
  );
}