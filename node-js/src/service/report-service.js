import {EnrollModelDb as EnrollModel} from "../model/enroll-model-db.js";
import { UserModelDb as UserModel } from "../model/user-model-db.js";

class ReportService {
    async getEnrolls (limit, page, id_token) {
        console.log("Service: getEnrolls");

        // check cities in city string separeted by comma and create a dynamo filter following city = value
        const cities = id_token["custom:cities"].split(",");
        let cityFilter = "*";
        for (let i = 0; i < cities.length; i++) {
            if (i == 0)
                cityFilter = `city = "${cities[i]}"`;
            else
                cityFilter += ` OR city = "${cities[i]}"`;
        }
        console.log(cityFilter);

        // create a filter like cities but using status information from filter separated by coma
        const statuses = id_token["custom:enroll_status"].split(",");
        let statusFilter = "*";
        for (let i = 0; i < statuses.length; i++) {
            if (i == 0)
                statusFilter = `status = "${statuses[i]}"`;
            else
                statusFilter += ` OR status = "${statuses[i]}"`;
        }
        console.log(statusFilter);

        if (cities.length > 0 && statuses.length > 0) {
            const expression = `(${cityFilter}) AND (${statusFilter})`;
            console.log(expression);
        } else if (cities.length > 0) {
            const expression = cityFilter;
            console.log(expression);
        } else if (statuses.length > 0) {
            const expression = statusFilter;
            console.log(expression);
        }
        
        return { status: 200, data: await EnrollModel.get(limit, page, expression)}
    }

    async getUsers (limit, page) {
        console.log("Service: getUsers");
        return { status: 200, data: await UserModel.get(limit, page)}
    }
}

export default ReportService;