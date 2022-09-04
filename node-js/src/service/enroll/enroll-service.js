import {UserModel} from '../../model/user-model.js';
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
    static async enrollToWaitList(data) {
        // Validate JSON data
        EnrollService.validate(data);

        // Create User
        const { user } = data;
        const userModel = new UserModel(user);
        await userModel.save();

        // Test
        const userDynamo = userModel.get();
        const myOtherUser = await UserModel.find(userDynamo.id);

        return {userDynamo, myOtherUser};
    }

    static validate (data) {
        var missingProperty = {};

        // Validade main structure
        const ajv = new Ajv({allErrors:true})
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
        // try {
        //     if (Object.keys(data).includes("user"))
        //         UserModel.validate(data.user);
        // } catch (mp) {
        //     missingProperty["enroll"] = mp;
        // }

        if (Object.keys(missingProperty).len == 0) {
            throw {message: {missingProperty: missingProperty}, status: 400}
        }
    }
};

export default EnrollService;