import { UserModelDb as UserModel } from '../../model/user-model-db.js';
import {EnrollModelDb as EnrollModel} from '../../model/enroll-model-db.js';
import Ajv from 'ajv';

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
            const enroll = await EnrollModel.find(enrollId);
            console.log(enroll.status);
            if (enroll.status == "waiting") {
                return enroll.SK;
            }
            return undefined;
        });

        // Create enrolls if not waiting
        let status = "waiting";
        if (enrollId == undefined) {
            const { enroll } = data;
            const enrollModel = new EnrollModel(enroll);
            const enrollDynamo = await enrollModel.save(userDynamo.SK); // pass user ID (via SK)
            enrollId = enrollDynamo.SK;
            // update user enrolls
            userDynamo.enroll.push(enrollId); // append new enrollId
            await userModel.update(userDynamo.enroll);
        }

        // Local
        if (process.env.ENV == 'local') {
            console.log("User");
            console.log(await UserModel.find(userDynamo.SK));
            console.log("Enroll");
            console.log(await EnrollModel.find(enrollId));
        }

        return status;
    }

    validateJson(data) {
        let missingProperty = {};

        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollSchema, data)
        if (!valid) {
            const mp = ajv.errors.map((error) => {
                return error.params.missingProperty;
            });
            missingProperty["body"] = mp;
        }

        // Validate User
        try {
            if (Object.keys(data).includes("user"))
                UserModel.validate(data.user);
        } catch (mp) {
            missingProperty["user"] = mp;
        }

        // Validate Enroll
        try {
            if (Object.keys(data).includes("enroll"))
                EnrollModel.validate(data.enroll);
        } catch (mp) {
            missingProperty["enroll"] = mp;
        }

        if (Object.keys(missingProperty).len == 0) {
            throw { message: { missingProperty: missingProperty }, status: 400 }
        }
    }
};

export default EnrollService;