import styled from 'styled-components';
import { Button } from 'antd';

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content:center;
    background: #d9e8f5;
    padding: 0px;
    margin: auto;
    max-width: 100vw;
    height: 100vh;
`;

export const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    flex: 1;
    height: 60%;
    justify-content: space-between;
`;

export const ChatBox = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
`;

export const StyledButton = styled(Button)`
    height: 45px;
    background: #91bed4;
    transition: 0.5s;
`
export const SendIcon = styled.div`
    color: #fff;
    font-size: 20px;
    :hover {
        color:#2979FF;
        background: #fff;
    }
    :focus {
        outline: none;
    }
`;
export const NavigationBar = styled.div`
    padding: 20px 20px;
    `;