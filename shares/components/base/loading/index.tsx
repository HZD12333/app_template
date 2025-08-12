import React from 'react';

type Props = {
    msg?: string;
};

export const Loading: React.FC<Props> = (props) => {
    const { msg } = props;

    return (
        <div className='__page_loading'>
            <div className='__page_loading_mask'></div>
            <div className='__page_loading_content'>
                <svg
                    className='__page_loading_icon'
                    width='8vw'
                    height='8vw'
                    viewBox='0 0 56 56'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                >
                    <g transform='translate(-347, -806)' fillRule='nonzero'>
                        <g transform='translate(328, 787)'>
                            <g transform='translate(21, 19)'>
                                <path
                                    d='M26,0 C41.463973,0 54,12.536027 54,28 C54,43.463973 41.463973,56 26,56 C10.536027,56 -2,43.463973 -2,28 C-2,12.536027 10.536027,0 26,0 Z M26,6 C13.8497355,6 4,15.8497355 4,28 C4,40.1502645 13.8497355,50 26,50 C38.1502645,50 48,40.1502645 48,28 C48,15.8497355 38.1502645,6 26,6 Z'
                                    fill='#FFF8D9'
                                ></path>
                                <path
                                    d='M51,25 C52.6568542,25 54,26.3431458 54,28 C54,43.463973 41.463973,56 26,56 C24.3431458,56 23,54.6568542 23,53 C23,51.3431458 24.3431458,50 26,50 C38.1502645,50 48,40.1502645 48,28 C48,26.3431458 49.3431458,25 51,25 Z'
                                    fill='#FED800'
                                ></path>
                            </g>
                        </g>
                    </g>
                </svg>
                {msg ? <div>{msg}</div> : null}
            </div>
        </div>
    );
};
