require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: '3306',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'employee_db',
});

const generalQuesions = [
  {
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: [
      'View employees',
      'View departments',
      'View roles',
      'Add employees',
      'Add departments',
      'Add roles',
      'Update employee',
      'Update departments',
      'Update roles',
      'None',
    ],
  },
];
const init = async () => {
  const { selection } = await inquirer.prompt(generalQuesions);

  if (selection === 'None') {
    connection.end();
    return;
  }
  switch (selection) {
    case 'View employees':
      findAllEmployees();
      break;
    case 'View roles':
      findAllRoles();
      break;
    case 'View departments':
      findAllDepartments();
      break;
    case 'Add employees':
      addEmployee();
      break;
    case 'Add departments':
      addDepartment();
      break;
    case 'Add roles':
      addRole();
      break;
    case 'Update employee':
      updateEmployee();
      break;
  }
};

/***********Employee Actions***********/
const findAllEmployees = () => {
  connection.query(
    `SELECT a.id,a.first_name,a.last_name,title,department.name AS department, CONCAT(b.first_name, ' ', b.last_name) AS Manager
    FROM employee a
    LEFT JOIN employee b ON a.manager_id = b.id
    LEFT JOIN role on a.role_id = role.id
    LEFT JOIN department on role.department_id = department.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      init();
    }
  );
};

const addEmployee = () => {
  connection.query('SELECT * FROM employee', async (err, employees) => {
    if (err) throw err;

    const employeeArray = [];

    employees.forEach((employee) =>
      employeeArray.push(employee['first_name'] + ' ' + employee['last_name'])
    );

    employeeArray.push('None');

    connection.query('SELECT * FROM role', async (err, roles) => {
      if (err) throw err;

      const roleArray = [];

      roles.forEach((role) => roleArray.push(role['title']));

      const { firstName, lastName, title, manager } = await inquirer.prompt([
        { name: 'firstName', message: "What's the employee's first name?" },
        { name: 'lastName', message: "What's the employee's last name?" },
        {
          type: 'list',
          name: 'title',
          message: "What's the employee's role?",
          choices: roleArray,
        },
        {
          type: 'list',
          name: 'manager',
          message: "What's the employee's Manager?",
          choices: employeeArray,
        },
      ]);

      const manager_firstName = manager.split(' ')[0];
      const manger_lastName = manager.split(' ')[1];

      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: firstName,
          last_name: lastName,
          role_id: roles.find((role) => role.title === title).id,
          manager_id:
            manager !== 'None'
              ? employees.find(
                  (employee) =>
                    employee.first_name === manager_firstName &&
                    employee.last_name === manger_lastName
                ).id
              : null,
        },
        (err) => {
          if (err) throw err;
          console.log('You have added a new employee successfully!');
          init();
        }
      );
    });
  });
};

const updateEmployee = () => {
  /*********Get all employees********/
  connection.query('SELECT * FROM employee', async (err, employees) => {
    if (err) throw err;

    const employeeArray = [];

    employees.forEach((employee) =>
      employeeArray.push(employee['first_name'] + ' ' + employee['last_name'])
    );

    /*********Get all roles********/
    connection.query('SELECT * FROM role', async (err, roles) => {
      if (err) throw err;

      const roleArray = [];

      roles.forEach((role) => roleArray.push(role['title']));

      const { employee, title } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee's role you want to update?",
          choices: employeeArray,
        },
        {
          type: 'list',
          name: 'title',
          message: "What's the employee's new role",
          choices: roleArray,
        },
      ]);

      const employee_firstName = employee.split(' ')[0];
      const employee_lastName = employee.split(' ')[1];

      //find the id of the employee to be updated
      const employee_id = employees.find(
        (employee) =>
          employee.first_name === employee_firstName &&
          employee.last_name === employee_lastName
      ).id;

      //find the id for the employee's new role
      const role_id = roles.find((role) => role.title === title).id;

      connection.query(
        'UPDATE employee SET ? WHERE ?',
        [{ role_id }, { id: employee_id }],
        (err) => {
          if (err) throw err;
          console.log(
            `You have successfully updated ${employee}'s role to ${title}!`
          );
          init();
        }
      );
    });
  });
};

/***********Role Actions***********/
const findAllRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

const addRole = async () => {
  connection.query('SELECT * FROM department', async (err, res) => {
    if (err) throw err;
    const { title, salary, department } = await inquirer.prompt([
      {
        name: 'title',
        message: "What's the title?",
      },
      { name: 'salary', message: "What's the salary for this role?" },
      {
        type: 'list',
        name: 'department',
        message: "What's the department this role belongs to?",
        choices: () => {
          const choiceArrary = [];
          res.forEach((item) => choiceArrary.push(item['name']));
          return choiceArrary;
        },
      },
    ]);

    connection.query(
      'INSERT INTO role SET ?',
      {
        title,
        salary: parseFloat(salary),
        department_id: res.find((item) => item.name === department).id,
      },
      (err) => {
        if (err) throw err;
        console.log('You have added a new role successfully!');
        init();
      }
    );
  });
};

/***********Department Actions***********/
const findAllDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt([
    { name: 'name', message: "What's the department name?" },
  ]);

  connection.query(
    'INSERT INTO department SET ?',
    {
      name,
    },
    (err) => {
      if (err) throw err;
      console.log('You have added a department successfully!');
      init();
    }
  );
};

init();
