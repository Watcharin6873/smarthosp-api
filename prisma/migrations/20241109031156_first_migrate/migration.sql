-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `title_th` VARCHAR(191) NOT NULL,
    `firstname_th` VARCHAR(191) NOT NULL,
    `lastname_th` VARCHAR(191) NOT NULL,
    `hcode` VARCHAR(191) NOT NULL,
    `hname_th` VARCHAR(191) NOT NULL,
    `position_id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `sub_district` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `objective` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category_quest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name_th` VARCHAR(191) NOT NULL,
    `category_name_eng` VARCHAR(191) NOT NULL,
    `fiscal_year` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quest_name` VARCHAR(191) NOT NULL,
    `category_questId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sub_quest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sub_quest_name` TEXT NOT NULL,
    `sub_quest_total_point` INTEGER NOT NULL,
    `sub_quest_require_point` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `necessary` BOOLEAN NOT NULL DEFAULT false,
    `questId` INTEGER NOT NULL,
    `category_questId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_questId` INTEGER NOT NULL,
    `piont` INTEGER NOT NULL,
    `hcode` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `questId` INTEGER NOT NULL,
    `sub_questId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evidence_document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documents` VARCHAR(191) NOT NULL,
    `evaluateId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Quest` ADD CONSTRAINT `Quest_category_questId_fkey` FOREIGN KEY (`category_questId`) REFERENCES `Category_quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_quest` ADD CONSTRAINT `Sub_quest_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `Quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sub_quest` ADD CONSTRAINT `Sub_quest_category_questId_fkey` FOREIGN KEY (`category_questId`) REFERENCES `Category_quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluate` ADD CONSTRAINT `Evaluate_category_questId_fkey` FOREIGN KEY (`category_questId`) REFERENCES `Category_quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluate` ADD CONSTRAINT `Evaluate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluate` ADD CONSTRAINT `Evaluate_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `Quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluate` ADD CONSTRAINT `Evaluate_sub_questId_fkey` FOREIGN KEY (`sub_questId`) REFERENCES `Sub_quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evidence_document` ADD CONSTRAINT `Evidence_document_evaluateId_fkey` FOREIGN KEY (`evaluateId`) REFERENCES `Evaluate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
