const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required: [true, 'Please provide company name'],
        maxlength: 50
    },
    position:{
        type:String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status:{
        type:String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please give a User']
    }
},{
    timestamps: true,
})

module.exports = mongoose.model('Job', JobSchema)

// The feild where Required is, the insertion of data should be mandetroy
// if not give it give [ VALIDATION ERROR ]