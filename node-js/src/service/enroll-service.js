import { UserModelDb as UserModel } from '../model/user-model-db.js';
import { EnrollModelDb as EnrollModel } from '../model/enroll-model-db.js';
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

const EnrollCallSchema = {
    type: "object",
    properties: {
        enrolls: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    city: { type: "string" },
                    enroll_date: { type: "string" }
                },
                required: ["city", "enroll_date"]
            }
        },
        class_name: { type: "string" }
    },
    required: ["class_name", "enrolls"],
    additionalProperties: false
}

const EnrollConfirmCertifyMissDropSchema = {
    type: "object",
    properties: {
        enrolls: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    city: { type: "string" },
                    enroll_date: { type: "string" }
                },
                required: ["city", "enroll_date"]
            }
        },
    },
    required: ["enrolls"],
    additionalProperties: true
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

    async call2Class(data, admin_username) {
        console.log("EnrollService.call2Class");
        // Validate JSON data
        this.validateEnrollClassJson(data);

        const { enrolls } = data;
        const { class_name } = data;
        const message = { message: "ok", enrolls: []};
        for (const enroll of enrolls) {
            const enrollDynamo = await EnrollModel.getById({ city: enroll.city, enroll_date: enroll.enroll_date });
            console.log(enrollDynamo);
            if (enrollDynamo.enroll_status == "waiting" && (enrollDynamo.class == "none" || enrollDynamo.class === undefined) ){
                enrollDynamo.enroll_status = "called";
                enrollDynamo.class = class_name;
                await EnrollModel.updateEnrollStatusPlusClass(enrollDynamo, admin_username);
                message.enrolls.push(await EnrollModel.getById({ city: enroll.city, enroll_date: enroll.enroll_date }));
            } else {
                message.message = "partial";
                message.enrolls.push(enrollDynamo);
            }
        }
        return message;
    }

    validateEnrollClassJson(data) {
        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollCallSchema, data)
        if (!valid) {
            const mp = ajv.errors.map((error) => {
                return error.params.missingProperty;
            });
            throw CreateError[400]({ message: `Missing property on body: ${mp}` });
        }
    }

    async action2Class(data, admin_username, type) {
        console.log("EnrollService.action2Class");
        // Validate JSON data
        this.validateEnrollConfirmCertifyMissDropSchema(data);

        const { enrolls } = data;
        const message = { message: "ok", enrolls: []};
        for (const enroll of enrolls) {
            const enrollDynamo = await EnrollModel.getById({ city: enroll.city, enroll_date: enroll.enroll_date });
            const action2ClassValidation = {
                "confirm": {
                    "condition": enrollDynamo.enroll_status == "called" && !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
                    "status": "confirmed"
                },
                "certify": {
                    "condition": enrollDynamo.enroll_status == "confirmed" && !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
                    "status": "certified"
                },
                "miss": {
                    "condition": enrollDynamo.enroll_status == "confirmed" && !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
                    "status": "missed"
                },
                "drop": {
                    "condition": enrollDynamo.enroll_status == "called" && !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
                    "status": "dropped"
                },
            }
            if (action2ClassValidation[type].condition){
                enrollDynamo.enroll_status = action2ClassValidation[type].status;
                if (type == "drop") {
                    enrollDynamo.class = "none";
                    await EnrollModel.updateEnrollStatusPlusClass(enrollDynamo, admin_username);
                } else {
                    await EnrollModel.updateEnrollStatus(enrollDynamo, admin_username);
                }                
                message.enrolls.push(await EnrollModel.getById({ city: enroll.city, enroll_date: enroll.enroll_date }));
            } else {
                message.message = "partial";
                message.enrolls.push(enrollDynamo);
            }
        }
        return message;
    }

    validateEnrollConfirmCertifyMissDropSchema(data) {
        // Validade main structure
        const ajv = new Ajv({ allErrors: true })
        const valid = ajv.validate(EnrollConfirmCertifyMissDropSchema, data)
        if (!valid) {
            const mp = ajv.errors.map((error) => {
                return error.params.missingProperty;
            });
            throw CreateError[400]({ message: `Missing property on body: ${mp}` });
        }
    }
};

export default EnrollService;