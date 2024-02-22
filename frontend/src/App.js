import { useNavigate } from "react-router-dom";
import { GoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const navigate = useNavigate();
  const signIn = (credentialResponse) => {
    // TODO: Authenticate with OAuth2.0
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
    const hasAccess = hasGrantedAllScopesGoogle(
      credentialResponse,
      ".../auth/spreadsheets.readonly"
    );
    console.log(hasAccess);
    //Redirect to Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          signIn(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default App;
