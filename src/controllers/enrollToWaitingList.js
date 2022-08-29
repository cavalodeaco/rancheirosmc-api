const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  const { name } = req.body;
  const User = dynamoose.model("NewUser", { "id": Number, "name": String });
  const myUser = new User({
    "id": 1,
    "name": name,
  });

  try {
    await myUser.save();
    console.log("Save operation was successful.");
    const myOtherUser = await User.get(1);
    console.log(myOtherUser);
    res.json({ myUser, myOtherUser })
  } catch (error) {
    console.error(error);
    res.json({ error })
  }
};

