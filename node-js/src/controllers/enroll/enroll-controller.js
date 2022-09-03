import { model, Table as _Table } from "dynamoose";
import { v4 as uuidv4 } from 'uuid';

const EnrollController = {
  postEnroll: async (req, res, next) => {
    const { name } = req.body;
    const User = model("User", { "id": String, "name": String });
    console.log(process.env.TABLE_NAME);
    try {
      const Table = new _Table(process.env.TABLE_NAME, [User]);
    } catch (err) {
      next(err);
    }
    const myUser = new User({
      "id": "1234",
      "name": name,
    });

    try {
      await myUser.save();
      console.log("Save operation was successful.");
      const myOtherUser = await User.get("1234");
      console.log(myOtherUser);
      res.json({ myUser, myOtherUser })
    } catch (err) {
      next(err);
    }
  }
}

export default EnrollController;