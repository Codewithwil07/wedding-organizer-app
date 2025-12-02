import { useState } from 'react';
import {
  Title, Table, Button, Group, Loader, Alert, Modal, Stack, Textarea, Text, Badge, ActionIcon, Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconTrash, IconMessageReply, IconCheck } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import useSWR, { SWRConfig } from 'swr'; 
import api from '../../api';
import { 
  replyKritikSchema, type ReplyKritikData 
} from '../../utils/schemas';

// Tipe Data
interface Kritik {
  id_ks: number;
  isi: string;
  balasan: string | null;
  tanggal: string;
  user: {
    nama_user: string;
    email: string;
  };
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

// ===================================================
// FORM BALASAN (MODAL)
// ===================================================
interface ReplyFormProps {
  kritik: Kritik; 
  onClose: () => void;
  mutate: () => void; 
}

function ReplyForm({ kritik, onClose, mutate }: ReplyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReplyKritikData>({
    resolver: zodResolver(replyKritikSchema),
    defaultValues: {
      balasan: kritik.balasan || '', // Kalo udah ada balasan, tampilin
    },
  });

  const onSubmit = async (data: ReplyKritikData) => {
    try {
      // PUT ke endpoint reply
      await api.put(`/admin/kritik/${kritik.id_ks}/reply`, data);
      
      notifications.show({ title: 'Berhasil!', message: 'Balasan terkirim.', color: 'teal' });
      mutate();
      onClose();
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Terjadi kesalahan', color: 'red' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <div style={{ backgroundColor: '#f8f9fa', padding: 10, borderRadius: 8 }}>
          <Text size="xs" c="dimmed" mb={4}>Pesan dari {kritik.user.nama_user}:</Text>
          <Text size="sm" style={{ fontStyle: 'italic' }}>"{kritik.isi}"</Text>
        </div>

        <Textarea 
          label="Balasan Admin" 
          placeholder="Tulis balasan Anda di sini..." 
          minRows={4} 
          {...register('balasan')} 
          error={errors.balasan?.message} 
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={isSubmitting} leftSection={<IconMessageReply size={16} />}>
            Kirim Balasan
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

// ===================================================
// TABEL KRITIK
// ===================================================
function KritikTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedKritik, setSelectedKritik] = useState<Kritik | null>(null);
  
  const { data, isLoading, error, mutate } = useSWR('/admin/kritik', fetcher);

  if (isLoading) return <Loader mt="xl" />;
  if (error) return <Alert color="red" icon={<IconAlertCircle />}>Gagal mengambil data</Alert>;

  const handleReply = (item: Kritik) => {
    setSelectedKritik(item);
    open();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin mau hapus kritik ini?')) {
      try {
        await api.delete(`/admin/kritik/${id}`);
        notifications.show({ title: 'Berhasil', message: 'Data dihapus', color: 'teal' });
        mutate();
      } catch (err: any) {
        notifications.show({ title: 'Gagal', message: err.response?.data?.message, color: 'red' });
      }
    }
  };

  return (
    <>
      <Table striped withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Pesan</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Tanggal</Table.Th>
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data?.map((item: Kritik) => (
            <Table.Tr key={item.id_ks}>
              <Table.Td>
                <Text size="sm" fw={500}>{item.user.nama_user}</Text>
                <Text size="xs" c="dimmed">{item.user.email}</Text>
              </Table.Td>
              
              <Table.Td style={{ maxWidth: 300 }}>
                <Text lineClamp={2} size="sm">"{item.isi}"</Text>
                {item.balasan && (
                  <Text size="xs" c="blue" mt={4}>
                    ↳ Balasan: {item.balasan}
                  </Text>
                )}
              </Table.Td>

              <Table.Td>
                {item.balasan ? (
                  <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>Dibalas</Badge>
                ) : (
                  <Badge color="yellow" variant="light">Menunggu</Badge>
                )}
              </Table.Td>

              <Table.Td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</Table.Td>
              
              <Table.Td>
                <Group gap="xs">
                  <Tooltip label="Balas Pesan">
                    <ActionIcon variant="filled" color="blue" onClick={() => handleReply(item)}>
                      <IconMessageReply size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Hapus">
                    <ActionIcon variant="light" color="red" onClick={() => handleDelete(item.id_ks)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      
      {/* MODAL BALAS */}
      <Modal
        opened={opened}
        onClose={close}
        title="Balas Kritik & Saran"
        centered
      >
        {selectedKritik && (
          <ReplyForm kritik={selectedKritik} onClose={close} mutate={mutate} />
        )}
      </Modal>
    </>
  );
}

export default function KritikPage() {
  return (
    <SWRConfig> 
      <Title order={3} mb="md">Kotak Kritik & Saran</Title>
      <KritikTable />
    </SWRConfig>
  );
}