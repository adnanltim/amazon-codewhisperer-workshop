const {AWS} = require('./aws-config')

module.exports.handler = async (event) => {
  let emailBody = [];
  for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      const messageContent = JSON.parse(messageBody.Message)
      emailBody.push(messageContent[0]);
   }
  return sendImageLabel(emailBody);
}

// function to send json data in a table using ses
function sendImageLabel(data) {
   const params = {
      Destination: {
         ToAddresses: [
            'adnankh07@gmail.com'
         ]
      },
      Message: {
         Body: {
            Text: {
               Data: JSON.stringify(data)
            }
         },
         Subject: {
            Data: "Image Label"
         }
      },
      Source: "adnan.khan@ltimindtree.com"
   };
   return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
}
  