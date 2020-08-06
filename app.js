const dotenv = require('dotenv');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
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
      'Update employees',
      'Update departments',
      'Update roles',
    ],
  },
];
const init = async () => {
  const { selection } = await inquirer.prompt(generalQuesions);
  console.log(selection);
};

init();
