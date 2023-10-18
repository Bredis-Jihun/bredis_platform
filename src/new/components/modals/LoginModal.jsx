import React, { useEffect, useState } from 'react';
import logo from '../../../img/bredis_logo.png'
import axios from "../../../api/axios";
import  {useNavigate  } from "react-router-dom";
import {useCookies} from 'react-cookie';
import { LoginContainer, LoginButton, LoginInput, LoginImage, SignupButton, ModalOverlay, CloseButton } from './LoginPageStyles';
import { useLoginModal } from './LoginModalContext';

const LoginPageModal = () => {
    const { setIsModalOpen } = useLoginModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookie] = useCookies(['name']);
    const navigate = useNavigate();
    const handleOutsideClick = (e) => {
        // if (e.target === e.currentTarget) {
        //     setIsModalOpen(false);
        // }
    };
    const handleKeyUp = (e) => {
        if (e.key === 'Escape') {
            setIsModalOpen(false);
            navigate("/");
        }
    };

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        async function loginPress() {
            try {
                const request = await axios.post('login', {
                    "email": email,  // using state value for email
                    "password": password  // using state value for password
                });
                
                if(request !== "오류"){
                    // console.log("request data", request.data["memberId"], "authToken", request.data["authToken"]);
                    setCookie('login', {id : request.data["memberId"], authToken : request.data["authToken"]}, {path : "/" , maxAge : 86400 })
                    setIsModalOpen(false);
                    window.location.reload();
                }
                else{
                    alert("로그인 정보가 맞지 않습니다.")
                }
                

            } catch (error) {
                console.error("Error while logging in:", error);
                console.error(error.request['status']);
            }
        }
        loginPress();
    };

    return (
        <ModalOverlay onClick={handleOutsideClick}>
            <LoginContainer>
                <br/>
                <CloseButton onClick={(e) => {setIsModalOpen(false)}}>X</CloseButton>
                <LoginImage src={logo} alt="Login Illustration" />
                <form onSubmit={handleLogin}>
                <LoginInput
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{position: 'relative', left: '50%', transform: 'translate(-50%, 0%)'}}
                />
                <LoginInput
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{position: 'relative', left: '50%', transform: 'translate(-50%, 0%)'}}
                />
                <LoginButton
                    type="submit"
                    style={{position: 'relative', left: '50%', transform: 'translate(-50%, 0%)'}}
                >
                    로그인
                </LoginButton>
                </form>
                <SignupButton
                    onClick={() => navigate("/signup"  )}
                >
                    회원가입
                </SignupButton>
            </LoginContainer>
        </ModalOverlay>
    );
};

export default LoginPageModal;