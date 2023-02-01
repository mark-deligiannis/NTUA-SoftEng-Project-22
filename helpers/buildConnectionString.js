// Function to build a connection string from a pool
const buildConnectionString = (pool) => {
    const { host, user, password, database } = pool;
    return `mariadb://${user}:${password}@${host}/${database}`;
}

module.exports = buildConnectionString;