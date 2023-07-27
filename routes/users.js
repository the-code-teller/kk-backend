var express = require('express');
var User = require('../models/user');
var router = express.Router();

const sgMail = require('@sendgrid/mail');
// import { setApiKey, send } from '@sendgrid/mail';
// import pkg from '@sendgrid/mail';
// const { setApiKey, send } = pkg;


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', function (req, res) {
    console.log('getting all users');
    User.find({}).exec(function (err, users) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(users);
            res.json(users);
        }
    });
});

router.get('/count', function (req, res) {
    console.log('getting count of all users');
    User.countDocuments({}).exec(function (err, count) {
        // console.log("Hello");
        // User.find({}).exec(function(err, users){
        if (err) {
            res.send('error has occured');
        } else {
            console.log(count);
            // res.json(users);
            res.json(count)
        }
    });
});

router.get('/:id', function (req, res) {
    console.log('getting one user');
    User.findOne({
        _id: req.params.id
    }).exec(function (err, user) {
        if (err) {
            res.send('error has occured');
        } else {
            console.log(user);
            res.json(user);
        }
    });
});

router.post('/', async (req, res) => {

    const { name, email } = req.body;
    const firstName = name.trim().split(/\s+/)[0];
    if (!name || !email) {
        return res.status(422).json({ error: "Please fill all fields" })
    }
    try {
        const userExists = await User.findOne({ email: email }).select({ _id: 1 })

        if (userExists) {
            return res.status(422).json({ error: 'Email already exists' })
        } else {
            const user = new User({ name, email })

            await user.save()

            const message = {
                to: email,
                // from: 'official@kanineklans.com',
                from: {
                    name: 'Kanine Klans',
                    email: 'official@kanineklans.com'
                },
                subject: 'Welcome to Kanine Klans - Pre-registration Confirmation',
                text: `Dear ${firstName},

We are thrilled to welcome you to Kanine Klans, the ultimate web 3.0 game that combines NFT, AR-VR, and metaverse technology. Our team of expert Game Designers, Developers, 3D Artists, and Product Managers has been working tirelessly to bring you an unforgettable gaming experience.
                
Your pre-registration for Kanine Klans has been confirmed and we are excited to have you as part of our community. We promise to provide you with a game like no other, where strategy, adventure, and community unite.
                
As a player, you will own your pack of unique and valuable digital Kanines, and explore a mind-blowing AR-VR world. In addition, our metaverse technology will create a vibrant community where you can trade, compete, and build virtual homes with fellow players.
                
We are on a mission to take gaming to a whole new level, and we can't do it without you. Your participation is crucial to our success, and we are grateful for the opportunity to create unforgettable gaming greatness together.

We will keep you updated on the latest developments and milestones of Kanine Klans. In the meantime, please share this exciting news with your friends and family who might be interested in joining our community.

Thank you for choosing Kanine Klans. We look forward to seeing you in the game!

Best,
The Kanine Klans Team.
`,
                // html: '<p>Hello from Kanine klans<p>'
            }

            await sgMail.send(message)
            // .then(response => console.log("Email sent"))
            // .catch(error => console.log(error.message))

            res.status(200).send("Registration successful");

        }
    } catch (err) {
        res.status(500).send(err)
    }
});

router.put('/:id', function (req, res) {
    User.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            name: req.body.name,
            email: req.body.email
        }
    }, {
        upsert: true
    }, function (err, newUser) {
        if (err) {
            res.send('error updating user');
        } else {
            console.log(newUser);
            res.send(newUser);
        }
    });
});

router.delete('/:id', function (req, res) {
    User.findByIdAndRemove({
        _id: req.params.id
    }, function (err, user) {
        if (err) {
            res.send('error deleting user');
        } else {
            console.log(user);
            res.send(user);
        }
    });
});

module.exports = router;