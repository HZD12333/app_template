import InternalButton from './Button';
import Group from './Group';

import type { ButtonProps } from './Button';
import type { ForwardRefExoticComponent } from 'react';

type CompoundedComponent = ForwardRefExoticComponent<ButtonProps> & {
    Group: typeof Group;
};

const Button = InternalButton as CompoundedComponent;

Button.Group = Group;
export default Button;
