const {AWS} = require('./aws-config')

module.exports.handler = async (event) => {
    const items = await listItems(); 
    let imageLables = [];
    for (const item of items.Items) {
        const response = {
            "image": item.Image,
            "labels": JSON.parse(item.Label),
        }
        imageLables.push(response);
    }
    return imageLables;   
}

  // function to list all items from dynamodb table
  const listItems = async () => {
    const params = {
      TableName: 'ImageLabel',
    };
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const data = await dynamoDB.scan(params).promise();
    return data;
  }