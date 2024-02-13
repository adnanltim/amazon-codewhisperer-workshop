// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require('axios');
const {AWS} = require('./aws-config')

// Function to get a file from url
const downloadImage = async (imageUrl, name) => {
  const url = imageUrl;
  console.log('image is', url)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  }).then((response) => {
    return uploadImage(response.data, name);
  });
 
}

// Function to upload image to S3
const uploadImage = async (image, name) => {
  const params = {
    Bucket: 'code-whisperer-image-transformation',
    Key: name,
    Body: image,
  };
  const s3 = new AWS.S3();
  const uploadResult = await s3.upload(params).promise();
  const topicCreation = await createTopic();
  console.log("respose from image", uploadResult)
  const snsMessage = {"key": name}
  const publishMessages = await publishMessage(JSON.stringify(snsMessage));
  return uploadResult;
}

// function to convert url into encoded url
const encodeUrl = (url) => {
  return encodeURIComponent(url);
}

// function to create sns topic when object uploaded to s3 bucket
const createTopic = async () => {
  const sns = new AWS.SNS();
  const params = {
    Name: 'image-transformation-topic',
  };
  const topic = await sns.createTopic(params).promise();
  console.log("topic created", topic);
  return topic;
}

// function to publish message to sns topic
const publishMessage = async (messageBody) => {
  const sns = new AWS.SNS();
  const params = {
    Message: messageBody,
    TopicArn: "arn:aws:sns:us-east-1:749757816017:image-transformation-topic",
  };
  const message = await sns.publish(params).promise();
  console.log("message published", message);
  return message;
}

// function to fetch messages from sns topic
const fetchMessages = async () => {
  const sns = new AWS.SNS();
  const params = {
    TopicArn: "arn:aws:sns:us-east-1:749757816017:image-transformation-topic",
  };
  const messages = await sns.listSubscriptionsByTopic(params).promise();
  console.log("messages fetched", messages);
  return messages;
}
 
module.exports.handler = async (event) => {
  const imageContent = await downloadImage(event.queryStringParameters.url, event.queryStringParameters.name);
  const snsTopicSubs = await fetchMessages();
  return snsTopicSubs;
}

module.exports.downloadImage = downloadImage;
module.exports.uploadImage = uploadImage;