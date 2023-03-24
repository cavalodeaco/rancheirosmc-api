import { ClassModelDb } from '../model/class-model-db.js';
import { EnrollModelDb } from '../model/enroll-model-db.js';
import { UserModelDb } from '../model/user-model-db.js';

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
    async download(filter) {
        console.log("ClassService.download");
        let enrolls = await EnrollModelDb.getByClass(filter);
        // for each enroll, get the user data
        for (const enroll of enrolls.Items) {
            const user = await UserModelDb.getById(enroll.user);
            enroll.user.name = user.name;
        }
        return enrolls;
    }
}

export { ClassService };