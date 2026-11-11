-- BidZone Enterprise Auction & Escrow Database Schema
-- Compatible with MySQL 8.0+ / MariaDB (XAMPP / phpMyAdmin)

CREATE DATABASE IF NOT EXISTS `bidzone_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bidzone_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `role` ENUM('BUYER', 'SELLER', 'ESCROW_OFFICER', 'ADMIN') NOT NULL DEFAULT 'BUYER',
  `avatar` TEXT NULL,
  `phone` VARCHAR(50) NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'United States',
  `kyc_status` ENUM('unverified', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'unverified',
  `kyc_document_type` VARCHAR(150) NULL,
  `verified_at` DATETIME NULL,
  `wallet_balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `held_in_bids` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `available_bidding_power` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_purchased` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_sold` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `seller_rating` DECIMAL(3, 2) DEFAULT 5.00,
  `sales_count` INT DEFAULT 0,
  `joined_date` VARCHAR(50) NULL,
  `two_factor_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Auctions Table
CREATE TABLE IF NOT EXISTS `auctions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `lot_number` INT NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subcategory` VARCHAR(100) NULL,
  `description` TEXT NOT NULL,
  `item_condition` VARCHAR(100) NOT NULL,
  `provenance` TEXT NULL,
  `starting_bid` DECIMAL(15, 2) NOT NULL,
  `current_bid` DECIMAL(15, 2) NOT NULL,
  `reserve_price` DECIMAL(15, 2) NOT NULL,
  `reserve_met` BOOLEAN NOT NULL DEFAULT FALSE,
  `min_increment` DECIMAL(15, 2) NOT NULL,
  `buy_now_price` DECIMAL(15, 2) NULL,
  `estimated_low` DECIMAL(15, 2) NOT NULL,
  `estimated_high` DECIMAL(15, 2) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `status` ENUM('draft', 'pending_approval', 'upcoming', 'live', 'ended', 'settled', 'cancelled') NOT NULL DEFAULT 'live',
  `is_live` BOOLEAN NOT NULL DEFAULT TRUE,
  `sniping_extended_minutes` INT NOT NULL DEFAULT 0,
  `bids_count` INT NOT NULL DEFAULT 0,
  `watchers_count` INT NOT NULL DEFAULT 0,
  `views_count` INT NOT NULL DEFAULT 0,
  `featured_image` TEXT NOT NULL,
  `images_json` LONGTEXT NULL,
  `specifications_json` LONGTEXT NULL,
  `seller_id` VARCHAR(64) NOT NULL,
  `escrow_protected` BOOLEAN NOT NULL DEFAULT TRUE,
  `inspection_period_days` INT NOT NULL DEFAULT 5,
  `shipping_origin` VARCHAR(150) NULL,
  `delivery_method` VARCHAR(255) NULL,
  `buyer_premium_percent` DECIMAL(5, 2) NOT NULL DEFAULT 7.50,
  `winning_bidder_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_auctions_seller` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bids Table
CREATE TABLE IF NOT EXISTS `bids` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `auction_id` VARCHAR(64) NOT NULL,
  `bidder_id` VARCHAR(64) NOT NULL,
  `bidder_name` VARCHAR(150) NOT NULL,
  `bidder_avatar` TEXT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `is_proxy` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_winning` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bids_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Proxy Bids Table
CREATE TABLE IF NOT EXISTS `proxy_bids` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `auction_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `max_amount` DECIMAL(15, 2) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_proxy_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proxy_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Escrow Orders Table
CREATE TABLE IF NOT EXISTS `escrow_orders` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `order_number` VARCHAR(64) NOT NULL UNIQUE,
  `auction_id` VARCHAR(64) NOT NULL,
  `auction_title` VARCHAR(255) NOT NULL,
  `auction_image` TEXT NULL,
  `buyer_id` VARCHAR(64) NOT NULL,
  `buyer_name` VARCHAR(150) NOT NULL,
  `seller_id` VARCHAR(64) NOT NULL,
  `seller_name` VARCHAR(150) NOT NULL,
  `hammer_price` DECIMAL(15, 2) NOT NULL,
  `buyer_premium` DECIMAL(15, 2) NOT NULL,
  `total_held` DECIMAL(15, 2) NOT NULL,
  `platform_fee` DECIMAL(15, 2) NOT NULL,
  `seller_payout` DECIMAL(15, 2) NOT NULL,
  `milestone` VARCHAR(64) NOT NULL,
  `inspection_deadline` DATETIME NOT NULL,
  `tracking_number` VARCHAR(150) NULL,
  `carrier` VARCHAR(150) NULL,
  `dispute_reason` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Watchlist Table
CREATE TABLE IF NOT EXISTS `watchlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `auction_id` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_auction` (`user_id`, `auction_id`),
  CONSTRAINT `fk_watch_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_watch_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Activity Logs Table
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NOT NULL,
  `severity` ENUM('info', 'warning', 'alert') NOT NULL DEFAULT 'info',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- INITIAL SEED DATA
