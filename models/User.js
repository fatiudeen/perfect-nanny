import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true, 'please provide a valid email'],
        match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please provide a valid email'
        ],
        collation: {
        locale : 'en',
        strength : 2
      },
        unique: [true, 'User exists']
    },
    phoneNumber:[{type: String,
        required:[true, 'Enter a valid Phone Number'],
        minlength: [11,'phone number cannot be less than eleven digits'],
        maxlength: [11, 'phone number cannot be more than eleven digits']
    }],

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
        minlength: [8,'password cannot be less than eight'],
        select: false
    },

    verificationToken:{type: String}, 
    resetToken:{type: String}, 

    verified:{
        type: String,
        enum: ['Not Verified', 'Pending','verified'],
        default: 'Not Verified'
    },

    personalInformation: {
        
        avi:{
            type: String,
            required: false,
        },

        location:{
            address:{type: String},

            area:{type: String},
            
            lga:{type: String},

            state:{type: String},
        },

        age:{type: Number},

        occupation:{type: String},

        kids:{
            number:{type: Number},
            age:[{type: Number}],
            class:[{type: String}]
        },

        homePictures:[{type: String}],

        maritalStatus:{
            type: String,
            enum: { values: ['Single', 'Dating','Enguaged','Married', 'Divorced', 'Widowed'],
            message: '{VALUE} is not valid'
            }
        },

        photos:[{type: String}],

        typeOfHelper:{
            type: String,
            enum: { values: ['Baby Sitter', 'House Keeper', 'Both'],
            message: '{VALUE} is not valid'
            }
        },

        education:{
            type: String,
            enum: { values: ['Secondary', 'HND','OND','Diploma', 'Bachelors Degree', 'None'],
            message: '{VALUE} is not valid'
            }
        },

        yearsOfExperience:{ type: Number},

        workingHours:{
            from: {type: Date},
            to: {type: Date}
        },

        // typeOfChores:[{
        //     type: String,
        //     validate: {
        //         validator: function(v,x,z) {
        //             return !(5 >= this.todoList.length >= 5);  
        //         }, 
        //         message: props => `${props.value} exceeds maximum array size (5)!`
        //       },
        //     }
        // ],


    },

    preference:{
        typeOfHelper:{
            type: String,
            enum: { values: ['Baby Sitter', 'House Keeper', 'Both', 'Others'],
            message: '{VALUE} is not valid'
            }
        },

        workingHours:{
            from: {type: Date},
            to: {type: Date}
        },

        // typeOfChores:[{type: String}],

        age:{
            from :{type: Number},
            to :{type: String}
        },

        yearsOfExperience:{ type: Number},

        maritalStatus:{
            type: String,
            enum: { values: ['Single', 'Dating','Enguaged','Married', 'Divorced', 'Widowed'],
            message: '{VALUE} is not valid'
            }
        },

        education:{type: String},

    },

    role: {
        type: String,
        required: true,
        enum: { values: ['User', 'Helper', 'Admin'],
                message: '{VALUE} is not a valid role'
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    
    },

    avi:{
        type: String,
        required: false,
    },



});

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    
    if(this.role === 'Administrator'){
        this.isAdmin = true
    }
    next()
        
    })

// userSchema.pre('find', async function (next){
//     this.populate('department')
//     next()
// })

userSchema.methods.comparePasswords = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.getSignedToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT} )
}

export default  mongoose.model('User', userSchema);
