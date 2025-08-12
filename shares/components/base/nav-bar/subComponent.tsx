import classNames from 'classnames';
import { type FC } from 'react';

import { Dropdown, type IDropdownOption } from '../dropdown';

import styles from './index.module.less';

interface ShareProps {
    onShare: () => void;
    theme?: 'light' | 'dark';
}
export const Share: FC<ShareProps> = (props) => {
    const { onShare, theme = 'dark' } = props;

    return <div className={classNames(styles.share, styles[theme], 'item')} onClick={onShare} />;
};

interface MoreOperationProps {
    theme?: 'light' | 'dark';
    options: IDropdownOption[];
    onVisibleChange?: (visible: boolean) => void;
    targetId?: string;
}
export const MoreOperation: FC<MoreOperationProps> = (props) => {
    const { options, theme = 'dark', onVisibleChange, targetId } = props;

    return (
        <Dropdown items={options} onVisibleChange={onVisibleChange} targetId={targetId}>
            <div className={classNames(styles.more, styles[theme], 'item')} />
        </Dropdown>
    );
};

interface SearchProps {
    onSearch: () => void;
    theme?: 'light' | 'dark';
}
export const Search: FC<SearchProps> = (props) => {
    const { onSearch, theme = 'dark' } = props;

    return (
        <div className={classNames(styles.search, styles[theme])} onClick={onSearch}>
            搜索
        </div>
    );
};
