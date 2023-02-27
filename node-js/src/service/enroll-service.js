import { UserModelDb as UserModel } from '../model/user-model-db.js';
import {EnrollModelDb as EnrollModel } from '../model/enroll-model-db.js';
import Ajv from 'ajv';
import CreateError from 'http-errors';

const EnrollSchema = {
    type: "object",
    properties: {
        user: { type: "object" },
        enroll: { type: "object" }
    },
    required: ["user", "enroll"],
    additionalProperties: false
}

class EnrollService {
    async enrollToWaitList(data) {
        console.log("EnrollService.enrollToWaitList");
        // Validate JSON data
        this.validateJson(data);

        // Create/Get User
        const { user } = data;
        const userModel = new UserModel(user);
        const userDynamo = await userModel.save();

        // check if user already has enroll in waiting
        console.log("check if user already has enroll in waiting");
        console.log(userDynamo.enroll);
        let enrollId = await userDynamo.enroll.find(async (enrollId) => {
            const enroll = await EnrollModel.getById(enrollId);
            console.log(enroll.status);
            if (enroll.status == "waiting") {
                return {id: enroll.PK, city: enroll.city};
            }
            return undefined;
        });

        // Create enrolls if not waiting
        let status = "waiting"; // already enrolled
        if (enrollId == undefined) {
            const { enroll } = data;
            const enrollModel = new EnrollModel(enroll);
            const enrollDynamo = await enrollModel.save(userDynamo.PK); // pass user ID (via PK)
            enrollId = {id: enrollDynamo.PK, city: enrollDynamo.city};
            // update user enrolls
            userDynamo.enroll.push(enrollId); // append new enrollId
            await userModel.update(userDynamo.enroll);
            status = "enrolled" // new enroll created
        }

        // Local
        if (process.env.ENV == 'local') {
            console.log("User");
            console.log(await UserModel.getById(userDynamo.PK));
            console.log("Enroll");
            console.log(await EnrollModel.getById(enrollId));
        }

        return status;
    }

    validateJson(data) {
        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollSchema, data)
        if (!valid) {
            const mp = ajv.errors.map((error) => {
                return error.params.missingProperty;
            });
            throw CreateError[400](`Missing property on body: ${mp}`);
        }
    }
};

export default EnrollService;