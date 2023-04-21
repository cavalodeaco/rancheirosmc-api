const sinon = require('sinon');
const { expect } = require('chai');
const { ClassModelDb } = require('./file-to-be-tested.js');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

describe('ClassModelDb', () => {
  describe('save', () => {
    let dynamoDbDocStub;
    
    const classData = {
      name: 'PPV 2021-11-30 (Dubai)',
      city: 'Dubai',
      location: 'Dubai Sports City',
      date: '2021-11-30'
    };

    beforeEach(() => {
      dynamoDbDocStub = {
        send: sinon.stub()
      };
    });

    it('should insert the class details in dynamoDB', async () => {
      // Arrange
      dynamoDbDocStub.send.returns({
        Name: 'PPV 2021-11-30 (Dubai)',
        City: 'Dubai',
        Location: 'Dubai Sports City',
        Date: '2021-11-30',
        active: 'true'
      });

      // Act
      const classModelDb = new ClassModelDb(classData);
      const result = await classModelDb.save('admin_user');

      // Assert
      const params = {
        TableName: `${process.env.TABLE_NAME}-class`,
        Item: {
          name: classData.name,
          city: classData.city,
          location: classData.location,
          date: classData.date,
          active: 'true',
          created_at: sinon.match.string,
          updated_at: sinon.match.string,
          updated_by: 'admin_user'
        }
      };
      expect(dynamoDbDocStub.send.calledOnceWithExactly(sinon.match.has('TableName', params.TableName), sinon.match.has('PutCommand', sinon.match.has('Item', params.Item)))).to.be.true;
      expect(result).to.eql('created');
    });

    it('should throw 409 (Conflict) if class already exists', async () => {
      // Arrange
      const error = new Error();
      error.$metadata = {
        httpStatusCode: 409
      };
      dynamoDbDocStub.send.throws(error);

      // Act
      const classModelDb = new ClassModelDb(classData);
      try {
        await classModelDb.save('admin_user');
      } catch (err) {
        // Assert
        expect(err).to.have.property('statusCode', 409);
        expect(err).to.have.property('message', 'Class already exist!');
      }
    });
  });

  describe('getById', () => {
    let dynamoDbDocStub;
    const classData = {
      name: 'PPV 2021-11-30 (Dubai)',
      city: 'Dubai',
      location: 'Dubai Sports City',
      date: '2021-11-30'
    };
    
    beforeEach(() => {
      dynamoDbDocStub = {
        send: sinon.stub()
      };
    });

    it('should get class details by ID', async () => {
      // Arrange
      dynamoDbDocStub.send.returns({
        Item: classData
      });

      // Act
      const result = await ClassModelDb.getById({
        city: 'Dubai',
        date: '2021-11-30'
      });

      // Assert
      const params = {
        TableName: `${process.env.TABLE_NAME}-class`,
        Key: {
          city: 'Dubai',
          date: '2021-11-30'
        }
      };
      expect(dynamoDbDocStub.send.calledOnceWithExactly(sinon.match.has('TableName', params.TableName), sinon.match.has('GetCommand', sinon.match.has('Key', params.Key)))).to.be.true;
      expect(result).to.eql(classData);
    });
  });

  describe('update', () => {
    let dynamoDbDocStub;
    const classData = {
      city: 'Dubai',
      location: 'Dubai Sports City',
      date: '2021-11-30',
      active: 'true'
    };

    beforeEach(() => {
      dynamoDbDocStub = {
        send: sinon.stub()
      };
    });

    it('should update the class details', async () => {
      // Arrange
      dynamoDbDocStub.send.returns({
        Item: classData
      });

      // Act
      const result = await ClassModelDb.update(classData, 'admin_user');

      // Assert
      const params = {
        TableName: `${process.env.TABLE_NAME}-class`,
        Key: {
          city: 'Dubai',
          date: '2021-11-30'
        },
        UpdateExpression: "set active = :active, #location = :location, updated_at = :updated_at, updated_by = :updated_by",
        ExpressionAttributeNames: {
          "#location": "location"
        },
        ExpressionAttributeValues: {
          ":location": "Dubai Sports City",
          ":active": "true",
          ":updated_at": sinon.match.string,
          ":updated_by": "admin_user"
        }
      };
      expect(dynamoDbDocStub.send.calledOnceWithExactly(sinon.match.has('TableName', params.TableName), sinon.match.has('UpdateCommand', sinon.match.has('Key', params.Key).and(sinon.match.has('UpdateExpression', params.UpdateExpression)).and(sinon.match.has('ExpressionAttributeNames', params.ExpressionAttributeNames)).and(sinon.match.has('ExpressionAttributeValues', params.ExpressionAttributeValues))))).to.be.true;
      expect(result).to.eql(classData);
    });
  });

  describe('get', () => {
    let dynamoDbDocStub;

    beforeEach(() => {
      dynamoDbDocStub = {
        send: sinon.stub()
      };
    });

    it('should get list of classes', async () => {
      // Arrange
      dynamoDbDocStub.send.returns({
        Items: [{
          name: 'PPV 2021-11-30 (Dubai)',
          city: 'Dubai',
          location: 'Dubai Sports City',
          date: '2021-11-30'
        }],
        LastEvaluatedKey: { 
          city: 'Dubai',
          date: '2021-11-30'
        } 
      });

      // Act
      const { Items, page } = await ClassModelDb.get(10, 0, '', {}, {});

      // Assert
      const params = {
        TableName: `${process.env.TABLE_NAME}-class`,
        Limit: 10
      };
      expect(dynamoDbDocStub.send.calledOnceWithExactly(sinon.match.has('ScanCommand', sinon.match.has('TableName', params.TableName).and(sinon.match.has('Limit', params.Limit))))).to.be.true;
      expect(Items).to.eql([{
        name: 'PPV 2021-11-30 (Dubai)',
        city: 'Dubai',
        location: 'Dubai Sports City',
        date: '2021-11-30'
      }]);
      expect(page).to.eql({
        city: 'Dubai',
        date: '2021-11-30'
      });
    });
  });

  describe('validate', () => {
    it('should throw 400 (Bad Request) if class data is invalid', () => {
      // Arrange
      const invalidClassData = {
        name: null,
        city: 'dubai',
        location: 'Dubai Sports City',
        date: '2021-11-30'
      };
      
      // Act
      try {
        ClassModelDb.validate(invalidClassData);
      } catch (err) {
        // Assert
        expect(err).to.have.property('statusCode', 400);
        expect(err).to.have.property('message', 'Missing property on class: /name');
      }
    });
  });
});
