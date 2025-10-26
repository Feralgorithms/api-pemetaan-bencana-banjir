import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabaseClient.js";
import 'dotenv/config';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
