const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const register = async (req, res) => {
  //  const { name, email, password } = req.body;
  //  const salt = bcrypt.genSaltSync(10);
  //  const hashedPassword = await bcrypt.hash(password, salt);
  //  console.log(hashedPassword);
  //  const tempUser = { name, email, password: hashedPassword };

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  // const token = jwt.sign({ userId: user._id, name: user.name }, "jwtSecret", {
  //   expiresIn: "30d",
  // });

  res.status(StatusCodes.CREATED).json({ user: { name: user.name, token } });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name, token } });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

module.exports = {
  register,
  login,
};
