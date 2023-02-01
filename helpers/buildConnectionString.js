// Function to build a connection string from a pool
const buildConnectionString = (pool_params) => {
    const {host, port, user, password, database} = pool_params;
    return `mariadb://${user}:${password}@${host}:${port}/${database}`;
}

module.exports = buildConnectionString;