-- ==========================================

INSERT IGNORE INTO `users` (`id`, `name`, `email`, `role`, `avatar`, `phone`, `country`, `kyc_status`, `kyc_document_type`, `verified_at`, `wallet_balance`, `held_in_bids`, `available_bidding_power`, `total_purchased`, `total_sold`, `seller_rating`, `sales_count`, `joined_date`, `two_factor_enabled`) VALUES
('usr-buyer-1', 'Alexander Vance', 'alexander.vance@investments.com', 'BUYER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', '+1 (555) 234-8901', 'United States', 'verified', 'Passport (Tier 3 Institutional)', '2026-01-15 10:00:00', 450000.00, 142500.00, 1200000.00, 890000.00, 0.00, 5.00, 0, 'October 2025', 1),
('usr-seller-1', 'Eleanor Sterling', 'eleanor@sterlingvaults.com', 'SELLER', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', '+44 20 7946 0912', 'United Kingdom', 'verified', 'Corporate Certificate of Incorporation', '2025-11-20 12:00:00', 820000.00, 0.00, 500000.00, 120000.00, 3450000.00, 4.98, 48, 'March 2025', 1),
('usr-escrow-1', 'Marcus Vance, Esq.', 'marcus.escrow@bidzone.com', 'ESCROW_OFFICER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', '+41 44 580 1290', 'Switzerland', 'verified', 'FINMA Fiduciary Officer', '2025-01-10 09:00:00', 14250000.00, 4800000.00, 0.00, 0.00, 0.00, 5.00, 0, 'January 2025', 1),
('usr-admin-1', 'Sophia Ray (Chief Curator)', 'admin@bidzone.com', 'ADMIN', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', '+1 (212) 555-0199', 'United States', 'verified', 'BidZone Executive Admin', '2025-01-01 08:00:00', 25000000.00, 0.00, 50000000.00, 0.00, 0.00, 5.00, 0, 'January 2025', 1);

INSERT IGNORE INTO `auctions` (`id`, `lot_number`, `title`, `slug`, `category`, `subcategory`, `description`, `item_condition`, `provenance`, `starting_bid`, `current_bid`, `reserve_price`, `reserve_met`, `min_increment`, `estimated_low`, `estimated_high`, `start_time`, `end_time`, `status`, `is_live`, `sniping_extended_minutes`, `bids_count`, `watchers_count`, `views_count`, `featured_image`, `images_json`, `specifications_json`, `seller_id`, `escrow_protected`, `inspection_period_days`, `shipping_origin`, `delivery_method`, `buyer_premium_percent`, `winning_bidder_id`) VALUES
('auc-1', 101, '1967 Shelby GT500 Fastback 428 Cobra Jet', '1967-shelby-gt500-fastback', 'Vehicles', 'Classic Muscle Cars', 'An authentic, numbers-matching 1967 Shelby GT500 Fastback finished in original Acapulco Blue with Wimbledon White Le Mans stripes. Documented in the official SAAC Registry with complete rotisserie restoration records and original build sheet signed by Carroll Shelby.', 'Restored Collector', 'Documented in Shelby World Registry (Chassis #01892), single collector ownership for past 22 years.', 85000.00, 142500.00, 130000.00, 1, 2500.00, 135000.00, 175000.00, DATE_SUB(NOW(), INTERVAL 48 HOUR), DATE_ADD(NOW(), INTERVAL 48 HOUR), 'live', 1, 0, 26, 312, 4890, 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"]', '{"Engine":"428 cu in (7.0 L) Police Interceptor V8","Transmission":"Toploader 4-Speed Manual","Mileage":"34,180 verified miles","VIN":"67400F2A01892"}', 'usr-seller-1', 1, 5, 'Scottsdale, Arizona, USA', 'Enclosed White-Glove Carrier', 7.50, 'usr-buyer-1'),
('auc-2', 102, 'Patek Philippe Grandmaster Chime Ref. 6300G-010 White Gold', 'patek-philippe-grandmaster-chime-6300g', 'Fine Watches', 'Haute Horlogerie Complications', 'The most complicated wrist watch ever made by Patek Philippe in continuous production. Featuring 20 complications, a reversible double-faced white gold case with guilloche hobnail patterning.', 'Brand New / Mint', 'Consigned from a private Geneva high-net-worth estate with Certificate of Origin.', 1200000.00, 1850000.00, 1800000.00, 1, 25000.00, 1800000.00, 2400000.00, DATE_SUB(NOW(), INTERVAL 24 HOUR), DATE_ADD(NOW(), INTERVAL 72 HOUR), 'live', 1, 2, 38, 680, 9240, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"]', '{"Reference":"6300G-010","Movement":"Manual Wind Caliber 300 GS AL 36-750","Case Material":"18K White Gold"}', 'usr-seller-1', 1, 7, 'Geneva FreePort, Switzerland', 'Armed Courier Custody to Buyer Bank Vault', 6.00, 'usr-other-4'),
('auc-3', 103, '1999 Pokemon 1st Edition Shadowless Charizard Holo BGS 10 Pristine', 'pokemon-1st-edition-charizard-bgs-10', 'Collectibles', 'Trading Card Grails', 'The Holy Grail of Trading Cards. Beckett Grading Services (BGS) 10 Pristine with subgrades: Centering 10, Corners 10, Edges 9.5, Surface 10.', 'Pristine Grade 10', 'Acquired directly from sealed 1999 Base Set Booster Box in 2021 by premier card syndicate.', 25000.00, 37500.00, 45000.00, 0, 1000.00, 45000.00, 65000.00, DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_ADD(NOW(), INTERVAL 36 HOUR), 'live', 1, 0, 22, 420, 6100, 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1200&q=80"]', '{"Card Number":"4/102","Year":"1999","Grading Authority":"Beckett Grading Services (BGS)"}', 'usr-seller-1', 1, 3, 'New York, USA', 'Insured FedEx Priority Overnight', 8.00, NULL),
('auc-4', 104, 'Original Apple-1 Computer (1976) Operational with Datanetics Keyboard', 'apple-1-computer-1976-operational', 'Tech & Artifacts', 'Historic Silicon & Computing', 'One of approximately 63 surviving Apple-1 motherboards hand-soldered by Steve Wozniak and Steve Jobs in the Jobs family garage.', 'Restored Collector', 'Purchased originally at The Byte Shop in Mountain View, CA in July 1976. Verified on Apple-1 Registry.', 300000.00, 495000.00, 450000.00, 1, 10000.00, 450000.00, 600000.00, DATE_SUB(NOW(), INTERVAL 120 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 'ended', 0, 4, 46, 940, 18500, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"]', '{"Board Number":"Apple-1 Registry #22","Processor":"MOS 6502 1.0 MHz"}', 'usr-seller-1', 1, 10, 'San Francisco, CA, USA', 'Personal Delivery by Technical Courier', 5.00, 'usr-buyer-1');

INSERT IGNORE INTO `bids` (`id`, `auction_id`, `bidder_id`, `bidder_name`, `amount`, `is_proxy`, `is_winning`) VALUES
('bid-101-1', 'auc-1', 'usr-buyer-1', 'Alexander Vance', 142500.00, 0, 1),
('bid-101-2', 'auc-1', 'usr-other-1', 'Collector_TX_99', 140000.00, 0, 0),
('bid-102-1', 'auc-2', 'usr-other-4', 'GenevaWatchClub', 1850000.00, 0, 1),
('bid-102-2', 'auc-2', 'usr-buyer-1', 'Alexander Vance', 1825000.00, 0, 0);

INSERT IGNORE INTO `escrow_orders` (`id`, `order_number`, `auction_id`, `auction_title`, `auction_image`, `buyer_id`, `buyer_name`, `seller_id`, `seller_name`, `hammer_price`, `buyer_premium`, `total_held`, `platform_fee`, `seller_payout`, `milestone`, `inspection_deadline`, `tracking_number`, `carrier`) VALUES
('escrow-ord-8812', 'BZ-ESC-88120', 'auc-4', 'Original Apple-1 Computer (1976) Operational with Datanetics Keyboard', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', 'usr-buyer-1', 'Alexander Vance', 'usr-seller-1', 'Eleanor Sterling', 495000.00, 24750.00, 519750.00, 14850.00, 480150.00, 'DELIVERED_INSPECTION_WINDOW', DATE_ADD(NOW(), INTERVAL 5 DAY), 'FEDEX-SECURE-9921827419', 'FedEx Armored Custom Critical');

INSERT IGNORE INTO `watchlist` (`user_id`, `auction_id`) VALUES
('usr-buyer-1', 'auc-1'),
('usr-buyer-1', 'auc-2');

INSERT IGNORE INTO `activity_logs` (`id`, `user_id`, `action`, `details`, `severity`) VALUES
('log-1', 'usr-buyer-1', 'AUCTION_BID_PLACED', 'Bid of $142,500 placed on Lot #101 by Alexander Vance', 'info');

