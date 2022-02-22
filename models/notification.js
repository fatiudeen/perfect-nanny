import mongoose from 'mongoose'

const notifSchema = new mongoose.Schema({
    sender:{type: String}/*{type: mongoose.Schema.Types.ObjectId}*/,
    type:{type: String},
    message:{email:{type: String},
    message:{type: String}
},
    treated:{
        type: Boolean,
        default: false
    }
})

export default mongoose.model('notification', notifSchema)