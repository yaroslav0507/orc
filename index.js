var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.route('/api')
  .post(function (req, res) {
    console.log(req.query.webhook);

    var requestFields = req.body.ordered_human_fields;
    var fullName = `${requestFields[0].value} ${requestFields[1].value}`;

    var form = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": "ff0100",
      "summary": `${fullName} submitted a new form`,
      "sections": [{
        "activityTitle": `![TestImage](https://47a92947.ngrok.io/Content/Images/default.png)${fullName} posted a new form`,
        "activitySubtitle": req.body.created_at,
        "activityImage": "https://cdn1.iconfinder.com/data/icons/seo-and-internet-marketing-1/64/Icon_planchette_questionnaire-512.png",
        "facts": [{
          "name": "First Name",
          "value": requestFields[0].value
        },
          {
            "name": "Last Name",
            "value": requestFields[1].value
          },
          {
            "name": "Email",
            "value": requestFields[2].value
          },
          {
            "name": "Phone",
            "value": requestFields[3].value
          },
          {
            "name": "Message",
            "value": requestFields[4].value
          }],
        "markdown": true
      }]
    };

    var clientServerOptions = {
      uri: req.query.webhook,
      body: JSON.stringify(form),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    request(clientServerOptions, function (error, response) {
      if (error) {
        res.send(error);
      }

      res.sendStatus(response.statusCode)
    });
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});