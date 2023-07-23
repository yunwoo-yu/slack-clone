import styled from '@emotion/styled';
import { IChat, IDM } from '@typings/db';
import React, { RefObject, forwardRef } from 'react';
import { Scrollbars, positionValues } from 'react-custom-scrollbars-2';
import Chat from './Chat';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, scrollRef) => {
  const onScroll = (values: positionValues): void => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSizes) => prevSizes + 1).then(() => {
        // 스크롤 위치 유지
        const current = (scrollRef as RefObject<Scrollbars>).current;

        if (current) {
          current.scrollTop(current.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  };

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

ChatList.displayName = 'ChatList';

export default ChatList;

export const ChatZone = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;

export const Section = styled.section`
  margin-top: 20px;
  border-top: 1px solid #eee;
`;

export const StickyHeader = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
  position: sticky;
  top: 14px;
  & button {
    font-weight: bold;
    font-size: 13px;
    height: 28px;
    line-height: 27px;
    padding: 0 16px;
    z-index: 2;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    position: relative;
    top: -13px;
    background: white;
    border: none;
    outline: none;
  }
`;
