import React from 'react';
import { Button as SemanticButton } from 'semantic-ui-react';

const Button = ({
  children,
  className,
  type = 'button',
  ...props
}) => (
  <SemanticButton type={type} {...props}>
    {children}
  </SemanticButton>
);

export default Button;
