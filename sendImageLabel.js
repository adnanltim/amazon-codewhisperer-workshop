const {AWS} = require('./aws-config')

module.exports.handler = async (event) => {
  let emailBody = [];
  for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      const messageContent = JSON.parse(messageBody.Message)
      emailBody.push(messageContent[0])
      console.log("message inside sendImageLabel ---", emailBody)
   }
  return sendEmail(emailBody);
}

// function to send json data in a table using ses
function sendEmail(data) {
   const params = {
      Destination: {
         ToAddresses: [
            'adnan.khan@ltimindtree.com'
         ]
      },
      Message: {
         Body: {
            Text: {
               Data: JSON.stringify(data)
            }
         },
         Subject: {
            Data: "Amazon Code Whisperer Workshop"
         }
      },
      Source: "adnan.khan@ltimindtree.com"
   };
   return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
}
 
