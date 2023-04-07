const sinon = require('sinon');
const {EnrollModelDb} = require('../models/enrollModelDb');
const {dynamoDbDoc} = require("../libs/ddb-doc.js");
const {PutCommand, GetCommand, UpdateCommand, QueryCommand, ScanCommand} = require('@aws-sdk/lib-dynamodb');
const Ajv = require('ajv');

describe('EnrollModelDb', () => {

    describe('save', () => {
        it('should save enroll data', async () => {
            const enrollData = {
                "user":{
                    "driver_license_UF":"driver_license_UF",
                    "driver_license":"driver_license"
                },
                "city":"city",
                "motorcycle":{
                    "brand":"brand",
                    "model":"model"
                },
                "use":"use",
                "terms":{
                    "authorization":true,
                    "responsibility":true,
                    "lgpd":true
                }
            };
            const putCommandStub = sinon.stub(dynamoDbDoc, 'send').returns({enroll: {enrollData}});
            await EnrollModelDb.save('userID');
            sinon.assert.calledOnceWithExactly(putCommandStub, sinon.match.instanceOf(PutCommand));
            putCommandStub.restore();
        });
    });

    describe('validate', () => {
        it('should validate enroll data with given schema', async () => {
            const enrollData = {
                "user":{
                    "driver_license_UF":"driver_license_UF",
                    "driver_license":"driver_license"
                },
                "city":"city",
                "motorcycle":{
                    "brand":"brand",
                    "model":"model"
                },
                "use":"use",
                "terms":{
                    "authorization":true,
                    "responsibility":true,
                    "lgpd":true
                }
            };
            const ajvStub = sinon.stub(Ajv.prototype, 'validate').returns(true);
            EnrollModelDb.validate(enrollData, EnrollModelDb.EnrollSchemaAjv);
            sinon.assert.calledOnceWithExactly(ajvStub, EnrollModelDb.EnrollSchemaAjv, enrollData);
            ajvStub.restore();
        });
    });

    describe('getById', () => {
        it('should get enroll data by enrollment id', async () => {
            const enrollId = {
                'city':'city',
                'enroll_date':'enroll_date'
            };
            const getCommandStub = sinon.stub(dynamoDbDoc, 'send').returns({Item: {enrollData}});
            await EnrollModelDb.getById(enrollId);
            sinon.assert.calledOnceWithExactly(getCommandStub, sinon.match.instanceOf(GetCommand));
            getCommandStub.restore();
        });
    });

    describe('updateEnrollStatusPlusClass', () => {
        it('should update enroll status and class', async () => {
            const enroll = {
                'city':'city',
                'enroll_date':'enroll_date',
                'enroll_status':'new_status',
                'class':'class'
            };
            const admin_username = 'admin_username';
            const updateCommandStub = sinon.stub(dynamoDbDoc, 'send').returns({Item: {enroll}});
            await EnrollModelDb.updateEnrollStatusPlusClass(enroll, admin_username);
            sinon.assert.calledOnceWithExactly(updateCommandStub, sinon.match.instanceOf(UpdateCommand));
            updateCommandStub.restore();
        });
    });

    describe('updateEnrollStatus', () => {
        it('should update enroll status', async () => {
            const enroll = {
                'city':'city',
                'enroll_date':'enroll_date',
                'enroll_status':'new_status'
            };
            const admin_username = 'admin_username';
            const updateCommandStub = sinon.stub(dynamoDbDoc, 'send').returns({Item: {enroll}});
            await EnrollModelDb.updateEnrollStatus(enroll, admin_username);
            sinon.assert.calledOnceWithExactly(updateCommandStub, sinon.match.instanceOf(UpdateCommand));
            updateCommandStub.restore();
        });
    });

    describe('saveLegacy', () => {
        it('should save legacy enroll data', async () => {
            const enrollData = {
                "user":{
                    "driver_license_UF":"driver_license_UF",
                    "driver_license":"driver_license"
                },
                "city":"city",
                "motorcycle":{
                    "brand":"brand",
                    "model":"model"
                },
                "use":"use",
                "terms":{
                    "authorization":true,
                    "responsibility":true,
                    "lgpd":true
                },
                "class":"class",
                "enroll_date":"enroll_date",
                "enroll_status":"enroll_status"
            };
            const putCommandStub = sinon.stub(dynamoDbDoc, 'send').returns({enroll: {enrollData}});
            await EnrollModelDb.saveLegacy('userID', 'admin_username');
            sinon.assert.calledOnceWithExactly(putCommandStub, sinon.match.instanceOf(PutCommand));
            putCommandStub.restore();
        });
    });

    describe('get', () => {
        it('should get enroll data', async () => {
            const scanCommandStub = sinon.stub(dynamoDbDoc, 'send').returns({
                Items: [{enrollData}],
                LastEvaluatedKey: undefined
            });
            await EnrollModelDb.get('limit', 'page', 'expression', 'attNames', 'attValues');
            sinon.assert.calledOnceWithExactly(scanCommandStub, sinon.match.instanceOf(ScanCommand));
            scanCommandStub.restore();
        });
    });
});
