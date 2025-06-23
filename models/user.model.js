// require bcryptjs
const bcrypt = require('bcryptjs');

// require db
const db = require('../data/database');

// create a class JS feature blueprints for object in the future
class User {            //method that will call automatically when you create an instance with new keywword
    constructor(email, password, fullname, street, postal, city) {
        this.email = email; 
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        };
    }
    
    // store the property in the database
    async signup() {
        // hash password
        const hashedPassword = await bcrypt.hash(this.password, 12);

        // insert into db
        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address
        });
    }
}

module.exports = User;