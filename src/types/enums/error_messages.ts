enum ErrorMessages {
    INVALID_CREDENTIALS = "Invalid credentials. Check your employee number and password and try it again",
    EMAIL_DOES_NOT_EXISTS = "Email does not exist. Check that you have entered the email address correctly.",
    VALIDATION_CODE_DOES_NOT_EXISTS = "Validation code does not exist. Check that your email has a code associated with it.",
    INVALID_VALIDATION_CODE = "Invalid validation code. Check your validation code and try it again",
    USER_NOT_FOUND = "The user with the specified id/employeeNumber is not registered",
    ROLE_NOT_FOUND = "A role you are trying to associate with the user is not registered in the system.",
    TWO_WITNESSES_ALREADY_EXIST = "There are already two witnesses registered in the system, there can only be two",
    EMPLOYEENUMBER_ALREADY_EXIST = "There are already a user with the same employee number",
    EMAIL_ALREADY_EXIST = "There are already a user with the same email",
    DELIVERY_RECEPTION_MADE_NOT_FOUND = "The delivery/reception with the specified id is not registered for the user",
}

export default ErrorMessages;
