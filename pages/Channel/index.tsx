import styled from '@emotion/styled';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import InviteChannelModal from '@components/InviteChannelModal';

const Channel = () => {
  const { workspace, channel } = useParams();
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
  const scrollbarRef = useRef<Scrollbars>(null);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (chat.trim() && chatData && channelData) {
        const savedChat = chat;

        await mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });

          return prevChatData;
        }, false);

        setChat('');
        scrollbarRef.current?.scrollToBottom();

        await axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
          content: chat,
        });

        mutateChat();
      }
    } catch (error) {
      mutateChat();
      console.log(error);
    }
  };

  const onMessage = useCallback((data: IChat) => {
    // id는 상대방 아이디

    if (data.Channel.name === channel && data.UserId !== myData.id) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickInviteChannel = () => {
    setShowInviteChannelModal(true);
  };

  const onCloseModal = () => {
    setShowInviteChannelModal(false);
  };

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  useEffect(() => {
    socket?.on('message', onMessage);

    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  if (!myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <>
      <Container>
        <Header>
          <span>{channel}</span>
          <div className="header-right">
            <span>{channelMembersData?.length}</span>
            <button
              onClick={onClickInviteChannel}
              className="c-button-unstyled p-ia__view_header__button"
              aria-label="Add people to #react-native"
              data-sk="tooltip_parent"
              type="button"
            >
              {' '}
              <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
            </button>
          </div>
        </Header>
        <ChatList
          chatSections={chatSections}
          ref={scrollbarRef}
          setSize={setSize}
          isEmpty={isEmpty}
          isReachingEnd={isReachingEnd}
        />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        <InviteChannelModal
          show={showInviteChannelModal}
          onCloseModal={onCloseModal}
          setShowInviteChannelModal={setShowInviteChannelModal}
        />
      </Container>
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
