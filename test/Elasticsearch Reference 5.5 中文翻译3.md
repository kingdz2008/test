# Set up X-Pack
安装X-Pack

X-Pack is an Elastic Stack extension that bundles security, alerting, monitoring, reporting, machine learning, and graph capabilities into one easy-to-install package. To access this functionality, you must install X-Pack in Elasticsearch.  
X-Pack是一个可伸缩的栈扩展以及处理安全、警报、监控、报告、机器学习和图标能力的易于安装的组合。为了使用这些功能，你必须在Elasticsearch中安装X-Pack。

## Installing X-Pack in Elasticsearch
在Elasticsearch中安装X-Pack

After you install Elasticsearch, you can optionally obtain and install X-Pack. For more information about how to obtain X-Pack, see https://www.elastic.co/products/x-pack.  
在你安装Elasticsearch之后，你可以选择获取和安装X-Pack。关于如何获取X-Pack，请参考[x-pack网站](https://www.elastic.co/products/x-pack)。

You must run the version of X-Pack that matches the version of Elasticsearch you are running.

你要运行的X-Pack的版本必须匹配你正在使用的Elasticsearch的版本。

> Important  
> 重要  
If you are installing X-Pack for the first time on an existing cluster, you must perform a full cluster restart. Installing X-Pack enables security and security must be enabled on ALL nodes in a cluster for the cluster to operate correctly. When upgrading you can usually perform a rolling upgrade.  
如果你对于已有的集群首次安装X-Pack，你必须将整个集群重新启动。安装X-Pack必须保证安全并且对于集群中每个节点都必须正确操作。当你进行升级的时候你通常可以选择滚动升级。

To install X-Pack in Elasticsearch:  
在Elasticsearch上安装X-Pack：

1. Optional: If you want to install X-Pack on a machine that doesn’t have internet access:
选项：如果你希望在没有网络的机器上安装X-Pack：

	* Manually download the X-Pack zip file: https://artifacts.elastic.co/downloads/packs/x-pack/x-pack-5.5.2.zip (sha1)  
	手动下载X-Pack的zip文件：[下载链接](https://artifacts.elastic.co/downloads/packs/x-pack/x-pack-5.5.2.zip)
        > Note  
        > 注意  
        The plugins for Elasticsearch, Kibana, and Logstash are included in the same zip file. If you have already downloaded this file to install X-Pack on one of those other products, you can reuse the same file.  
        用于Elasticsearch、Kibana和Logstash的插件在相同的zip文件中。如果你已经下载了其中的这个文件来安装X-Pack，你可以重用相同的文件。
        
	* Transfer the zip file to a temporary directory on the offline machine. (Do NOT put the file in the Elasticsearch plugins directory.)   
	将zip文件放置在离线机器的临时目录中。（不要文件放置在Elasticsearch插件目录下。）

2. Run bin/elasticsearch-plugin install from ES_HOME on each node in your cluster:  
运行bin/elasticsearch-plugin从ES_HOME中开始安装对于你的集群中的每个节点：

	`bin/elasticsearch-plugin install x-pack`

    > Note  
    > 注意  
    If you are using a DEB/RPM distribution of Elasticsearch, run the installation with superuser permissions.  
	如果你使用使用Elasticsearch的DEB或RPM，使用超级管理员的权限来运行安装。

    The plugin install scripts require direct internet access to download and install X-Pack. If your server doesn’t have internet access, specify the location of the X-Pack zip file that you downloaded to a temporary directory.  
	插件安装脚本要求直接网络访问来下载和安装X-Pack。如果你的服务器没有网络访问，指定你下载到临时目录的X-Pack的zip文件的位置。

    `bin/elasticsearch-plugin install file:///path/to/file/x-pack-5.5.2.zip`

    > Note  
    > 注意  
    You must specify an absolute path to the zip file after the file:// protocol.  
	你必须使用`file://`协议来指定zip文件的绝对路径。

3. Confirm that you want to grant X-Pack additional permissions.  
确认你已经被授予了X-Pack的额外的权限。

	> Tip  
	> 提示  
    Specify the --batch option when running the install command to automatically grant these permissions and bypass these install prompts.  
	指定`--batch`选项在运行自动安装命令的时候赋予了这些全蝎和通过这些安装许可。

	* X-Pack needs these permissions to set the threat context loader during install so Watcher can send email notifications.  
	X-Pack需要这些权限来设置关键的上下文加载器在安装的过程中因此Watcher可以发送邮件提醒。

	```
	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	@     WARNING: plugin requires additional permissions     @
	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	* java.lang.RuntimePermission accessClassInPackage.com.sun.activation.registries
	* java.lang.RuntimePermission getClassLoader
	* java.lang.RuntimePermission setContextClassLoader
	* java.lang.RuntimePermission setFactory
	* java.security.SecurityPermission createPolicy.JavaPolicy
	* java.security.SecurityPermission getPolicy
	* java.security.SecurityPermission putProviderProperty.BC
	* java.security.SecurityPermission setPolicy
	* java.util.PropertyPermission * read,write
	* java.util.PropertyPermission sun.nio.ch.bugLevel write
	* javax.net.ssl.SSLPermission setHostnameVerifier
	See http://docs.oracle.com/javase/8/docs/technotes/guides/security/permissions.html
	for descriptions of what these permissions allow and the associated risks.
	
	Continue with installation? [y/N]y
	```

	* X-Pack requires permissions to enable Elasticsearch to launch the machine learning analytical engine. The native controller ensures that the launched process is a valid machine learning component. Once launched, communications between the machine learning processes and Elasticsearch are limited to the operating system user that Elasticsearch runs as.  
	X-Pack要求允许Elasticsearch来启动机器学习分析引擎。本地的控制器保证加载进程是合法的机器学习组件。一旦加载、机器学习集成之间的通信和Elasticsearch被限制于Elasticsearch运行的操作系统用户上。

	```
	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	@        WARNING: plugin forks a native controller        @
	@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	This plugin launches a native controller that is not subject to
	the Java security manager nor to system call filters.
	
	Continue with installation? [y/N]y
	```

4. X-Pack will try to automatically create a number of indices within Elasticsearch. By default, Elasticsearch is configured to allow automatic index creation, and no additional steps are required. However, if you have disabled automatic index creation in Elasticsearch, you must configure action.auto_create_index in elasticsearch.yml to allow X-Pack to create the following indices:  
X-Pack将试图自动创建一系列指定使用Elasticsearch。默认的，Elasticsearch可以被配置来允许自动创建索引并且不需要额外的步骤。然而，如果你需要关闭在Elasticsearch中的自动索引创建，你必须在`elasticsearch.yml`中配置`action.auto_create_index`来允许X-Pack来创建下面的指示：
	`action.auto_create_index: .security,.monitoring*,.watches,.triggered_watches,.watcher-history*,.ml*`

	> Important  
	> 重要  
	If you are using Logstash or Beats then you will most likely require additional index names in your action.auto_create_index setting, and the exact value will depend on your local configuration. If you are unsure of the correct value for your environment, you may consider setting the value to * which will allow automatic creation of all indices.  
	如果你使用Logstash或Beats，你可能需要额外的索引名在你的`action.auto_create_index`设置中，并且值将会依赖于你本地的配置。如果你不能保证你环境中正确的值，你可以考虑设置值为*来允许自动创建所有的索引。

5. Start Elasticsearch.  
启动Elasticsearch

	`bin/elasticsearch`

For information, see Installing X-Pack on Kibana and Installing X-Pack on Logstash.
有关更多的信息，见[Installing X-Pack on Kibana](https://www.elastic.co/guide/en/kibana/5.5/installing-xpack-kb.html "Installing X-Pack on Kibana")和[Installing X-Pack on Logstash](http://www.elastic.co/guide/en/logstash/5.5/installing-xpack-log.html)

> Important  
> 重要  
SSL/TLS encryption is disabled by default, which means user credentials are passed in the clear. Do not deploy to production without enabling encryption! For more information, see Encrypting Communications.  
SSL/TLS加密默认是关闭的，意味着用户凭证是通过名文传递的。如果没有部署到生产上是不需要加密的！对于更多的信息，见加密通信。  
You must also change the passwords for the built-in elastic user and the kibana user that enables Kibana to communicate with Elasticsearch before deploying to production. For more information, see Setting Up User Authentication.  
你也必须改变内置elastic用户和kibana用户的密码来保证Kibana和Elasticsearch的通信在部署到生产环境之前。有关更多的信息，见设置用户权限。

Installing X-Pack on a DEB/RPM Package Installation  
使用DEB/RPM安装包来安装X-Pack

If you use the DEB/RPM packages to install Elasticsearch, by default Elasticsearch is installed in /usr/share/elasticsearch and the configuration files are stored in /etc/elasticsearch. (For the complete list of default paths, see Debian Directory Layout and RPM Directory Layout in the Elasticsearch Reference.)

To install X-Pack on a DEB/RPM package installation, you need to run bin/plugin install from the /usr/share/elasticsearch directory with superuser permissions:

cd /usr/share/elasticsearch
sudo bin/elasticsearch-plugin install x-pack

Note

If the configuration files are not in /etc/elasticsearch you need to specify the location of the configuration files by setting the system property es.path.conf to the config path via ES_JAVA_OPTS="-Des.path.conf=<path>" or by setting the environment variable CONF_DIR via CONF_DIR=<path>.