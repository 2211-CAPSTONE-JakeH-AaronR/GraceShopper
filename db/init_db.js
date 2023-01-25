const { useResolvedPath } = require('react-router-dom');
const {
  client,
  // declare your model imports here
  // for example, User
} = require('./');

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    await client.query(`
    CREATE TABLE "Products" (
      "int" <type>,
      "VARCHAR(255)" <type>,
      "money" <type>,
      "VARCHAR(2550)" <type>,
      "int" <type>,
      CONSTRAINT "FK_Products.int"
        FOREIGN KEY ("int")
          REFERENCES "Products"("int")
    );
    
    CREATE INDEX "ProductId" ON  "Products" ("int");
    
    CREATE INDEX "Name" ON  "Products" ("VARCHAR(255)");
    
    CREATE INDEX "Price" ON  "Products" ("money");
    
    CREATE INDEX "Desc" ON  "Products" ("VARCHAR(2550)");
    
    CREATE INDEX "Amount" ON  "Products" ("int");
    
    CREATE TABLE "OrderLine" (
      "int" <type>,
      "int" <type>,
      "int" <type>,
      "int" <type>,
      "money" <type>,
      CONSTRAINT "FK_OrderLine.int"
        FOREIGN KEY ("int")
          REFERENCES "Products"("int")
    );
    
    CREATE INDEX "OrderLineId" ON  "OrderLine" ("int");
    
    CREATE INDEX "OrderId" ON  "OrderLine" ("int");
    
    CREATE INDEX "ProductId" ON  "OrderLine" ("int");
    
    CREATE INDEX "Quantity" ON  "OrderLine" ("int");
    
    CREATE INDEX "CurrentPrice" ON  "OrderLine" ("money");
    
    CREATE TABLE "Order" (
      "int" <type>,
      "int" <type>,
      "int" <type>,
      CONSTRAINT "FK_Order.int"
        FOREIGN KEY ("int")
          REFERENCES "OrderLine"("int")
    );
    
    CREATE INDEX "OrderId" ON  "Order" ("int");
    
    CREATE INDEX "CustomerId" ON  "Order" ("int");
    
    CREATE INDEX "OrderStatusId" ON  "Order" ("int");
    
    CREATE TABLE "Users" (
      "int" <type>,
      "VARCHAR(255)" <type>,
      "String" <type>,
      "string" <type>,
      "string?" <type>,
      "VARCHAR(255)" <type>,
      CONSTRAINT "FK_Users.int"
        FOREIGN KEY ("int")
          REFERENCES "Order"("int")
    );
    
    CREATE INDEX "CustomerId" ON  "Users" ("int");
    
    CREATE INDEX "Password" ON  "Users" ("VARCHAR(255)");
    
    CREATE INDEX "Email" ON  "Users" ("String");
    
    CREATE INDEX "Address1" ON  "Users" ("string");
    
    CREATE INDEX "Address2" ON  "Users" ("string?");
    
    CREATE INDEX "Name" ON  "Users" ("VARCHAR(255)");
    
    CREATE TABLE "OrderStatus" (
      "int" <type>,
      "VARCHAR(255)" <type>
    );
    
    CREATE INDEX "OrderStatusId" ON  "OrderStatus" ("int");
    
    CREATE INDEX "Name" ON  "OrderStatus" ("VARCHAR(255)");
    `)
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
    const user1 = await `${Users}`.createUser({
      CustomerId: 2000,
      Password: 12345678,
      Email: 'hopperjake@icloud.com',
      Address1: '245 Cherry Lane',
      Name: Jake
    })
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
