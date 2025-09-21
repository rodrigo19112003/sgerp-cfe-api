import bcrypt from "bcrypt";

function hashString(plainPassword: string) {
    const SALT_ROUNDS = 10;

    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);

    return hashedPassword;
}

async function compareHashedString(
    plainPassword: string,
    hashedPassword: string
) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
}

export { hashString, compareHashedString };
