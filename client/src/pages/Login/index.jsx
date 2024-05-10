import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import axios from 'axios';
import { MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    


    const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
			const { data } = await axios.get(url, { withCredentials: true });
			setUser(data.user._json);
		} catch (err) {
			console.log(err);
		}
	};
	
	useEffect(() => {
		getUser();
	}, []);



    const [userDetails, setUserDetails] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const googleAuth = () => {
        window.open(
            `${process.env.REACT_APP_API_URL}/auth/google/callback`,
            "_self"
        );
    };

    const instagramAuth = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/instagram/callback`;
    };

    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when submitting the form

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/sign/login`, { email, password });


            if (response.status === 200) {
                const userDetails = response.data.userdetails;
                navigate('/', { state: { userDetails } });
                toast.success('success');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // User already exists
                toast.error('You are already a user. Please log in.');

            } else {
                // Other errors
                console.error('Error:', error.message);
            }
        }
        finally {
            setLoading(false); // Set loading to false when the response is received
        };

    }
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Log in Form</h1>
            <div className={styles.form_container}>
                <div className={styles.left}>
                    <img className={styles.img} style={{ paddingRight: "-50px" }} src="./images/6310507.jpg" alt="login" />
                </div>
                <div className={styles.right}>
                    <form onSubmit={handleSubmit}> {/* Use onSubmit event to handle form submission */}
                        <h2 className={styles.from_heading}> Log in</h2>
                        <input type="text" className={styles.input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" className={styles.input} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit" className={styles.btn} disabled={loading}> {/* Disable button while loading */}
                            {loading ? <MDBSpinner grow /> : 'Log In'} {/* Show spinner if loading, otherwise show 'Log In' */}
                        </button>
                    </form>

                    <p className={styles.text}>or</p>
                    <div className={styles.btnContainer} style={{ display: "flex", flexDirection: "column" }}>
                        <MDBBtn className='m-1' style={{ backgroundColor: '#de4b39' }} onClick={googleAuth}>
                            <MDBIcon fab icon='google' />
                            <span className='m-1'>Sign in with Google</span>
                        </MDBBtn>
                        <MDBBtn className='m-1' style={{ backgroundColor: '#3b5998' }} href='#'>
                            <MDBIcon fab icon='facebook-f' />
                            <span className='m-1'>Sign in with facebook</span>
                        </MDBBtn>
                        <MDBBtn className='m-1' style={{ backgroundColor: '#ac2bac' }} onClick={instagramAuth}>
                            <MDBIcon fab icon='instagram' />
                            <span className='m-1'>Sign in with Instagram</span>
                        </MDBBtn>
                    </div>
                    <p className={styles.text}>
                        New Here? <Link to="/signup">Sign Up</Link>
                    </p>
                    {userDetails && <Link to="/">Go to Home</Link>}
                </div>
            </div>
        </div>
    );
}

export default Login;
