import React, {useState} from 'react'; 

const Login = () => {
    const [loginData, setLoginData] = useState({
    email: '',
    password: ''
    });
const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://trabajo-final-prog-iii.onrender.com/api';
const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch(
                `${apiBase.replace(/\/$/, '')}/usuarios/login`,
                {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                }
            );
            const data = await response.json();

            if(response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login correcto')
                window.location.reload();
            } else{
                alert(data.mensaje || 'Error al iniciar sesion');
            }
        }catch (error) {
            console.error(error);
            alert('Error al iniciar sesion')
        }
    };

    return (
        <div>
            <h2> Iniciar sesion </h2>

            <form 
                onSubmit={handleLogin}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxWidth: '300px',
                    margin: '0 auto'
                }}
            > 
                <input
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => 
                        setLoginData({
                            ...loginData,
                            email: e.target.value
                        })
                    }
                />
                <input
                    type="password"
                    placeholder="contraseña"
                    value={loginData.password}
                    onChange={(e) =>
                        setLoginData({
                            ...loginData,
                            password: e.target.value
                        })
                    }
                />
                <button type="submit">
                    Iniciar sesion
                </button>
            </form>
        </div>

    );
}

export default Login;