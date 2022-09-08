const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');

const app = express(); // new instance of express

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
});

app.post('/', (req, res) => {
    // get user's input
    const { firstname, lastname, email } = req.body;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const listId = '36a92461f1'
    const url = `https://us12.api.mailchimp.com/3.0/lists/${listId}`;

    const options = {
        method: 'POST',
        auth: 'shiori:a82e53bfd39d9d4ca86583fe7afbd912-us12'
    }

    // make post request to mailchimp
    const request = https.request(url, options, function(response){

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    });

    request.write(jsonData);
    request.end();
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
});

// Export the Express API
module.exports = app;