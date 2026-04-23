-- Migration: Add ctaButtonLabel and ctaButtonUrl to project table
-- Run this SQL on your production database to enable per-project CTA button customization

ALTER TABLE `project` ADD COLUMN `ctaButtonLabel` VARCHAR(191) NULL;
ALTER TABLE `project` ADD COLUMN `ctaButtonUrl` VARCHAR(191) NULL;
