import React, { useState, useEffect } from 'react';
import { MainContainer, ChatBox, UserInfo, ChatContent, InputBox, SendButton } from './ThreadPageStyles';
import {
    useLoaderData,
} from 'react-router-dom'
import axios from "../api/axios";
import OrderModal from './OrderModalAdd';
import  {useNavigate  } from "react-router-dom";


// Sample data (You can replace this with real data from your API or database)
// const chats = [
//     { name: 'John Doe', position: 'Manager', message: 'Hello everyone!' },
//     { name: 'Jane Smith', position: 'Employee', message: 'Hello, John!' },
//     { name: 'Anna Lee', position: 'CEO', message: 'Hope everyone is doing well.' },
//     // ... more chats
// ];

export async function loader({ params }) {
    const threadId = params.threadId
    const userId = params.userId
    return { threadId, userId };
  }

const ThreadPage = () => {
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const { userId, threadId } = useLoaderData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {  
        fetchData();
    }, [message])

    const handleOffer= () => {
        setIsModalOpen(true);
    }

    const handleGoToOrderCheck= () => {
        navigate(`../../../Mypage/${userId}`);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }


    const fetchData = async () => {
        const request = await axios.get(`/messages?threadId=${threadId}`);
        console.log('request', request.data);
        setChats(request.data.messages);
    };

    const handleSend = () => {
        // Logic to send message, e.g., update chats array, send to an API, etc.
        console.log(message);
        console.log("!", threadId, userId );

        async function sendMessage() {
            try {
                const request = await axios.post('/messages', 
                {
                    "senderId": userId,
                    "threadId": threadId,
                    "content": message,
                });
                console.log("request data", request);

            } catch (error) {
                console.error("Error while send message in:", error);
            }
        }

        sendMessage()
        setMessage(''); // Clear the input box after sending
    };

    return (
        
        <MainContainer>
            {
                chats.map((chat, index) => (
                    <ChatBox key={index}>
                        <UserInfo>{chat.id} {chat.createdDatetime}</UserInfo>
                        <ChatContent>{chat.content}</ChatContent>
                    </ChatBox>
                ))
            }
            <InputBox
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력해주세요."
            />
            <SendButton onClick={handleSend}>전송</SendButton>
            <div>
                {
                    // userId === '0' ?
                    true ?
                    <SendButton onClick={handleOffer}>주문 생성하기(관리자 기능)</SendButton> :
                    <></>
                }
            </div>

            <div>
                {
                    userId !== '0' ?
                    <SendButton onClick={handleGoToOrderCheck}>돌아가기</SendButton> :
                    <></>
                }
            </div>
            
            <OrderModal threadId = {threadId} userId = {userId} isOpen={isModalOpen} closeModal={closeModal} />
        </MainContainer>
    );
};

export default ThreadPage;
