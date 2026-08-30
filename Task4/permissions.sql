CREATE USER IF NOT EXISTS 'store_manager'@'localhost'
IDENTIFIED BY 'StoreManager123!';

GRANT SELECT, INSERT, UPDATE
ON retail_store.*
TO 'store_manager'@'localhost';

REVOKE UPDATE
ON retail_store.*
FROM 'store_manager'@'localhost';

GRANT DELETE
ON retail_store.Sales
TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;
