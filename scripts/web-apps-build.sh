echo $env

job_name="web-apps"

#服务器选择
if [ $env == "uat01" ]
then
#需要传送的远程地址
remotePath="h5@172.16.3.40:/data/h5/uat01-h5/api/h5"
elif [ $env == "uat02" ]
then
remotePath="h5@172.16.3.40:/data/h5/uat02-h5/api/h5"
fi

if [ $need_install == "yes" ]
then
echo "需要install构建"
pnpm run reinstall
fi

dist_file_path="/var/lib/jenkins/workspace/$job_name/dist"

echo “正在编译的环境：” $env
pnpm run -F $project build:$env
if [ $? -ne  0 ] ; then
exit 2
fi
echo $dist_file_path
echo $remotePath
array=${remotePath//:/ }
deletePath=${array[1]}*
# ansible -m shell -a "rm -rf $deletePath" test
echo $deletePath
#scp -r $dist_file_path $remotePath
rsync -av --delete "$dist_file_path/common-dll" "$remotePath"
rsync -av --delete "$dist_file_path/$project" $remotePath


