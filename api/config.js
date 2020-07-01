module.exports = {
  db: {
    dialect: 'mariadb',
    user: 'root',
    pass: 'asdf12!@',
    host: process.env.DB_HOST || '13.125.102.235',
    port: '3306',
    name: 'workoutmate',
  },
}
