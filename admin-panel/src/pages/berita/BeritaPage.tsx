import { useState } from "react";
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
  Text,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconPlus,
  IconEdit,
  IconTrash,
  IconNews,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import useSWR, { SWRConfig } from "swr";
import api from "../../api";
import {
  createBeritaSchema,
  type CreateBeritaData,
  updateBeritaSchema,
  type UpdateBeritaData,
} from "../../utils/schemas";
import { SingleImageUploader } from "../../components/SingleImageUploader";

// Helper Gambar
const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  return `${api.defaults.baseURL?.replace("/api", "")}${url}`;
};

// Tipe Data
interface Berita {
  id_berita: number;
  judul: string;
  isi: string;
  image_url: string | null;
  tanggal: string;
}

// Fetcher SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

// ===================================================
// KOMPONEN FORM BERITA
// ===================================================
interface BeritaFormProps {
  berita: Berita | null;
  onClose: () => void;
  mutate: () => void;
}

function BeritaForm({ berita, onClose, mutate }: BeritaFormProps) {
  const isEditMode = !!berita;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBeritaData | UpdateBeritaData>({
    resolver: zodResolver(isEditMode ? updateBeritaSchema : createBeritaSchema),
    defaultValues: isEditMode
      ? berita
      : {
          judul: "",
          isi: "",
          image_url: null,
        },
  });

  const currentImageUrl = watch("image_url");

  const onSubmit = async (data: CreateBeritaData | UpdateBeritaData) => {
    try {
      if (isEditMode) {
        await api.put(`/admin/berita/${berita!.id_berita}`, data);
        notifications.show({
          title: "Berhasil!",
          message: "Berita di-update.",
          color: "teal",
        });
      } else {
        await api.post("/admin/berita", data);
        notifications.show({
          title: "Berhasil!",
          message: "Berita diposting.",
          color: "teal",
        });
      }
      mutate();
      onClose();
    } catch (err: any) {
      notifications.show({
        title: "Gagal",
        message: err.response?.data?.message || "Terjadi kesalahan",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Judul Berita"
          {...register("judul")}
          error={errors.judul?.message}
        />
        <Textarea
          label="Isi Berita"
          minRows={4}
          {...register("isi")}
          error={errors.isi?.message}
        />

        <SingleImageUploader
          urlToPreview={currentImageUrl}
          onUploadSuccess={(url) =>
            setValue("image_url", url, { shouldValidate: true })
          }
        />
        {errors.image_url && (
          <Text size="xs" c="red">
            {errors.image_url.message}
          </Text>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEditMode ? "Simpan Perubahan" : "Posting Berita"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

// ===================================================
// KOMPONEN TABEL BERITA
// ===================================================
function BeritaTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

  // Fetch semua berita (admin)
  const { data, isLoading, error, mutate } = useSWR("/admin/berita", fetcher);

  if (isLoading) return <Loader mt="xl" />;
  if (error)
    return (
      <Alert color="red" icon={<IconAlertCircle />}>
        Gagal mengambil data
      </Alert>
    );

  const handleEdit = (item: Berita) => {
    setSelectedBerita(item);
    open();
  };

  const handleCreate = () => {
    setSelectedBerita(null);
    open();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin mau hapus berita ini?")) {
      try {
        await api.delete(`/admin/berita/${id}`);
        notifications.show({
          title: "Berhasil",
          message: "Berita dihapus",
          color: "teal",
        });
        mutate();
      } catch (err: any) {
        notifications.show({
          title: "Gagal",
          message: err.response?.data?.message,
          color: "red",
        });
      }
    }
  };

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={14} />} onClick={handleCreate}>
          Tambah Berita Baru
        </Button>
      </Group>

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Judul</Table.Th>
            <Table.Th>Tanggal</Table.Th>
            <Table.Th>Gambar</Table.Th>
            <Table.Th>Aksi</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data?.map((item: Berita) => (
            <Table.Tr key={item.id_berita}>
              <Table.Td>{item.id_berita}</Table.Td>
              <Table.Td style={{ maxWidth: 300 }}>
                <Text truncate fw={500}>
                  {item.judul}
                </Text>
                <Text truncate size="xs" c="dimmed">
                  {item.isi}
                </Text>
              </Table.Td>
              <Table.Td>
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </Table.Td>
              <Table.Td>
                {item.image_url ? (
                  <Image
                    src={getFullImageUrl(item.image_url)}
                    height={50}
                    w={80}
                    radius="sm"
                    fit="cover"
                  />
                ) : (
                  <Text size="xs" c="dimmed">
                    -
                  </Text>
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <IconEdit size={14} />
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleDelete(item.id_berita)}
                  >
                    <IconTrash size={14} />
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={opened}
        onClose={close}
        title={selectedBerita ? "Edit Berita" : "Posting Berita Baru"}
        centered
        size="lg"
      >
        <BeritaForm berita={selectedBerita} onClose={close} mutate={mutate} />
      </Modal>
    </>
  );
}

export default function BeritaPage() {
  return (
    <SWRConfig>
      <Title order={3} mb="md">
        Manajemen Berita & Informasi
      </Title>
      <BeritaTable />
    </SWRConfig>
  );
}
