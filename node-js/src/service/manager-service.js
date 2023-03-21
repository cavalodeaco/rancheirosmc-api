import { EnrollModelDb as EnrollModel } from '../model/enroll-model-db.js';
import Ajv from 'ajv';
import CreateError from 'http-errors';
import { ClassModelDb as ClassModel } from '../model/class-model-db.js';

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

const regex = /^PPV (\d{2}\/\d{2}\/\d{4}) \((\w+)\)$/;

class ManagerService {
    async call2Class(data, admin_username) {
        console.log("ManagerService.call2Class");
        // Validate JSON data
        this.validateEnrollClassJson(data);

        const { enrolls } = data;
        const { class_name } = data;
        // validate if class exists
        const match = regex.exec(class_name); // PPV 11/03/2023 (curitiba)
        try {
            const date = match[1]; // "11/03/2023"
            const city = match[2]; // "curitiba"
            const class_ = await ClassModel.getById({city: city, date: date});
            if (class_ == undefined) {
                throw CreateError[400]({ message: `Turma não encontrada: ${class_name}` });
            }
        } catch (error) {
            throw CreateError[400]({ message: `Nome de turma inválido: ${class_name}` });
        }

        const message = { message: "ok", enrolls: []};
        for (const enroll of enrolls) {
            const enrollDynamo = await EnrollModel.getById({ city: enroll.city, enroll_date: enroll.enroll_date });
            console.log(enrollDynamo);
            if ((enrollDynamo.enroll_status == "waiting" || enrollDynamo.enroll_status == "dropped") 
                    && (enrollDynamo.class == "none" || enrollDynamo.class === undefined)){
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
        console.log("ManagerService.action2Class");
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
                    "condition": (enrollDynamo.enroll_status == "called" || enrollDynamo.enroll_status == "confirmed") && !(enrollDynamo.class == "none" || enrollDynamo.class === undefined),
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

export default ManagerService;