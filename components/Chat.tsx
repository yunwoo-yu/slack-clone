import React from 'react';
import styled from '@emotion/styled';
import gravatar from 'gravatar';
import { IDM } from '@typings/db';
import dayjs from 'dayjs';

interface Props {
  data: IDM;
}

const Chat = ({ data }: Props) => {
  const user = data.Sender;
  const date = data.createdAt.toString();

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email)} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(date).format('h:mm A')}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;

export const ChatWrapper = styled.div`
  display: flex;
  padding: 8px 20px;
  &:hover {
    background: #eee;
  }
  & .chat-img {
    display: flex;
    width: 36px;
    margin-right: 8px;
    & img {
      width: 36px;
      height: 36px;
    }
  }
`;
