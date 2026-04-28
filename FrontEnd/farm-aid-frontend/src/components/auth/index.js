// Auth components index file
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import BiometricLogin from './BiometricLogin';
import OfflineLogin from './OfflineLogin';
import ProtectedRoute from './ProtectedRoute';

// Re-export all auth components as a single object
const AuthComponents = {
  LoginForm,
  RegisterForm,
  ForgotPassword,
  ResetPassword,
  BiometricLogin,
  OfflineLogin,
  ProtectedRoute,
};

export default AuthComponents;