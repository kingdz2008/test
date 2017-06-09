##### 命令补齐
Linux的shell环境通过bash-completion软件包提供了命令补齐功能。

* 将GIT源码包中命令补齐脚本复制到bash-completion对应的目录中。  
<pre>cp contrib/completion/git-completion.bash /etc/bash_completion.d/</pre>
* 重新加载自动补齐脚本  
<pre>. /etc/bash_completion</pre>
* 启动时自动加载bash-completion脚本，需要在/etc/prfile及~/.bashrc中添加如下内容  
<pre>if [ -f /etc/bash_completion ]; then
	. /etc/bash_completion`
fi
</pre>

#### 显示中文
UTF-8字符集下如果中文乱码可以设置**core.quotepath**为**false**  
`git config --global core.qutepath false`

GBK字符集，则需要设置字符集为**GBK**才能正确显示中文  
`git config --global i18n.logOutputEncoding gbk`<br/>
`git config --global i18n.commitEncoding gbk`

#### 命令别名
`git config --system alias.st status`

#### 命令输出开启颜色显示
`git config --global color.ui true`

#### 精简status的输出
`git status -s`  
其中输出结果第一列代表版本库与暂存区的区别，第二列代表工作区和暂存区的区别。

#### 内容比较
逐词比较，非默认的逐行比较  
`git diff --word-diff`

工作区于暂存区的区别  
`git diff`

工作区与HEAD的区别  
`git diff HEAD`

暂存区和HEAD的区别，也可以使用staged  
`git diff --cached`

比较里程碑A和里程碑B  
`git diff A B`

比较文件不同版本  
`git diff <commit1> <commit2> --<paths>`

#### 查看HEAD指向的目录树
`git ls-tree -l HEAD`  
`-l`参数可以显示文件的大小

#### 查看暂存区的目录树
首先清除工作区当前的改动  
`git clean -fd`  
`git ls-files -s`  
这时第三个字段不是文件大小而是暂存区编号，如果想要使用`ls-tree`则需要先执行  
`git write-tree` 将暂存区的目录树写入git对象库

如果想要递归显示目录内容，不只是显示最终文件则使用  
`git write-tree | xargs git ls-tree -l -r -t`

#### 相同的指向
HEAD、master、refs/heads/master具有相同的指向

#### SHA1哈希值的生成算法
查看HEAD对应提交的内容  
`git cat-file commit HEAD`  
提交信息中假设包含234个字符，输出为234  
`git cat-file commit HEAD | wc -c`  
在提交信息前加入`commit 234<null>`（<null>为空字符），然后进行SHA1哈希算法  
`(printf "commit 234\000"; git cat-file commit HEAD) | sha1sum`  
上面输出的结果与下面的命令返回的结果是一致的  
`git rev-parse HEAD`

#### 文本的SHA1算法
`(printf "blob 25\000"; git cat-file blob HEAD:welcomt.txt) | sha1sum`

#### 树的SHA1算法
`git cat-file tree HEAD^{tree} | wc -c`  
`(printf "tree 39\000"; git cat-file tree HEAD^{tree}) | sha1sum`

#### 小知识
使用`HEAD`代表版本库中最近的一次提交  
符号`^`可以用于指代父提交，如`HEAD^`代表版本库中的上一次提交  
符号`~<n>`可以用于祖先提交，如`a573106~5`相当于`a573106^^^^^`  
提交对应的树对象可以使用`a573106^{tree}`  
某一次提交对应的文件对象可以使用`a573106:path/to/file`  
暂存区中的文件对象可以使用`:path/to/file`  
查看历史版本的文件列表`git ls-files --with-tree=HEAD^`  
查看历史版本中的文件内容`git cat-file -p HEAD^:welcome.txt`  
查看历史版本中的文件内容`git show HEAD^:welcome.txt`  
修改、删除的文件快速提交到暂存区`git add -u`  
将所有改动及新增文件添加到暂存区`git add -A`  
查看总共的提交次数`git rev-list HEAD | wc -l`  
查看对象库中的对象大小`find .git/objects -type f printf "%-20p\t%s\n"`  
克隆裸版本库`git clone --mirrot git://.../xxx.git`或`git clone --bare git://.../xxx.git`  
查看提交领先（未被推送到上游跟踪分支中）`git cherry`

