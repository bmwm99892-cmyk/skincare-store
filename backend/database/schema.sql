  CREATE DATABASE IF NOT EXISTS skincare_store
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

  USE skincare_store;

  CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name),
    UNIQUE KEY uq_categories_slug (slug)
  ) ENGINE=InnoDB
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(180) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(2048) NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_products_slug (slug),
    KEY idx_products_category_id (category_id),
    KEY idx_products_is_active (is_active),
    CONSTRAINT fk_products_category
      FOREIGN KEY (category_id) REFERENCES categories (id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
    CONSTRAINT chk_products_price_nonnegative CHECK (price >= 0)
  ) ENGINE=InnoDB
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
  ) ENGINE=InnoDB
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    customer_name VARCHAR(160) NOT NULL,
    customer_email VARCHAR(254) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    city VARCHAR(120) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cod') NOT NULL DEFAULT 'cod' COMMENT 'Cash on Delivery',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_orders_user_id (user_id),
    KEY idx_orders_created_at (created_at),
    KEY idx_orders_status (order_status, payment_status),
    CONSTRAINT fk_orders_user
      FOREIGN KEY (user_id) REFERENCES users (id)
      ON UPDATE CASCADE
      ON DELETE SET NULL,
    CONSTRAINT chk_orders_total_nonnegative CHECK (total_amount >= 0)
  ) ENGINE=InnoDB
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

  CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NULL,
    product_name VARCHAR(180) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_order_items_order_id (order_id),
    KEY idx_order_items_product_id (product_id),
    CONSTRAINT fk_order_items_order
      FOREIGN KEY (order_id) REFERENCES orders (id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
    CONSTRAINT fk_order_items_product
      FOREIGN KEY (product_id) REFERENCES products (id)
      ON UPDATE CASCADE
      ON DELETE SET NULL,
    CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_order_items_unit_price_nonnegative CHECK (unit_price >= 0),
    CONSTRAINT chk_order_items_subtotal_nonnegative CHECK (subtotal >= 0)
  ) ENGINE=InnoDB
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
