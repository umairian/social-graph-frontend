import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  InfoButton,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton,
} from "@chatscope/chat-ui-kit-react";
import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import socket from "../utils/socket";
import { useSelector } from "react-redux";

const USERS_QUERY = gql`
  query UserQuery {
    users {
      _id
      name
      email
      profile_url
      createdAt
    }
  }
`;

const MESSAGES_QUERY = gql`
  query MessageQuery($sender: String!, $recipient: String!) {
  messages(sender: $sender, recipient: $recipient) {
    _id
    content
    createdAt
    recipient
    sender
    updatedAt
  }
}
`;

export default function Chat() {
  const [recipient, setRecipient] = useState(null);

  const { _id } = useSelector((store) => store.auth.user);
  console.log("id ", _id);

//   useEffect(() => {
//     // no-op if the socket is already connected
//     socket.emit("message", {
//       sender: "64897121d9eae4e868a18403",
//       recipient: "64896d09e380a5cc8c44e0c0",
//       content: "Assalam O Alaikum Owais",
//     });
//   }, []);

  // GraphQL
  const { loading, data, error } = useQuery(USERS_QUERY);
  const { loading: messagesLoading, data: messagesData, error: messagesError } = useQuery(MESSAGES_QUERY, { variables: { sender: _id, recipient }});

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          height: "100vh",
          width: "300px",
        }}
      >
        <ConversationList loading={loading}>
          <h3
            style={{
              backgroundColor: "aqua",
              textAlign: "center",
              padding: "20px",
              margin: "0px",
            }}
          >
            Social Graph App
          </h3>
          {data &&
            data.users.map((user) => (
              <Conversation
                name={user.name}
                lastSenderName="Lilly"
                info="Yes i can do it for you"
                onClick={() => setRecipient(user._id)}
              >
                <Avatar src={user.profile_url} name={user.name} />
              </Conversation>
            ))}
        </ConversationList>
      </div>

      {recipient && messagesData && <div
        style={{
          height: "100vh",
          flexGrow: 1,
        }}
      >
        <ChatContainer>
          <ConversationHeader>
            <Avatar
              src={
                "https://t4.ftcdn.net/jpg/03/85/50/01/360_F_385500115_T8QiYsPeliQ5tE3npwOuJNUfunqFBo1U.jpg"
              }
              name="Emily"
            />
            <ConversationHeader.Content
              userName="Emily"
              info="Active 10 mins ago"
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            <MessageSeparator content="Saturday, 30 November 2019" />

            {messagesData?.messages.length && messagesData.messages.map(message => <Message
              model={{
                message: message.content,
                sentTime: message.createdAt,
                sender: "Emily",
                direction: message.sender === _id ? "outgoing" : "incoming",
                position: "single",
              }}
            ></Message>)}
            
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </div>}
    </div>
  );
}
