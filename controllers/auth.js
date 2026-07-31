const authService = require("../services/auth");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const accessToken = await authService.login(email, password, { req, res });
    res.status(200).json({ status: true, ...accessToken });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

const refreshToken = async (req, res) => {
  try {
    const accessToken = await authService.refreshToken({ req, res });
    res.status(200).json({ status: true, ...accessToken });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout({ req, res });
    res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

const register = async (req, res) => {
  try {
    const data = req.body;
    const user = await authService.register(data);
    res.status(200).json({ status: true, user });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  register,
};
