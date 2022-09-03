import UserModel from '../../model/user-model.js';

class EnrollService {
    static async enrollToWaitList(data) {
        const { name } = data;
        const user = new UserModel(name);
        await user.save();
        const userDynamo = user.get();
        const myOtherUser = await UserModel.find(userDynamo.id);
        return {userDynamo, myOtherUser};
    }
};

export default EnrollService;