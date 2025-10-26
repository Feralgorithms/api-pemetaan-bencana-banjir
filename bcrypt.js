import bcrypt from "bcrypt";


async function hashPw(plaintext) {
    const salt=10;
    const hashed= await bcrypt.hash(plaintext,salt);
    console.log(hashed)
}

hashPw('admin23')