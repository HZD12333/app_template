import './index.less';

type GroupProps = {
    children: React.ReactNode;
};

const Group: React.FC<GroupProps> = ({ children }) => {
    return <div className='my-button-group'>{children}</div>;
};

export default Group;