#### 重置
用法一：`git reset [-q] [<commit>] [--] <paths>...`  
用法二：`git reset [--soft | --mixed | --hard | ==merge | --keep] [-q] [<commit>]`  
第一种用法不会重置引用，更不会改变工作区，而是用指定提交状态下的文件替换掉暂存区中的文件。  
`git reset HEAD <path>`相当于取消之前执行的`git add <path>`  
第二种用法则会重置引用。可以对暂存区或工作区进行重置。  
--hard  
1，替换引用的指向，指向新的提交ID。  
2，替换暂存区，和引用指向的目录树一致。  
3，替换工作区，与暂存区一致。  
--soft  
1，只改变引用的指向，不改变暂存区和工作区。  
--mixed或不使用参数  
1，更改引用的指向。  
2，替换暂存区，但是不改变工作区。  
例子：  
`git reset`相当于`git reset HEAD`：仅用HEAD指向的目录树重置暂存区，工作区不会受到影响，相当于将之前用`git add`命令更新到暂存区的内容撤出暂存区。引用也没有改变，因为引用重置到HEAD相当于没有重置。  
`git reset --filename`：仅将filename的改动撤出暂存区，相当于对命令`git add filename`的反向操作。  
`git reset --soft HEAD^`：工作区和暂存区不改变，但是引用向前后退一次，当对最新提交的提交说明或提交的更改不满意时撤销最新的提交以便重新提交。  
`git reset HEAD^`：工作区不改变，但是暂存区会回退到上一次提交之前，引用也会回退一次。  
`git reset --hard HEAD^`：撤销最近的提交，引用回退到前一次，工作区和暂存区也回退到前一次，相当于自上一次提交以来的提交全部丢失。

#### 检出
`cat .git/HEAD`  
输出一段SHA1值  
'detached HEAD' state是指HEAD头指针指向一个具体的提交ID，而不是一个引用（分支）。  
如果输出类似为为：  
`ref:refs/heads/master`则表示HEAD头指针不是处于“分离头指针模式”。

用法一：`git checkout [-q] [<commit>] [--] <paths>...`  
用法二：`git checkout [<branch>]`  
用法三：`git checkout [-m] [[-b|--orphan] <new_branch>] [<start_point>]`  
第一种用法和第二种用法的区别在于第一种用法在命令中包含路径<paths>，为了避免路径和引用（或者提交ID）同名发生冲突，可以在<paths>前用两个连续的短线作为分隔。  
第一种用法的<commit>是可选项，如果省略则相当于从暂存区进行检出。与重置命令不同，检出命令的默认值是暂存区。这种用法不会改变HEAD头指针，主要是用于指定版本的文件覆盖工作区中对应的文件。  
第二种用法则会改变HEAD头指针。主要作用就是切换到分支。如果省略<branch>则相当于对工作区进行状态检查。  
第三种用法主要是创建和切换到新的分支，新的分支从<start_point>指定的提交开始创建。

#### 恢复进度
`git stash list`查看暂存列表  
`git stash pop`从最近保持的进度进行恢复，会删除最新的stash  
`git stash save "message..."`在暂存时指定说明  
`git stash drop [<stash>]`删除一个存储的进度，默认删除最新的进度  
`git stash clear`删除所有存储的进度  
`git stash branch <branchname> <stash>`基于暂存进度创建分支  
`git stash apply stash@{1}`使用stash@{1}来恢复进度，不会删除stash

本地没有被版本控制系统跟踪的文件并不能保持进度。因此本地新文件需要先执行添加操作。  
每个进度的标识都是stash@{<n>}的格式

#### 移动或重命名文件
`git mv`

