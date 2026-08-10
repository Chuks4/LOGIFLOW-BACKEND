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
    res.status(200).json({ status: true, data: user });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json({ status: true, message: result.message });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword({ token, newPassword });
    res.status(200).json({ status: true, message: result.message });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ status: false, message: error.message });
    } else {
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    res.status(200).json({ status: true, message: result.message });
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
  forgotPassword,
  resetPassword,
  verifyEmail,
};
