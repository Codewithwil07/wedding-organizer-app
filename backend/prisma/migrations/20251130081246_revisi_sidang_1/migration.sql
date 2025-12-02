/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `akadresepsi` ADD COLUMN `image_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `busana` ADD COLUMN `image_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `dekorasi` ADD COLUMN `image_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `dokumentasi` ADD COLUMN `image_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `pesanan` ADD COLUMN `latitude` VARCHAR(50) NULL,
    ADD COLUMN `longitude` VARCHAR(50) NULL,
    ADD COLUMN `no_wa` VARCHAR(20) NULL,
    MODIFY `status` ENUM('pending', 'diterima', 'ditolak', 'dibatalkan') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
    ADD COLUMN `passwordResetToken` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `berita` (
    `id_berita` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(200) NOT NULL,
    `isi` TEXT NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_berita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kritik_saran` (
    `id_ks` INTEGER NOT NULL AUTO_INCREMENT,
    `isi` TEXT NOT NULL,
    `balasan` TEXT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_user` INTEGER NOT NULL,

    PRIMARY KEY (`id_ks`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_passwordResetToken_key` ON `user`(`passwordResetToken`);

-- AddForeignKey
ALTER TABLE `kritik_saran` ADD CONSTRAINT `kritik_saran_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