#### 日志中显示tag
`git log --oneline --decorate`

#### 选择性添加
`git add -i`会进入一个交互界面

#### 忽略文件
与共享式忽略不同的有独享式忽略

* 在版本库`.git`目录下的一个文件`.git/info/exclude`来设置文件忽略  
* 通过Git的配置变量`core.excludesfile`指定的一个忽略文件，其设置的忽略对所有本地版本库均有效  

忽略文件中以`#`开始的行是注释  
在名称的最前面添加`!`表示不忽略

#### 文件归档
基于最新提交建立归档文件  
`git archive -o latest.zip HEAD`  
只将目录src和doc建立到归档文件  
`git archive -o partial.tar HEAD src doc`  
基于里程碑建立归档  
`git archive --format=tar --perfix=1.0/ v1.0 | gzip > foo-1.0.tar.gz`

#### 文件追溯
可以指出是谁在什么时候以及什么版本引入了此bug  
`git blame <paths>`

#### 多步悔棋
* 使用--soft参数调用重置命令，回到提交之前  
`git reset --soft HEAD^^`
* 查看版本状态和最新日志
* 执行提交操作，将最新的两次提交压缩为一个提交的操作  
`git commit -m "..."`

#### 时间旅行一
目前有ABCDEF六个提交，我们要消除提交D

* 暂时将HEAD头指针切换到C  
`git checkout C`
* 执行拣选将E提交在当前HEAD上重放  
`git cherry-pick master^`
* 执行拣选将F提交在当前HEAD上重放  
`git cherry-pick master`
* 通过日志查看D已经不存在了，并且发现最新两次提交的AuthorDate和CommitDate不同。AuthorDate是原始更改时间。CommitDate是拣选操作时的时间。
* 将master繁殖重置到新的提交ID上  
`git checkout master`  
`git reset --hard HEAD@{1}`

#### 时间旅行二
目前有ABCDEF六个提交，我们要合并C和D

* 将HEAD头指针切换到D  
  `git checkout D`
* 悔棋两次  
  `git reset --soft HEAD^^`
* 执行提交，提交说明重用C提交的提交说明  
  `git commit -C C`
* 执行拣选将E在当前HEAD上重放  
  `git cherry-pick E`
* 执行拣选将F在当前HEAD上重放  
  `git cherry-pick F`
* 将master重新指向最新提交的ID上  
  `git checkout master`  
  `git reset --hard HEAD@{1}`

#### 变基
`git rebase --onto <newbase> <since> <till>`

变基的过程

* 首先会执行`git checkout`切换到`<till>`  
  如果<till>不是一个分支，则变基在detached HEAD状态进行，结束后需要对master重置
* 将`<since>..<till>`所标识的提交范围写到一个临时文件中
`<since>..<till>`是指包含`<till>`的所有历史提交排除`<since>`及`<since>`的历史提交后形成的版本范围
* 将当前分支强制重置`git reset --hard`到`<newbase>`
* 从保存在临时文件中的提交列表中，将提交逐一顺序重新提交到重置之后的分支上
* 如果遇到提交已经在分支中包含，则跳过该提交
* 如果自提交过程遇到冲突，则变基过程暂停。用户解决冲突后使用continue继续操作，或skip跳过此提交，或abort终止变基操作

#### 时间旅行三
目前有ABCDEF六个提交，我们要消除提交D

* `git rebase --onto C E^ F`
* `git checkout master`

#### 时间旅行四
目前有ABCDEF六个提交，我们要合并C和D

* `git checkout D`
* `git reset --soft HEAD^^`
* `git commit -C C`  
  并记住提交ID
* `git tag newbase`  
  `git rev-parse newbase`  
  可以帮助我们记住这个ID
* `git rebase --onto newbase E^ master`
* `git tag -d newbase`

#### 时间旅行五
`git rebase -i`可以启动变基的交互式界面

#### 丢弃历史
如果需要丢弃里程碑A之前的历史，可以基于里程碑A对应的提交构造一个根提交（即没有父提交的提交），然后将master分支在里程碑A之后的提交变基到新的提交上，实现对历史提交的清除。

