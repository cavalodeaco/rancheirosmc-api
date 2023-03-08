import { ClassModelDb } from '../model/class-model-db.js';

class ClassService {
    async create(data, admin_username) {
        console.log("ClassService.create");
        console.log(data, admin_username);
        const classModel = new ClassModelDb(data);
        const status = await classModel.save(admin_username);
        console.log("Status: ", status);
        return status;
    }
    async get(limit, page) {
        console.log("ClassService.get");
        return await ClassModelDb.get(limit, page);
    }
}

export { ClassService };