import { useState } from "react";
import {
  FileInput,
  Button,
  Image,
  Text,
  LoadingOverlay,
  Stack, // <-- Gue ganti Group jadi Stack
} from "@mantine/core";
import { IconUpload, IconCheck, IconX } from "@tabler/icons-react";
import api from "../api"; // Instance Axios kita
import { notifications } from "@mantine/notifications";

// Tipe 'props' yang diterima komponen ini
interface SingleImageUploaderProps {
  initialUrl: string | null | undefined; // URL gambar yg udah ada (buat mode Edit)
  onUploadSuccess: (url: string) => void; // Fungsi 'callback' buat ngirim URL ke form
}

export function SingleImageUploader({
  initialUrl,
  onUploadSuccess,
}: SingleImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // 'previewUrl' ngambil dari 'initialUrl' (mode edit) atau 'null' (mode create)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl || null
  );

  // Fungsi yang jalan pas file dipilih
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    // Bikin preview lokal (biar user bisa liat)
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(initialUrl || null); // Balikin ke foto awal kalo di-clear
    }
  };

  // Fungsi yang jalan pas tombol 'Upload' diklik
  const handleUpload = async () => {
    if (!file) return; // Kalo ga ada file, gajadi

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file); // 'image' harus match 'upload.single('image')'

    try {
      // Tembak API Upload
      const response = await api.post<{ url: string }>(
        "/upload/single",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { url } = response.data; // Dapet balikan: "/uploads/foto-123.jpg" (RELATIF)

      // 3. Update preview & PANGGIL CALLBACK
      setPreviewUrl(url); // Ganti preview-nya jadi URL RELATIF
      onUploadSuccess(url); // Kirim URL RELATIF ini ke 'PaketForm' (RHF)
      setFile(null); // Kosongin file

      notifications.show({
        title: "Berhasil",
        message: "Gambar cover berhasil di-upload",
        color: "teal",
        icon: <IconCheck />,
      });
    } catch (err: any) {
      notifications.show({
        title: "Gagal Upload",
        message: err.response?.data?.message,
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setUploading(false);
    }
  };

  // ===================================================
  // INI FUNGSI YANG UDAH 100% BENER (THE FIX)
  // ===================================================
  const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return ''; // 1. Kalo null/kosong
    
    // 2. Kalo udah 'blob:' (preview lokal)
    if (url.startsWith('blob:')) {
      return url;
    }

    // 3. Kalo udah 'http://' (mungkin data lama, jaga-jaga)
    if (url.startsWith('http')) {
      return url;
    }
    
    // 4. Kalo path relatif ('/uploads/...')
    // Ambil 'http://localhost:3000/api' dan GANTI '/api' jadi string kosong
    return `${api.defaults.baseURL?.replace('/api', '')}${url}`;
  };
  // ===================================================


  return (
    // Gue ganti 'div' jadi 'Stack' biar rapi
    <Stack gap="xs" style={{ position: "relative" }}>
      <LoadingOverlay visible={uploading} />

      {/* 3. Tampilan Preview */}
      {previewUrl ? (
        <Image
          src={getFullImageUrl(previewUrl)}
          height={180}
          radius="md" // <-- Tambahin radius
          alt="Preview Upload"
        />
      ) : (
        <Text size="sm" ta="center" c="dimmed" mb="sm">
          (Belum ada gambar)
        </Text>
      )}

      {/* 1. Input File */}
      <FileInput
        label="Pilih Foto Cover"
        placeholder="Klik untuk pilih foto..."
        onChange={handleFileChange}
        accept="image/png,image/jpeg"
        value={file} // <-- Tambahin ini biar bisa di-clear
      />

      {/* 2. Tombol Upload */}
      <Button
        mt="sm"
        leftSection={<IconUpload size={14} />}
        onClick={handleUpload}
        disabled={!file || uploading} // Tombol mati kalo ga ada file BARU / lagi upload
        fullWidth
      >
        Upload Foto
      </Button>
    </Stack>
  );
}