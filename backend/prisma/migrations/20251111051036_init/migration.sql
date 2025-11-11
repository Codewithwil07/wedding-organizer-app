-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `nama_user` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `role` ENUM('admin', 'pemesan') NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumentasi` (
    `id_dokum` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(200) NOT NULL,
    `harga` INTEGER NOT NULL,
    `jenis` ENUM('photo') NOT NULL,

    PRIMARY KEY (`id_dokum`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `busana` (
    `id_busana` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(200) NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id_busana`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dekorasi` (
    `id_dekorasi` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(200) NOT NULL,
    `harga` INTEGER NOT NULL,
    `jenis` ENUM('koade') NOT NULL,

    PRIMARY KEY (`id_dekorasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `akadresepsi` (
    `id_ar` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(200) NOT NULL,
    `harga` INTEGER NOT NULL,

    PRIMARY KEY (`id_ar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan` (
    `id_pesan` INTEGER NOT NULL AUTO_INCREMENT,
    `harga` INTEGER NOT NULL,
    `status` ENUM('pending', 'diterima', 'ditolak') NOT NULL DEFAULT 'pending',
    `alamat` VARCHAR(100) NOT NULL,
    `waktu_awal` DATE NOT NULL,
    `waktu_akhir` DATE NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_dokum` INTEGER NULL,
    `id_busana` INTEGER NULL,
    `id_dekorasi` INTEGER NULL,
    `id_ar` INTEGER NULL,

    PRIMARY KEY (`id_pesan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_dokum_fkey` FOREIGN KEY (`id_dokum`) REFERENCES `dokumentasi`(`id_dokum`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_busana_fkey` FOREIGN KEY (`id_busana`) REFERENCES `busana`(`id_busana`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_dekorasi_fkey` FOREIGN KEY (`id_dekorasi`) REFERENCES `dekorasi`(`id_dekorasi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_ar_fkey` FOREIGN KEY (`id_ar`) REFERENCES `akadresepsi`(`id_ar`) ON DELETE SET NULL ON UPDATE CASCADE;
