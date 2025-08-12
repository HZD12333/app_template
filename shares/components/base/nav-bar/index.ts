import Container from './NavBar';
import { Share, MoreOperation, Search } from './subComponent';

import type { NavBarProps } from './NavBar';
import type { ForwardRefExoticComponent } from 'react';

type CompoundedComponent = ForwardRefExoticComponent<NavBarProps> & {
    Share: typeof Share;
    MoreOperation: typeof MoreOperation;
    Search: typeof Search;
};

const NavBar = Container as CompoundedComponent;

NavBar.Share = Share;
NavBar.MoreOperation = MoreOperation;
NavBar.Search = Search;

export default NavBar;
