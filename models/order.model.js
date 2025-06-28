const mongodb = require('mongodb');
const db = require('../data/database');

class Order {
    // status = pending, fulfilled, cancelled
    constructor(cart, userData, status = 'pending', date, orderId) {
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date); // built in date to construct a value type // 2021-07-16
        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
        this.id = orderId;
    }

    static transformOrderDocument(orderDoc) {
        return new Order(
            orderDoc.productData,
            orderDoc.userData,
            orderDoc.status,
            orderDoc.date,
            orderDoc._id
        );
    }

    static transformOrderDocuments(orderDocs) {
        return orderDocs.map(this.transformOrderDocument);
    }

    static async findAll() {       // get all orders --> call transformOrderDocument
        const orders = await db
            .getDb()
            .collection('orders')
            .find()
            .sort({ _id: -1 })     // sort documents - descending order
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findAllForUser(userId) { // all order user
        const uid = new mongodb.ObjectId(userId);

        const orders = await db
            .getDb()
            .collection('orders')
            .find({ 'userData._id': uid })
            .sort({ _id: -1 })              // sort documents - descending order
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId) {    // find order by id
        const order = await db
            .getDb()
            .collection('orders')
            .findOne({ _id: new mongodb.ObjectId(orderId) });

        return this.transformOrderDocument(order);
    }

    save() {
        if (this.id) {
            const orderId = new mongodb.ObjectId(this.id);        // update orders if already have id 
            return db
                .getDb()
                .collection('orders')
                .updateOne({ _id: orderId }, { $set: { status: this.status } });
        } else {
            const orderDocument = {
                userData: this.userData,
                productData: this.productData,
                date: new Date(),
                status: this.status
            };
            console.dir(orderDocument);
            console.dir(this.userData);
            console.dir(this.productData);
            return db.getDb().collection('orders').insertOne(orderDocument);
        }
    }
}

module.exports = Order;