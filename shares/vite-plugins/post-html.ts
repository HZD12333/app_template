const dllReg = /(.\/common-dll)(.*?)(\.js)/g;
export function postHtml(project: string) {
    const assetsReg = new RegExp(`./(${project}/)(.*?)(.[js,css])`, 'g');
    return {
        name: 'vite-plugin-post-html',
        transformIndexHtml: {
            order: 'post' as const,
            handler: (html) => {
                return html
                    .replace(
                        assetsReg,
                        (_match: string, _p1: string, p2: string, p3: string) => `./${p2}${p3}`,
                    )
                    .replace(
                        dllReg,
                        (_match: string, _p1: string, p2: string, p3: string) => `../common-dll${p2}${p3}`,
                    );
            },
        },
    };
}
