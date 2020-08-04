module.exports = {
  db: {
    dialect: 'mariadb',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || 'asdf12!@',
    host: process.env.DB_HOST || '52.78.157.48',
    port: '3306',
    name: 'workoutmate',
  },
}
