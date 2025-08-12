const shell = require('shelljs');

const config = plop => {
    plop.setDefaultInclude({ generators: true });
    plop.setGenerator('start', {
        description: '运行项目',
        prompts: [
            {
                type: 'rawlist',
                name: 'project',
                message: '项目',
                choices: [
                    { name: '自营图书', value: 'book' },
                ],
            },
            {
                type: 'rawlist',
                name: 'env',
                message: '环境',
                choices: [
                    { name: 'dev', value: 'dev' },
                    { name: 'uat01', value: 'uat01' },
                    { name: 'uat02', value: 'uat02' },
                    { name: 'prod', value: 'prod' },
                ],
            },
        ],
        actions: [
            function start(params) {
                console.log(`运行 ${params.project} ${params.env} 环境`);
                const child = shell.exec(`pnpm -F ${params.project} ${params.env}`, { async: true });
                child.stdout.on('data', () => {
                    // console.log(data)
                });
            },
        ],
    });
};

module.exports = config;
