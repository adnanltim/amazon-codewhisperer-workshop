const AWS = require('aws-sdk');
const awsConfig = { 
  region: 'us-east-1',
  credentials: {        
    accessKeyId: '',
    secretAccessKey: '',
  }
}
AWS.config.update(awsConfig);
module.exports = {AWS}