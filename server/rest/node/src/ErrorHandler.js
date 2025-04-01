
/**
* Handles the sysadmin errors.
* @param {Error} error error caught by try-catch
* @returns code/message to return to client
*/
function handleError(error) {
    const errorMessage = error.message;
    let code = 503;
    let message = "Server busy, try again later.";

    const error_400 = ["ERROR400", "String is empty.", "Data truncated for column 'status'", "Incorrect time value", "SQLState: 01000) Data truncated for column 'role'", "'startline_name' cannot be null", "Boat not found.", ") not found.", "Invalid email", "Invalid name", "Invalid user"];
    const error_401 = ["ERROR401",  "jwt expired", "Unauthorized. (", "Access denied, you need to login", "not matching id", "JsonWebTokenError: invalid signature"];
    const error_405 = ["ERROR405"];
    const error_409 = ["ERROR409", "Duplicate entry", "Already joined", "Already exists"];

    if (error_400.find(word => errorMessage.includes(word)) !== undefined) {
        code = 400;
        message = "Not found or invalid data.";
    } else if (error_401.find(word => errorMessage.includes(word)) !== undefined) {
        code = 401;
        message = "Unauthorized.";
    } else if (error_405.find(word => errorMessage.includes(word)) !== undefined) {
        code = 405;
        message = "Not allowed.";
    } else if (error_409.find(word => errorMessage.includes(word)) !== undefined) {
        code = 409;
        message = "Already exists";
    }
    console.log(errorMessage);

    return { code, message };
}

module.exports = {
    handleError
}
