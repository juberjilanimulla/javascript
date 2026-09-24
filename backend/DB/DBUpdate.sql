-- stored procedure create the user
--23/09/26 
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_create_user$$
CREATE PROCEDURE sp_create_user(

    IN p_first_name VARCHAR(255),   
    IN p_middle_name VARCHAR(255),     
    IN p_last_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),

)
BEGIN
    INSERT INTO users (first_name, middle_name, last_name, email, password)
    VALUES (p_first_name, p_middle_name, p_last_name, p_email, p_password);
    SET p_insert_id = LAST_INSERT_ID();
END $$
DELIMITER;
