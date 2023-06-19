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
import { useQuery, gql, useMutation } from "@apollo/client";
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

const SEND_MESSAGE_MUTATION = gql`
mutation SendMessage($recipient: String!, $sender: String!, $content: String!) {
  sendMessage(recipient: $recipient, sender: $sender, content: $content) {
    _id
    recipient
    sender
    content
  }
}
`;

export default function Chat() {
  const [recipient, setRecipient] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const [recipientProfile, setRecipientProfile] = useState(null)
  const [messages, setMessages] = useState([]);

  const { _id } = useSelector((store) => store.auth.user);

      useEffect(() => {
        console.log(socket)

        socket.emit("authenticate", _id);

        socket.on("message", (data) => {
        console.log('message', data)
        setMessages([...messages, data]);

        return () => {
          socket.off("message");
        }
      })
    }, [])
    


  // GraphQL
  const { loading, data, error } = useQuery(USERS_QUERY);
  const { loading: messagesLoading, data: messagesData, error: messagesError } = useQuery(MESSAGES_QUERY, { variables: { sender: _id, recipient }});

  useEffect(() => {
    if(messagesData) {
      setMessages(messagesData.messages);
    }
  }, [messagesData])

  // GraphQL
  const [sendMessageReq] = useMutation(SEND_MESSAGE_MUTATION);

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
                onClick={() => {
                  setRecipient(user._id)
                  setRecipientName(user.name)
                  setRecipientProfile(user.profile_url)
                }}
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
                recipientProfile
              }
              name={recipientName}
            />
            <ConversationHeader.Content
              userName={recipientName}
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

            {messages?.length && messages.map(message => <Message
              model={{
                message: message.content,
                sentTime: message.createdAt,
                sender: "Emily",
                direction: message.sender === _id ? "outgoing" : "incoming",
                position: "single",
              }}
            ></Message>)}
            
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={async (data) => {
            const payload = {
              sender: _id,
              recipient,
              content: data,
            }
            socket.emit("message", payload);
            setMessages((data) => [...data, payload])
          }} />
        </ChatContainer>
      </div>}
    </div>
  );
}
