const AWS = require('aws-sdk');
const awsConfig = { 
  region: 'us-east-1',
  credentials: {        
    accessKeyId: 'AKIA25EIMLTIYFEVMON3',
    secretAccessKey: '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',
  }
}
AWS.config.update(awsConfig);
module.exports = {AWS}