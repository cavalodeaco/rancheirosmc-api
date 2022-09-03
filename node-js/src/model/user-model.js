import { model, Table as _Table } from "dynamoose";
//import { v4 as uuidv4 } from 'uuid';

const UserDynamo = model("User", { "id": String, "name": String });

class UserModel {
    
    constructor (name) {
        this.user = new UserDynamo ({
            "id": "1234",
            "name": name,
        });
        this.table = new _Table(process.env.TABLE_NAME, [UserDynamo]);
    }

    get () {
        return this.user;
    }

    async save () {
        await this.user.save();
    }

    static validate (data) {
        // Check if json has some keys
    }

    static async find (id) {
        return await UserDynamo.get(id);
    }
};

export default UserModel;