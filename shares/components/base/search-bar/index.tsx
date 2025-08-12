import { useRef, useState, forwardRef, useImperativeHandle, MouseEventHandler } from 'react';

import { Nullable } from '@miyuan/types';

import styles from './index.module.less';

export type SearchBarProps = {
    placeholder?: string;
    onSearch?: (val: string) => void;
    onInput?: (val: string) => void;
    onFocus?: MouseEventHandler<HTMLInputElement>;
};

export type SearchBarRef = {
    setInputValue: (val: string) => void;
    getInputValue: () => string;
};

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>((props, ref) => {
    const { placeholder, onInput, onSearch, onFocus } = props;

    const inputRef = useRef<Nullable<HTMLInputElement>>(null);
    const [keyword, setKeyword] = useState('');

    const clear = () => {
        onInput?.('');
        setKeyword('');

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    useImperativeHandle(ref, () => {
        return {
            setInputValue(val) {
                let value = val;
                if (value && inputRef.current) {
                    value = value.trim();
                    (inputRef.current as HTMLInputElement).value = value;
                    setKeyword(value);
                }
            },
            getInputValue() {
                if (inputRef.current) {
                    return (inputRef.current as HTMLInputElement).value.trim();
                }

                return '';
            },
        };
    });

    return (
        <div className={styles.wrapper}>
            <span className={styles.searchIcon} />
            <input
                className={styles.input}
                ref={inputRef}
                type='search'
                placeholder={placeholder}
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (!target) {
                        return;
                    }

                    const val = (target?.value || '').trim();
                    setKeyword(val);

                    if (onInput) {
                        onInput(val);
                    }
                }}
                onClick={onFocus}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch?.(e.currentTarget.value);
                    }
                }}
            />
            {keyword && <span className={styles.clearIcon} onClick={clear} />}
            <span className={styles.searchBtn} onClick={() => onSearch?.(keyword)}>
                搜索
            </span>
        </div>
    );
});
