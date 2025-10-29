import React from 'react';
import styled from 'styled-components';

const ContentBox = styled.div`
  position: fixed;
  left: 95px;
  top: 10px;
  right: 15px;
  bottom: 10px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow-y: auto;
`;

const Heading = styled.h1`
  margin: 0 0 30px 0;
  font-size: 32px;
  font-weight: 600;
  color: #000000;
`;

const Content = styled.div`
  color: #666;
  font-size: 16px;
  line-height: 1.6;
`;

const MessagesPage = () => {
  return (
    <ContentBox>
      <Heading>Messages</Heading>
      <Content>
        <p>Your messages and conversations will appear here.</p>
      </Content>
    </ContentBox>
  );
};

export default MessagesPage;
