DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_users$$
CREATE PROCEDURE sp_get_users()
BEGIN
    SELECT id, name, email, mobile, role, is_active, created_at, updated_at
    FROM users
    ORDER BY created_at DESC;
END$$

DROP PROCEDURE IF EXISTS sp_login$$
CREATE PROCEDURE sp_login(
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
)
BEGIN
    SELECT id, name, email, password, mobile, role, is_active
    FROM users
    WHERE email = p_email COLLATE utf8mb4_0900_ai_ci
      AND is_active = 1
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS sp_get_user_by_email$$
CREATE PROCEDURE sp_get_user_by_email(
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
)
BEGIN
    SELECT id, name, email, password, mobile, role, is_active, reset_token, reset_token_expires_at
    FROM users
    WHERE email = p_email COLLATE utf8mb4_0900_ai_ci
    LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS sp_create_user$$
CREATE PROCEDURE sp_create_user(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_mobile VARCHAR(30)
)
BEGIN
    INSERT INTO users (name, email, password, mobile)
    VALUES (p_name, p_email, p_password, p_mobile);

    SELECT LAST_INSERT_ID() AS id;
END$$

DROP PROCEDURE IF EXISTS sp_update_user$$
CREATE PROCEDURE sp_update_user(
    IN p_id INT,
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_mobile VARCHAR(30)
)
BEGIN
    UPDATE users
    SET name = p_name,
        email = p_email,
        mobile = p_mobile,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    SELECT p_id AS id;
END$$

DROP PROCEDURE IF EXISTS sp_delete_user$$
CREATE PROCEDURE sp_delete_user(IN p_id INT)
BEGIN
    DELETE FROM users WHERE id = p_id;
    SELECT p_id AS id;
END$$

DROP PROCEDURE IF EXISTS sp_forgot_password$$
CREATE PROCEDURE sp_forgot_password(
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_reset_token VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_expires_at DATETIME
)
BEGIN
    UPDATE users
    SET reset_token = p_reset_token,
        reset_token_expires_at = p_expires_at,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = p_email COLLATE utf8mb4_0900_ai_ci;

    SELECT ROW_COUNT() AS affected_rows;
END$$

DROP PROCEDURE IF EXISTS sp_set_reset_token$$
CREATE PROCEDURE sp_set_reset_token(
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_reset_token VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_expires_at DATETIME
)
BEGIN
    UPDATE users
    SET reset_token = p_reset_token,
        reset_token_expires_at = p_expires_at,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = p_email COLLATE utf8mb4_0900_ai_ci;

    SELECT ROW_COUNT() AS affected_rows;
END$$

DROP PROCEDURE IF EXISTS sp_get_products$$
CREATE PROCEDURE sp_get_products()
BEGIN
    SELECT id, name, price, quantity, created_at, updated_at
    FROM products
    ORDER BY created_at DESC;
END$$

DROP PROCEDURE IF EXISTS sp_create_product$$
CREATE PROCEDURE sp_create_product(
    IN p_name VARCHAR(150),
    IN p_price DECIMAL(10,2),
    IN p_quantity INT
)
BEGIN
    INSERT INTO products (name, price, quantity)
    VALUES (p_name, p_price, p_quantity);

    SELECT LAST_INSERT_ID() AS id;
END$$

DROP PROCEDURE IF EXISTS sp_update_product$$
CREATE PROCEDURE sp_update_product(
    IN p_id INT,
    IN p_name VARCHAR(150),
    IN p_price DECIMAL(10,2),
    IN p_quantity INT
)
BEGIN
    UPDATE products
    SET name = p_name,
        price = p_price,
        quantity = p_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    SELECT p_id AS id;
END$$

DROP PROCEDURE IF EXISTS sp_delete_product$$
CREATE PROCEDURE sp_delete_product(IN p_id INT)
BEGIN
    DELETE FROM products WHERE id = p_id;
    SELECT p_id AS id;
END$$

DROP PROCEDURE IF EXISTS sp_get_orders$$
CREATE PROCEDURE sp_get_orders()
BEGIN
    SELECT o.id,
           o.userId,
           o.productId,
           o.quantity,
           o.status,
           o.created_at,
           u.name AS user_name,
           p.name AS product_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.userId
    LEFT JOIN products p ON p.id = o.productId
    ORDER BY o.created_at DESC;
END$$

DROP PROCEDURE IF EXISTS sp_create_order$$
CREATE PROCEDURE sp_create_order(
    IN p_userId INT,
    IN p_productId INT,
    IN p_quantity INT,
    IN p_status VARCHAR(20)
)
BEGIN
    INSERT INTO orders (userId, productId, quantity, status)
    VALUES (p_userId, p_productId, p_quantity, p_status);

    SELECT LAST_INSERT_ID() AS id;
END$$

DROP PROCEDURE IF EXISTS sp_update_order$$
CREATE PROCEDURE sp_update_order(
    IN p_id INT,
    IN p_userId INT,
    IN p_productId INT,
    IN p_quantity INT,
    IN p_status VARCHAR(20)
)
BEGIN
    UPDATE orders
    SET userId = p_userId,
        productId = p_productId,
        quantity = p_quantity,
        status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

    SELECT p_id AS id;
END$$

DROP PROCEDURE IF EXISTS sp_delete_order$$
CREATE PROCEDURE sp_delete_order(IN p_id INT)
BEGIN
    DELETE FROM orders WHERE id = p_id;
    SELECT p_id AS id;
END$$

DELIMITER ;
