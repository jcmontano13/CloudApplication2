const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function deploySchemaAndCreateAdmin() {
  const uri = "your_mongodb_atlas_connection_string"; // Replace with your Atlas URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("your_database_name");
    const collectionName = "users";

    // Define JSON schema for the users collection including new fields
    const schema = {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "password", "role", "name", "address", "isAdmin"],
        properties: {
          email: {
            bsonType: "string",
            pattern: "^.+@.+$",
            description: "must be a valid email string and is required"
          },
          password: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          role: {
            enum: ["admin", "user"],
            description: "can only be 'admin' or 'user' and is required"
          },
          name: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          address: {
            bsonType: "object",
            required: ["street", "postalCode", "city"],
            properties: {
              street: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              postalCode: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              city: {
                bsonType: "string",
                description: "must be a string and is required"
              }
            }
          },
          isAdmin: {
            bsonType: "bool",
            description: "must be a boolean and is required"
          }
        }
      }
    };

    const options = {
      validator: schema,
      validationLevel: "strict",
      validationAction: "error"
    };

    // Check if collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray();

    if (collections.length === 0) {
      await db.createCollection(collectionName, options);
      console.log(`Collection '${collectionName}' created with schema validation.`);
    } else {
      await db.command({
        collMod: collectionName,
        validator: schema,
        validationLevel: "strict",
        validationAction: "error"
      });
      console.log(`Collection '${collectionName}' schema validation updated.`);
    }

    // Hash the password with salt rounds 12
    const plainPassword = 'password';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Prepare admin user doc with new fields
    const adminUser = {
      email: 'cloudAdmin2@yahoo.com',
      password: hashedPassword,
      role: 'admin2',
      name: 'adminUser2',
      address: {
        street: 'admin street',
        postalCode: '00000',
        city: 'Auckland'
      },
      isAdmin: true
    };

    // Check if admin user exists
    const existingAdmin = await db.collection(collectionName).findOne({ email: adminUser.email });

    if (!existingAdmin) {
      await db.collection(collectionName).insertOne(adminUser);
      console.log("Initial admin user created.");
    } else {
      console.log("Admin user already exists, skipping creation.");
    }

  } catch (error) {
    console.error("Error deploying schema or creating admin user:", error);
  } finally {
    await client.close();
  }
}

deploySchemaAndCreateAdmin();