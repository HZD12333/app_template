const chalk = require('chalk');

// 读取到保存 git commit 时输入的描述信息的文件目录，一般路径如下：.git/COMMIT_EDITMSG
const msgPath = process.env.GIT_PARAMS || '.git/COMMIT_EDITMSG';

const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitReg =
    /^((revert: |.+ )?(feat|fix|docs|style|refactor|perf|tool|test|chore)(\(.+\))?: |Merge branch ).{1,100}/;

if (!commitReg.test(msg)) {
    // eslint-disable-next-line no-console
    console.error(
        `  ${chalk.bgRed.white('ERROR: ')} ${chalk.red('Commit信息不规范！')}\n\n` +
            chalk.red('  请按规范提交commit信息. 例如:\n\n') +
            `    ${chalk.green(`feat(home): 新增主页xxxx`)}\n` +
            `    ${chalk.green(`fix(hook): 修复xxxx (close #28)`)}\n\n` +
            chalk.red(`  可通过 README.md 了解规范细节\n`) +
            chalk.red(`  建议直接运行 ${chalk.cyan('yarn commit')} 进行交互式信息提交.\n`),
    );
    process.exit(1);
}
