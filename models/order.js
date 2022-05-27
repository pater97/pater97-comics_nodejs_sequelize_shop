//importo mongoose
const mongoose = require('mongoose');
//funzione schema
const Schema = mongoose.Schema;

//creo model costrutto da schema

const orderSchema = new Schema({
    comics: [
        {
            comic: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required:true
            }
        }
    ],
    user: {
        name: {
            type:String,
            required:true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref:'User'
        }
    }
});

module.exports = mongoose.model('Order',orderSchema);