var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    // the larger this value is, the stronger the encryption,
    // but the longer it will take to compare hashes;
    SALT_INDEX = 10;

//SET UP MONGODB SCHEMA
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    favoritePlaces: {
        type: Array,
        default: []
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

//MONGO PREHOOK
UserSchema.pre('save', function(next) {
    var user = this; // new User(req.body);

    user.email = user.email.toLowerCase();

    // ONLY HASH THE PASSWORD IF MODIFIED OR A NEW USER
    if (!user.isModified('password')) {
        return next();
    }
    // GENERATE A SALT VALUE TO ENCRYPT OUR PASSWORD
    bcrypt.genSalt(SALT_INDEX, function(saltErr, salt) {
        if (saltErr) {
            console.error(saltErr);
            return next(saltErr);
        }
        console.info('SALT GENERATED', salt);

        // HASH
        bcrypt.hash(user.password, salt, function(hashErr, hashedPassword) {
            if (hashErr) {
                console.error(hashErr);
                return next(hashErr);
            }
            // override the plain text password with the hashed one.
            user.password = hashedPassword;
            next();
        });
    });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
