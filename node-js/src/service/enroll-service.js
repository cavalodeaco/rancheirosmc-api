const { UserModelDb: UserModel } = require('../model/user-model-db.js');
const { EnrollModelDb: EnrollModel } = require('../model/enroll-model-db.js');
const Ajv = require('ajv');
const CreateError = require('http-errors');
const { ClassModelDb: ClassModel } = require('../model/class-model-db.js');

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
        this.validateEnrollJson(data);

        // Create/Get User
        const { user } = data;
        const userModel = new UserModel(user);
        const userDynamo = await userModel.save();
        const user_id = { driver_license_UF: userDynamo.driver_license_UF, driver_license: userDynamo.driver_license };

        // check if user already has enroll in waiting
        console.log("check if user already has enroll in waiting");
        console.log(userDynamo.enroll);
        let enroll_id = await userDynamo.enroll.find(async (enrollId) => {
            const enroll = await EnrollModel.getById(enrollId);
            console.log(enroll.status);
            if (enroll.status == "waiting") {
                return { city: enroll.city, enroll_date: enroll.enroll_date };
            }
            return undefined;
        });

        // Create enrolls if not waiting
        let status = "waiting"; // already enrolled
        if (enroll_id == undefined) {
            const { enroll } = data;
            const enrollModel = new EnrollModel(enroll);
            const enrollDynamo = await enrollModel.save(user_id); // pass user ID (via PK)
            enroll_id = { city: enrollDynamo.city, enroll_date: enrollDynamo.enroll_date };
            // update user enrolls
            userDynamo.enroll.push(enroll_id); // append new enrollId
            await userModel.update(userDynamo.enroll);
            status = "enrolled" // new enroll created
        }

        // Local
        if (process.env.ENV == 'local') {
            console.log("User");
            console.log(await UserModel.getById(user_id));
            console.log("Enroll");
            console.log(await EnrollModel.getById(enroll_id));
        }

        return status;
    }

    validateEnrollJson(data) {
        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollSchema, data)
        if (!valid) {
            const mp = ajv.errors.map((error) => {
                return error.params.missingProperty;
            });
            throw CreateError[400]({ message: `Missing property on body: ${mp}` });
        }
    }
};

module.exports = EnrollService;