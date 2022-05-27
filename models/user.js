//importo mongoose
const mongoose = require('mongoose');
//funzione schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    cart: {
        items: [
            {
                comicId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Comic',
                    required:true
                },
                quantity: {
                    type:Number,
                    required:true
                }
            }
        ]
    }
});

//creo una funzione per aggiungere al carrello i fumetti
userSchema.methods.addToCart = function(comic){
    const cartComicIndex = this.cart.items.findIndex(cc => {
        return cc.comicId.toString() === comic._id.toString();
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartComicIndex >= 0) {
        newQuantity = this.cart.items[cartComicIndex].quantity + 1;
        updatedCartItems[cartComicIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            comicId : comic._id,
            quantity: newQuantity
        })
    };
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};
//creo una funzione per rimuovere articoli dal carrello
userSchema.methods.removeFromCart = function(comicId){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.comicId.toString() !== comicId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

//ripulire il carrello 
userSchema.methods.clearCart = function(){
    this.cart = { items: []};
    return this.save();
};

module.exports = mongoose.model('User',userSchema);