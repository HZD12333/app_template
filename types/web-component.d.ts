import * as React from 'react'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [property: string]: React.DetailedHTMLProps<any, HTMLElement>;
        }
    }
}