由里程碑A构造一个根提交至少有两种方法。

第一种

	* 查看里程碑A指向的目录树  
	  `git cat-file -p A^{tree}`
	* 从该目录树创建提交  
	  `echo "Commit from tree of tag A." | git commit-tree A^{tree}`
	* 上面命令输出是一个提交的SHA1值，查看这个提交会发现这个提交没有历史提交。  
	  `git log --pretty=raw 8f7f94b`
第二种

	* 查看里程碑A指向的提交
	  `git cat-file commit A^0`
	* 将上面的输出过滤掉以parent开头的行，并将结果保存到一个文件中  
	  `git cat-file commit A^0 | sed -e '/^parent/ d' > tmpfile`
	* 将tmpfile作为一个commit对象写入对象库  
	  `git hash-object -t commit -w -- tmpfile`
	* 上面的输出结果就是写入Git对象库的新的提交的对象ID

执行变基，将master分支里程碑A之后的提交全部迁移到根提交上  
`git rebase --onto 8f7f94b A master`

#### 克隆生成裸版本库
`git clone --bare /path/to/my/workspace/demo /path/to/repos/demo.git`  
可以看到`demo.git`中的`core.bare`设置为`true`了  
`git push /path/to/repos/demo.git`就可以实现推送了

#### 暂存区的临时对象
`git fsck`可以查看版本库中包含的没有被任何引用关联的松散对象  
标识为dangling的对象就是没有被任何直接或间接关联到的对象  
`git prune`可以用于清除这样的对象

#### 重置操作引入的对象
`git fsck --no-reflogs`才可以查看到相应的对象  
如果确认丢弃不想要的对象，需要对版本库的reflog做过期操作，相当于将`.git/logs`下的文件清空  
`git reflog expire --expire=<date> -all`可以强制让`<date>`之前的记录全部过期，可以传入`now`  
该操作默认是丢弃90天之前的内容  
执行`git prune`之后，版本库被清理

#### 建立裸版本库
`git init --bare /path/to/repos/shared.git`

#### 协同工作
`git rev-list HEAD`可以显示本地版本库的最新提交历史的SHA1  
`git ls-remote origin`可以显示远程版本库中的引用  
git利用类似这样的方法来判断是否是一个快进式提交  
`git push -f`可以实现强制提交，但是不建议使用  
下面的例子也许是一个使用非快进式提交的好例子：  
用户2在推送后发现之前的推送有错误。  
用户2在本地修改了已经提交的文件。  
用户2决定使用amend来修改上次提交的内容。  
此时如果版本库在用户2提交之前未发生过任何修改，那么用户2就可以强制提交覆盖上一次用户2的提交。

阻止非快进式提交

* 通过版本库的配置  
`git --git-dir=/path/to/repos/shared.git config receive.denyNonFastForwards true`
* 通过版本库的钩子脚本

`git pull` = `git fetch` + `git merge`

#### 冲突解决
图形化工具：kdiff3，meld，tortoisemerge，araxis等  
启动图形化工具：`git mergetool`

#### 树冲突
两个用户同时对一个文件进行重命名，并且重命名结果不同  
这是user2应该和user1商量一下应该改成什么名字，如果确认应该采用user2的重命名，则user2应该这样操作。  

* user1将doc/README.txt改为readme.txt并提交
* user2将doc/README.txt改为README，并做了本地提交
* 
* 删除文件`git rm readme.txt`
* 删除文件`git rm doc/README.txt`
* 添加文件`git add README`
* 提交完成冲突解决

#### 合并策略
`git merge [-s <strategy>] [-X <strategy-option>] <commit>`  
-s用于设定合并策略，-X用于为所选的合并策略提供附加的参数

* resolve  
  该合并策略只能用于合并两个头（即当前分支和另外的一个分支），使用三向合并策略。被认为是最安全、最快的合并策略。
