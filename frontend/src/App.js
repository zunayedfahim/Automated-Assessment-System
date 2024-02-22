import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const signIn = () => {
    // TODO: Authenticate with OAuth2.0
    //Redirect to Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <button
        onClick={signIn}
        className="p-3 bg-white rounded-3xl text-sm font-semibold shadow-md hover:bg-blue-500 hover:text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default App;
