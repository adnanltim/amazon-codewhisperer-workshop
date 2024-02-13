const {AWS} = require('./aws-config')
module.exports.handler = async (event) => {
  
  for (const record of event.Records) {
      const labelNames = [];
      const messageBody = JSON.parse(record.body);
      const messageContent = JSON.parse(messageBody.Message);
      console.log("message inside sendImageLabel ---", messageContent)
      const imageLabels = await detectImageLabels(messageContent.key);
      for (const label of imageLabels) {
        labelNames.push(label.Name);
      }
      await saveLabelsToDynamoDB(labelNames,messageContent.key);
   }
   
}

  // Detect labels from image with Rekognition as "labels"
  const detectImageLabels = async (key) => {
    const rekognition = new AWS.Rekognition(); 
    const params = {
      Image: {
        S3Object: {
          Bucket: 'code-whisperer-image-transformation',
          Name: key,
        },
      },
      MaxLabels: 10
    }
    const labels = await rekognition.detectLabels(params).promise();
    return labels.Labels;
  }

  // function to Save labels to DynamoDB
  const saveLabelsToDynamoDB = async (labels, key) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    let snsImageNotifications = [];
    let imageObject = {};
    imageObject = {
        Image: key,
        Label: JSON.stringify(labels),
      }
    const params = {
      TableName: 'ImageLabel',
      Item: imageObject
    }
    snsImageNotifications.push(imageObject);
    await dynamoDB.put(params).promise();
    await publishToSNS(snsImageNotifications);
  }

// function to publish message to sns topic
const publishToSNS = async (message) => {
  console.log("message in publishToSNS",message )
  const sns = new AWS.SNS();
  const params = {
    Message: JSON.stringify(message),
    TopicArn: 'arn:aws:sns:us-east-1:749757816017:dynamoDBInsertImageRekognition',
  }

  let snsPush = await sns.publish(params).promise();
}
