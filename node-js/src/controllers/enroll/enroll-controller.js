import { model, Table as _Table } from "dynamoose";
import { v4 as uuidv4 } from 'uuid';

const EnrollController = {
  postEnroll: async (req, res) => {
    const { name } = req.body;
    const User = model("User", { "id": String, "name": String });
    const Table = new _Table("ppv-table-dev", [User]);
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
    } catch (error) {
      console.error(error);
      res.json({ error })
    }
  }
}

export default EnrollController;