* recursive  
  该合并策略只能用于合并两个头（即当前分支和另外的一个分支），使用三向合并策略。是合并两个头指针的默认合并策略。当合并的头指针拥有一个以上的祖先的时候，会针对多个公共祖先创建一个合并的树，并以此作为三向合并的参照。被认为可以实现冲突的最小化，而且可以发现和处理由于重命名导致的冲突。  
  这个合并策略可以使用下列选项
	* ours  
	  在遇到冲突的适合，选择我们的版本（当前分支的版本），而忽略他人的版本。如果他人的改动和本地改动不冲突会将他人的改动合并进来。和ours的合并策略不同。
	* theirs  
	  和ours选项相反。
	* subtree[=path]  
	  使用子树合并策略，比subtree策略的定制能力更强，可以直接对子树目录进行设置
* octopus
  可以合并两个以上的头指针，但是拒绝执行需要手动解决的复杂合并。主要用途是将多个主题合并到一起。是对三个及三个以上的头指针合并时的默认策略
* ours
  可以合并任意数量的头指针，但是合并的结果总是使用当前分支的内容，完全丢弃其他分支的内容
* subtree
  经过调整的recursive策略。当合并树A和B时，如果B和A的一个子树相同，B首先进行调整以匹配A的树的结构，以免两棵树在同一级别进行合并。同时也针对两棵树的共同祖先进行调整。

#### 合并的相关设置
`merge.conflictstyle`指定冲突标记的风格，两个风格可用，默认的是`merge`，另一个是`diff3`  
如果使用diff3，则<<<<<<<和|||||||之间是本地版本、|||||||和=======之间是原始版本、=======和>>>>>>>之间是他人的版本。  
`merge.tool`设定图形化合并时的默认工具  
`mergetool.<tool>.path`冲突解决工具安装的特殊位置  
`mergetool.<tool>.cmd`如果所用的冲突解决工具不在内置列表中，可以使用该选项对自定义工具进行设置，同时需要将`merge.tool`设置为`<tool>`  
`merge.log`是否在合并提交的提交说明中包含合并的概要信息，默认是`false`

#### 里程碑
`git tag`显示所有里程碑  
`git tag -n<num>`显示最多num行里程碑的说明  
`git tag -l ...`可以指定通配符  
`git describe <commit>`将提交显示为一个易记的名称

* 若有里程碑则显示里程碑
* 若没有里程碑，但是其祖先有里程碑，则使用类似<tag>-g<num>-g<commit>的格式显示，tag是最接近的祖先提交的里程碑名字，num是该里程碑和提交的距离，commit是该提交的精简提交ID
* 如果工作区对文件有修改，还可以通过后缀-dirty表示出来  
  `echo hacked >> README;git describe --dirty;git checkout -- README`输出类似  
  jx/v1.0-dirty
* 如果提交本身没有包含里程碑，可以通过传递--always参数显示精简提交ID，否则会出错

创建里程碑
* 用法1：`git tag             <tagname> [<commit>]`
* 用法2：`git tag -a          <tagname> [<commit>]`
* 用法3：`git tag -m <msge>   <tagname> [<commit>]`
* 用法4：`git tag -s          <tagname> [<commit>]`
* 用法5：`git tag -u <key-id> <tagname> [<commit>]`

用法1是创建轻量级的里程碑  
用法2和3相同，都是创建带有说明的里程碑，用法3通过-m参数提供里程碑的创建说明  
用法4和5相同，都是创建带GnuPG签名的里程碑。用法5的-u参数选择指定的私钥进行签名  
如果没有指定ID，则基于HEAD创建里程碑

轻量级里程碑缺点：创建过程没有记录，无法知道是里程碑的创建者和创建时间。describe不使用轻量级里程碑生成版本描述字符串。

创建带签名的里程碑需要提前安装GnuPG

删除里程碑
`git tag -d`  
删除里程碑后不易恢复  
没有重命名功能的原因：对于带有签名的里程碑，其名字还反映在tag对象的内容中。而且需要重新签名，显然难以自动实现。

