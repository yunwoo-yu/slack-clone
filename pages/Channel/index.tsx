import ChannelList from '@components/ChannelList';
import ChatBox from '@components/ChatBox';
import styled from '@emotion/styled';
import useInput from '@hooks/useInput';
import React, { FormEvent } from 'react';

const Channel = () => {
  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <>
      <Header>채널</Header>
      <ChannelList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />

      <div>로그인 하신것을 축하드려요!</div>
    </>
  );
};

export default Channel;

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 38px);
  flex-flow: column;
  position: relative;
`;

export const Header = styled.header`
  height: 64px;
  display: flex;
  width: 100%;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 1px 0 var(--saf-0);
  padding: 20px 16px 20px 20px;
  font-weight: bold;
  align-items: center;

  & .header-right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
  }
`;

export const DragOver = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
  background: white;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`;
