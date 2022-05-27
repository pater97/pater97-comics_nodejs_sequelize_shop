//importo mongoose
const mongoose = require('mongoose');
//abilito la funzione di schema
const Schema = mongoose.Schema;

//creo il mio costrutto o schema

const comicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required:true
    },
    description: {
        type:String,
        required: true
    },
    image: {
        type: String,
        required:true
    },
    isNew: {
        type:Boolean,
        required:false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

module.exports = mongoose.model('Comic',comicSchema);