>不要随意修改已经建立的里程碑：一旦里程碑被他人同步，如果进行修改，已经同步该里程碑的用户不会自动更新，会导致一个相同名称的里程碑在不同用户的版本库中的指向不同。  
>里程碑名字不要以符号`-`开头，以免被当作命令行选项。  
>可以包含`/`但是不能位于最后  
>不能出现两个连续的`.`当然更不能出现三个连续的点  
>不能再里程碑的最后出现`.`  
>不能使用特殊字符，如空格、波浪线、^、冒号、问号、星号、方括号以及字符\117或小于\040的Ascii码  
>不能以`.lock`结尾  
>不能包含`@{`  
>不能包含`\`

创建的里程碑默认只在本地版本库中可见。  
推送里程碑`git push origin <tagname>`  
推送所有`git push origin refs/tags/*`  
删除远程里程碑`git push <remote_url> :<tagname>`如`git push origin :mytag2`

Linux中的里程碑命名

* 都是以v开头
* 以-rc<num>为后缀的是先于正式版发布的预览发布版本
* 正式版去掉了预览发布版的后缀
* 正式版发布后的升级或修正版本是通过最后一位数字的变动来实现的

Android中的里程碑命名

* 格式为android-<大版本号>_r<小版本号>

#### 分支
* 用法1：`git branch`
* 用法2：`git branch <branchname>`
* 用法3：`git branch <brahchname> <start-point>`
* 用法4：`git branch -d <branchname>`
* 用法5：`git branch -D <branchname>`
* 用法6：`git branch -m <oldbranch> <newbranch>`
* 用法7：`git branch -M <oldbranch> <newbranch>`

用法1用于显示本地分支列表。当前分支在输出中会显示为特别的颜色，并用星号标识出来。  
用法2基于当前HEAD创建分支。
用法3基于提交<start-point>创建新分支。  
用法4在删除分支时会检查所要删除的分支是否已经合并到其他分支中，否则拒绝删除  
用法5会强制删除分支  
用法6用于重命名，如果已有同名分支则拒绝重命名  
用法7用于强制重命名

建立并切换分支  
`git checkout -b <new_branch> [<start_point>]`

`git push origin user2/i18n:master`  
含义是用本地的user2/i18n引用的内容更新远程共享版本库的master引用内容

#### 远程版本库
注册远程版本库  
`git remote add new-remote file:...git`  
查看已经注册的远程版本库  
`git remote -v`  
更改远程版本库的地址(加`--push`可以单独设置push地址)  
`git remote set-url new-remote file:...git`  
更改远程版本库的名称  
`git remote rename new-remote user2`  
查看远程分支  
`git branch -r`  
获取所有远程版本库的更新  
`git remote update`  
删除远程版本库  
`git remote rm user2`

#### 补丁文件
将最近的3个提交转换为补丁  
`git format-patch -s HEAD~3..HEAD`  
使用的-s参数会在导出补丁文件中田间当前用户的签名。这个签名并非GunPG式的数字签名，不过是将作者姓名添加到提交说明中而已。

发送邮件  
`git send-email *.patch`  
提供交互式字符界面，输入收件人地址，就批量地发送出去了

使用`mail`可以进入Linux的邮件界面  
`& s 1-3 user1-mail-archive`提取三个包含补丁的邮件保持到另外的文件中  
`mail -f user1-mail-archive`查看归档文件的内容  
`git am user1-mail-archive`切换分支后使用am命令将补丁打到当前分支上，其中am是apply email的缩写  
或者使用管道符来打补丁文件  
`ls *.patch`  
`cat *.patch|git am`

#### Topgit
安装

    git clone git://repo.or.cz/topgit.git
    cd topgit
    make
    make install

默认会把Topgit安装到$HOME/bin下，如果具有root权限，可以在编译安装时指定路径

    make prefix=/usr
    sudo make prefix=/usr install

#### Git
默认端口9418
