export class AppConfig {
    public static readonly API_URL='https://localhost:8443/TimeManagement/tms';

    // API URLs
    public static readonly TASK_API = AppConfig.API_URL + '/task';
    public static readonly EMPLOYEE_API = AppConfig.API_URL + '/employee';
    public static readonly AUTHENTICATION_API = AppConfig.API_URL + '/auth';

    // Storage keys
    public static readonly CURRENT_USER_KEY = "current_user";
    public static readonly JWT_TOKEN_KEY = "tkn";
    public static readonly IS_LOGGED_IN_KEY = "is_logged_in";

    // Backend error message
    public static readonly BACKEND_ERROR_MESSAGE = "An error occurred in the backend. Please try again after sometime.";
}