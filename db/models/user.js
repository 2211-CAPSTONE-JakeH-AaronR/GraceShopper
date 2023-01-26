// grab our db client connection to use with our adapters
const client = require('../client');



async function getAllUsers() {
  /* this adapter should fetch a list of users from your db */
}

async function createUser({ username, password }) {

  // make sure to hash the password beore storing it.

  const SALT_COUNT = 64;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {

    const { rows: [user] } = await client.query(`
    INSERT INTO users (Username, Password)
    VALUES($1, $2)
    ON CONFLICT (Username) DO NOTHING
    RETURNING *;

    `, [username, hashedPassword])

    delete user.password;

    return user;


  } catch (error) {
    throw error;

  }
}


async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    if (!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }

}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM Users
    WHERE id = ${userId}
    `);

    if (!user) {
      return null;
    }

    delete user.password;
    return user;

  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM Users
    WHERE username =$1;
    `, [userName]);

    return user;
  } catch (error) {
    throw error;
  }

}




module.exports = {
  // add your database adapter fns here
  getAllUsers,
  createUser,
  getUser,
  getUserById,
  getUserByUsername
};