import { useNavigate } from "react-router-dom";
import { GoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGlobalStore } from "./store";
import { setCookie } from "./cookies";

const App = () => {
  const navigate = useNavigate();
  const setUser = useGlobalStore((state) => state.setUser);

  const signIn = (credentialResponse) => {
    // Authenticate with OAuth2.0
    const decoded = jwtDecode(credentialResponse.credential);
    // Print  to see user details in the Console
    // console.log(decoded);

    // Set user to global state manager
    setUser(decoded);

    // Store token in cookies
    setCookie("accessToken", credentialResponse.credential);

    // TODO:Check if the user has given all the access
    const hasAccess = hasGrantedAllScopesGoogle(
      credentialResponse,
      ".../auth/spreadsheets.readonly"
    );
    console.log(hasAccess);

    //Redirect to dashboard
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
