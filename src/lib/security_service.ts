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

function generateSecurePassword(): string {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!$%&_¿?*";
    const allChars = upperChars + lowerChars + numbers + specialChars;

    const minLength = 8;
    const maxLength = 16;
    const passwordLength =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    const requiredChars = [
        upperChars[Math.floor(Math.random() * upperChars.length)],
        lowerChars[Math.floor(Math.random() * lowerChars.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    const remainingLength = passwordLength - requiredChars.length;
    for (let i = 0; i < remainingLength; i++) {
        requiredChars.push(
            allChars[Math.floor(Math.random() * allChars.length)]
        );
    }

    for (let i = requiredChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [requiredChars[i], requiredChars[j]] = [
            requiredChars[j],
            requiredChars[i],
        ];
    }

    const password = requiredChars.join("");

    const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!$%&_¿?*])[A-Za-z0-9!$%&_¿?]{8,16}$/;
    return regex.test(password) ? password : generateSecurePassword();
}

export { hashString, compareHashedString, generateSecurePassword };
