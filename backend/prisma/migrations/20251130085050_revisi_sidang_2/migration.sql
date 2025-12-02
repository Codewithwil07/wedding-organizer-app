/*
  Warnings:

  - You are about to drop the column `nama_user` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `nama_user`,
    ADD COLUMN `username` VARCHAR(100) NULL;
