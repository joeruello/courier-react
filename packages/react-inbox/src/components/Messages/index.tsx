import React, { useEffect, useRef } from "react";
import Message from "../Message";
import { InboxProps } from "../../types";
import TabList from "../TabList";
import { MessageList, Empty, Footer } from "./styled";
import Loading from "./loading";
import PaginationEnd from "./PaginationEnd";
import CourierLogo from "~/assets/courier_logo_text.svg";
import { useAtBottom } from "~/hooks/use-at-bottom";
import useInbox from "~/hooks/use-inbox";
import Header from "./Header";

const Messages: React.FunctionComponent<InboxProps> = ({
  title = "Inbox",
  renderHeader,
  renderMessage,
}) => {
  const {
    fetchMessages,
    markAllAsRead,
    currentTab,
    isLoading,
    messages = [],
    startCursor,
    unreadMessageCount,
  } = useInbox();
  const ref = useRef<HTMLDivElement>(null);

  useAtBottom(
    ref,
    () => {
      if (isLoading || !startCursor) {
        return;
      }

      fetchMessages({
        ...currentTab?.filter,
        after: startCursor,
      });
    },
    [isLoading, startCursor, currentTab]
  );

  useEffect(() => {
    fetchMessages(currentTab?.filter);
  }, [currentTab]);

  return (
    <>
      {renderHeader ? (
        renderHeader({})
      ) : (
        <Header
          currentTab={currentTab}
          title={title}
          unreadMessageCount={unreadMessageCount}
          markAllAsRead={markAllAsRead}
          messages={messages}
        />
      )}
      <TabList />
      <MessageList ref={ref} data-testid="messages">
        {messages?.map((message) =>
          renderMessage ? (
            renderMessage(message)
          ) : (
            <Message key={message.messageId} {...message} />
          )
        )}
        {isLoading && <Loading />}
        {!isLoading && messages?.length === 0 && (
          <Empty>You have no notifications at this time</Empty>
        )}
        {!isLoading && messages?.length > 5 && !startCursor && (
          <PaginationEnd title="End Of The Road" />
        )}
      </MessageList>
      <Footer>
        Powered by&nbsp;&nbsp;
        <CourierLogo />
      </Footer>
    </>
  );
};

export default Messages;
