CREATE DATABASE employee_db;

USE  employee_db;

CREATE TABLE department(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR
(30)
);

CREATE TABLE role(
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR
(30),
  salary DECIMAL,
  department_id INT);

CREATE TABLE employee(
   id INT PRIMARY KEY AUTO_INCREMENT,
   firtst_name VARCHAR
(30),
   last_name VARCHAR
(30),
   role_id INT,
   manager_id INT);


SELECT a.id, a.first_name, a.last_name, CONCAT(b.first_name, ', ', b.last_name) AS Manager
FROM employee a, employee b
    LEFT JOIN a b ON a.manager_id = b.id;