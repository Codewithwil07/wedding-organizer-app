import { useState } from "react";
import {
  Title,
  Table,
  Button,
  Group,
  Loader,
  Alert,
  Badge,
  Modal,
  Stack,
  Text,
  Divider,
  ActionIcon,
  Tooltip,
  Grid,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconCheck,
  IconX,
  IconEye,
  IconBrandWhatsapp,
  IconMapPin,
  IconCalendar,
  IconUser,
  IconMap,
} from "@tabler/icons-react";
import { useAdminPesanan, type Pesanan } from "../../api/usePesanan";
import api from "../../api";
import { notifications } from "@mantine/notifications";
import { StatusPesananEnum } from "../../utils/schemas";

// Komponen Badge Status
const StatusBadge = ({ status }: { status: StatusPesananEnum }) => {
  const color: Record<string, string> = {
    [StatusPesananEnum.pending]: "blue",
    [StatusPesananEnum.diterima]: "green",
    [StatusPesananEnum.ditolak]: "red",
    [StatusPesananEnum.dibatalkan]: "gray",
  };
  return <Badge color={color[status] || "gray"}>{status}</Badge>;
};

function PesananPage() {
  const [cursor, setCursor] = useState<number | null>(null);
  const { pesananData, isLoading, isError, mutate } = useAdminPesanan(cursor);

  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // State untuk Modal Detail
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPesanan, setSelectedPesanan] = useState<Pesanan | null>(null);

  // Fungsi Update Status
  const handleUpdateStatus = async (id: number, status: StatusPesananEnum) => {
    setIsUpdating(id);
    try {
      await api.put(`/admin/pesanan/${id}/status`, { status });
      notifications.show({
        title: "Berhasil!",
        message: `Pesanan berhasil diubah statusnya.`,
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      mutate();
    } catch (err: any) {
      notifications.show({
        title: "Gagal",
        message: err.response?.data?.message || "Gagal update status",
        color: "red",
        icon: <IconX size={18} />,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Fungsi Buka Modal Detail
  const handleOpenDetail = (pesanan: Pesanan) => {
    setSelectedPesanan(pesanan);
    open();
  };

  // Format Rupiah
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  // Format Tanggal
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <Alert color="red" icon={<IconAlertCircle />}>
        Gagal mengambil data pesanan
      </Alert>
    );

  return (
    <>
      <Title order={3} mb="md">
        Dashboard Pesanan Masuk
      </Title>

      <Table striped withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Total Harga</Table.Th>
            <Table.Th>Tanggal Acara</Table.Th>
            <Table.Th style={{ width: 180 }}>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pesananData?.data.map((pesanan: Pesanan) => (
            <Table.Tr key={pesanan.id_pesan}>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {pesanan.id_pesan}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {pesanan.user.username}
                </Text>
                <Text size="xs" c="dimmed">
                  {pesanan.user.email}
                </Text>
              </Table.Td>
              <Table.Td>
                <StatusBadge status={pesanan.status} />
              </Table.Td>
              <Table.Td>{formatRupiah(pesanan.harga)}</Table.Td>
              <Table.Td>
                {new Date(pesanan.waktu_awal).toLocaleDateString("id-ID")}
              </Table.Td>

              <Table.Td>
                <Group gap={6}>
                  {/* Tombol DETAIL (Mata) */}
                  <Tooltip label="Lihat Detail Lengkap">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleOpenDetail(pesanan)}
                    >
                      <IconEye size={18} />
                    </ActionIcon>
                  </Tooltip>

                  {/* Tombol Terima/Tolak (Hanya jika PENDING) */}
                  {pesanan.status === StatusPesananEnum.pending && (
                    <>
                      <Tooltip label="Terima Pesanan">
                        <ActionIcon
                          variant="light"
                          color="green"
                          loading={isUpdating === pesanan.id_pesan}
                          onClick={() =>
                            handleUpdateStatus(
                              pesanan.id_pesan,
                              StatusPesananEnum.diterima
                            )
                          }
                        >
                          <IconCheck size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Tolak Pesanan">
                        <ActionIcon
                          variant="light"
                          color="red"
                          loading={isUpdating === pesanan.id_pesan}
                          onClick={() =>
                            handleUpdateStatus(
                              pesanan.id_pesan,
                              StatusPesananEnum.ditolak
                            )
                          }
                        >
                          <IconX size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="md">
        <Button
          onClick={() => setCursor(pesananData?.meta.nextCursor || null)}
          disabled={!pesananData?.meta.nextCursor}
        >
          Next Page
        </Button>
      </Group>

      {/* =================================================== */}
      {/* MODAL DETAIL PESANAN */}
      {/* =================================================== */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} size="lg">
            Detail Pesanan
          </Text>
        }
        size="lg"
        centered
      >
        {selectedPesanan && (
          <Stack gap="md">
            {/* 1. Info Utama */}
            <Grid>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <ThemeIcon color="blue" variant="light">
                    <IconUser size={16} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed">
                      Pemesan
                    </Text>
                    <Text size="sm" fw={500}>
                      {selectedPesanan.user.username}
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <ThemeIcon color="orange" variant="light">
                    <IconCalendar size={16} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed">
                      Tanggal Acara
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(selectedPesanan.waktu_awal)}
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
            </Grid>

            <Divider />

            {/* 2. Alamat & Kontak (INI YANG LO MINTA) */}
            <Text fw={600} size="md">
              Lokasi & Kontak
            </Text>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Group align="flex-start" wrap="nowrap">
                <ThemeIcon color="red" variant="light" size="sm" mt={2}>
                  <IconMapPin size={14} />
                </ThemeIcon>
                <Text size="sm">{selectedPesanan.alamat}</Text>
              </Group>

              <Group mt="sm">
                {/* Tombol WA */}
                {selectedPesanan.no_wa && (
                  <Button
                    component="a"
                    href={`https://wa.me/${selectedPesanan.no_wa.replace(
                      /^0/,
                      "62"
                    )}`}
                    target="_blank"
                    size="xs"
                    leftSection={<IconBrandWhatsapp size={14} />}
                    color="green"
                    variant="light"
                  >
                    Hubungi ({selectedPesanan.no_wa})
                  </Button>
                )}
                {/* Tombol Maps */}
                {/* Tombol Maps */}
                {selectedPesanan.latitude && selectedPesanan.longitude && (
                  <Button
                    component="a"
                    // URL GOOGLE MAPS YANG BENER
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedPesanan.latitude},${selectedPesanan.longitude}`}
                    target="_blank"
                    size="xs"
                    leftSection={<IconMap size={14} />}
                    variant="light"
                  >
                    Buka Peta
                  </Button>
                )}
              </Group>
            </div>

            <Divider />

            {/* 3. Rincian Paket */}
            <Text fw={600} size="md">
              Paket yang Dipesan
            </Text>
            <Stack gap="xs">
              {/* Karena API list biasanya gak bawa detail paket (biar ringan), 
                   di sini kita cuma nampilin ringkasan harga. 
                   Kalo mau detail nama paket, backend 'getAllPesananAdmin' harus include paketnya juga.
                   Tapi total harga udah cukup buat overview. */}
              <Group justify="space-between">
                <Text size="sm">Total Biaya</Text>
                <Text size="lg" fw={700} c="blue">
                  {formatRupiah(selectedPesanan.harga)}
                </Text>
              </Group>
            </Stack>

            <Button fullWidth mt="md" onClick={close} variant="default">
              Tutup
            </Button>
          </Stack>
        )}
      </Modal>
    </>
  );
}

export default PesananPage;
