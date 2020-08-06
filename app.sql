CREATE DATABASE employee_db;

USE  employee_db;

CREATE TABLE department
(
    id INT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role
(
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);

CREATE TABLE employee
(
    id INT PRIMARY KEY,
    firtst_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
)