import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/auth.context";
import axios from "axios";

//Login Setup
import firebase from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth"
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const auth = firebase.auth()

const API_URL = "http://localhost:5005";

function LoginPage() {
  const [userF] = useAuthState(auth);
  console.log(userF)

  const handleSocialLog = async () => {
    const body = {
      email:user.email,
      password: user.uid
    }
    const response = await axios.post(`${import.meta.env.API_URL}/auth/signup`, 
    body)

    storeToken(response.authToken)
    authenticateUser()
    navigate("/profile")
  }

  const signInWithGoogle = () =>{
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider()
    signInWithGitHub(auth, provider)
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser, user} = useContext(AuthContext);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    axios
      .post(`${API_URL}/auth/login`, body)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.errorMessage);
      });
  };

  useEffect(() => {
    if (user) navigate(`/profile/${user._id}`);
  }, [user, navigate]);

  return (
    <div className="auth-box">
      <div>
        <h1>Login </h1>
        <form onSubmit={handleLoginSubmit}>
          <label>Email address*</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmail}
          />

          <label>Password*</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePassword}
          />

          <button type="submit">Log in</button>
          <p>Don't have an account yet?</p>
          <Link to={"/signup"}>Sign Up here</Link>
        </form>
        {/* Can be wrapped in <img></img> */}
        <p onClick={signInWithGoogle}>Sign in With Google</p>
        <p onClick={signInWithGitHub}>Sign in With Git Hub</p>
        <p onClick={()=>auth.signOut()}>Logout</p>
        {user? <p>You are logged in</p> : <p>You are logged out</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
