const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const normalizedPassword = password == null ? "" : String(password);

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const normalizedPassword = password == null ? "" : String(password);

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (typeof user.password !== "string" || !user.password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isBcryptHash = user.password.startsWith("$2");
    const isMatch = isBcryptHash ? await bcrypt.compare(normalizedPassword, user.password) : normalizedPassword === user.password;

    if (!isBcryptHash && isMatch) {
      const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const profile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  profile,
};
