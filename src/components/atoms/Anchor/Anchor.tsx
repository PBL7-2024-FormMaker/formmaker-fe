import * as React from 'react';

interface AnchorProps {
  text: string;
}

const Anchor: React.FC<AnchorProps> = ({ text }) => <a>{text}</a>;

export default Anchor;
