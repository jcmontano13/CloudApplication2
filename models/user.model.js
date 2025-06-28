// require bcryptjs
const bcrypt = require('bcryptjs');

// require mongodb
const mongodb = require('mongodb');

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
    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db
            .getDb()
            .collection('users')
            .findOne({ _id: uid }, { projection: { password: 0 } });  // remove password
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        }
        return false;
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

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;