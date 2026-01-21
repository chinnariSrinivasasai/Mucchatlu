import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q || "";

    const users = await User.find({
      name: { $regex: q, $options: "i" },
      _id: { $ne: req.userId }, // exclude myself
    }).select("_id name avatar");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
    