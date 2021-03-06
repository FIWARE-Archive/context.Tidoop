#<a name="section0"></a>Tidoop - Extensions for Hadoop

* [What is Tidoop - Extensions for Hadoop](#section1)
* [Building](#section2)
    * [Prerequisites](#section2.1)
    * [Building tidoop-hadoop-ext and its dependencies](#section2.2)
    * [Unit tests](#section2.3)
* [Installation](#installation)
* [Usage](#section3)
    * [CKAN extensions](#section3.1)
        * [Introducing `CKANMapReduceExample`](#section3.1.1)
        * [`CKANInputFormat` and related classes](#section3.1.2)
        * [`CKANOutputFormat` and related classes](#section3.1.3)
        * [Running `CKANMapReduceExample`](#section3.1.4)
        * [CKAN extensions in a hybrid scenario](#section3.1.5)
    * [NGSI extensions](#section3.2)
* [Contact](#section4)

##<a name="section1"></a>What is Tidoop - Extensions for Hadoop

Tidoop - Extensions for Hadoop (tidoop-hadoop-ext) is a suite of extensions for [Hadoop](apache.hadoop.org), the <i>defacto</i> Big Data standard for batch data analysis based in the MapReduce paradigm.

Typically, MapReduce applications within Hadoop read the data to be analyzed from HDFS, the Hadoop Distributed File System. Neverhteless, it may happen the data meant to be analyzed is not in HDFS, but in a remote non-HDFS storage. In that cases, the data must be moved to HDFS in order it can be read by MapReduce applications.

By using tidoop-hadoop-ext you will not need to copy data from remote to HDFS anymore, but you will be able to read such data by pointing to it. At least, this is true if your data is stored at:

* [CKAN](ckan.org), the Open Data platform.
* [NGSI Short-Term Historic](https://github.com/telefonicaid/IoT-STH), the NGSI-oriented storage for [Orion Context Broker](https://github.com/telefonicaid/fiware-orion).

The extensions provide specific Java classes per each remote storage type; those classes must be packaged into a Java jar file.

[Top](#section0)
##<a name="section2"></a>Building
###<a name="section2.1"></a>Prerequisites

Maven (and thus Java SDK, since Maven is a Java tool) is needed in order to build tidoop-hadoop-ext.

In order to install Java SDK (not JRE), just type (CentOS machines):

    $ yum install java-1.6.0-openjdk-devel

Remember to export the JAVA_HOME environment variable. In the case of using `yum install` as shown above, it would be:

    $ export JAVA_HOME=/usr/lib/jvm/java-1.6.0-openjdk.x86_64

In order to do it permanently, edit `/root/.bash_profile` (`root` user) or `/etc/profile` (other users).

Maven is installed by downloading it from [maven.apache.org](http://maven.apache.org/download.cgi). Install it in a folder of your choice (represented by `APACHE_MAVEN_HOME`):

    $ wget http://www.eu.apache.org/dist/maven/maven-3/3.2.5/binaries/apache-maven-3.2.5-bin.tar.gz
    $ tar xzvf apache-maven-3.2.5-bin.tar.gz
    $ mv apache-maven-3.2.5 APACHE_MAVEN_HOME

[Top](#section0)

###<a name="section2.2"></a>Building tidoop-hadoop-ext and its dependencies

Build the project; this can be done by including the dependencies in the package (**recommended**):

    $ git clone https://github.com/telefonicaid/fiware-tidoop.git
    $ git checkout <branch>
    $ APACHE_MAVEN_HOME/bin/mvn clean compile assembly:single

or not:

    $ git clone https://github.com/telefonicaid/fiware-tidoop.git
    $ git checkout <branch>
    $ APACHE_MAVEN_HOME/bin/mvn package

where `<branch>` is `develop` if you are trying to install the latest features or `release/x.y.z` if you are trying to install a stable release.

If the dependencies are included in the built tidoop-hadoop-ext package, then nothing has to be done. If not, and depending on the tidoop-hadoop-ext components you are going to use, you may need to install additional .jar files somewhere in the classpath. Typically, you can get the .jar file from your Maven repository (under `/home/<your_user>/.m2` folder in your user home directory) and use the `cp` command.

Once you have built tidoop-hadoop-ext a `tidoop-x.y.z-jar-with-dependencies.jar` / `tidoop-x.y.z.jar` (depending on the dependencies are packaged or not, respectively) file will appear under `target/` folder. This jar is the file you will need to add to your Hadoop classpath in order to use the tidoop-hadoop-ext extensions. 

[Top](#section0)

###<a name="section2.2"></a>Unit tests

Run them by invoking Maven:

    $ /usr/local/apache-maven-3.2.5/bin/mvn test
   
Example:
 
```
$ /usr/local/apache-maven-3.2.5/bin/mvn test
...
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running com.telefonica.iot.tidoop.backends.ckan.CKANResponseTest
Testing CKANResponse.getStatusCode
Testing CKANResponse.getJsonObject
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.348 sec
Running com.telefonica.iot.tidoop.backends.ckan.CKANBackendTest
log4j:WARN No appenders could be found for logger (com.telefonica.iot.tidoop.http.HttpClientFactory).
log4j:WARN Please initialize the log4j system properly.
log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
Testing CKANBackend.getPackages
Testing CKANBackend.getResources
Testing CKANBackend.getNumRecords
Testing CKANBackend.getRecords
Testing CKANBackend.doCKANRequest (no payload)
Testing CKANBackend.doCKANRequest (with payload)
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.209 sec
Running com.telefonica.iot.tidoop.hadoop.ckan.CKANRecordReaderTest
Testing CKANRecordReader.getCurrentValue
Testing CKANRecordReader.close
Testing CKANRecordReader.initialize
Testing CKANRecordReader.getProgress
Testing CKANRecordReader.nextKeyValue
Testing CKANRecordReader.getCurrentKey
Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.191 sec
Running com.telefonica.iot.tidoop.hadoop.ckan.CKANInputFormatTest
Testing CKANInputFormat.setCKANEnvironmnet
Testing CKANInputFormat.setInput
Testing CKANInputFormat.getSplits (resource)
Testing CKANInputFormat.getSplits (package)
Testing CKANInputFormat.getSplits (organization)
Testing CKANInputFormat.setInput
Testing CKANInputFormat.createRecordReader)
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.757 sec
Running com.telefonica.iot.tidoop.hadoop.ckan.CKANInputSplitTest
Testing CKANInputSplit.getResId
Testing CKANInputSplit.readFields
Testing CKANInputSplit.write
Testing CKANInputSplit.getFirstRecordIndex
Testing CKANInputSplit.getLocations
Testing CKANInputSplit.getLength
Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.047 sec

Results :

Tests run: 24, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 5.377 s
[INFO] Finished at: 2015-02-26T13:00:31+01:00
[INFO] Final Memory: 8M/104M
[INFO] ------------------------------------------------------------------------
```

[Top](#section0)

##<a name="install"></a>Installation
You can directly use the built `tidoop-hadoop-ext-x.y.z-jar-with-dependencies.jar` / `tidoop-hadoop-ext-x.y.z.jar` file (depending on wether you pack the dependencies or not, respectively) under the `target` directory, or you can copy the jar file somewhere in the Java classpath.

[Top](#installation)

##<a name="section3"></a>Usage

###<a name="section3.1"></a>CKAN extensions

**Disclaimer:** If you are reading this section then you should be familiar with CKAN concepts and hierarchies. However, as a quick reminder, it will be said that CKAN organizes the data into <i>organizations</i>, having each organization a set of <i>packages</i> or <i>datasets</i>, having each package/organization a set of <i>resources</i>. Finally, each resource has a list of data records.

[Top](#section0)

####<a name="section3.1.1"></a>Introducing `CKANMapReduceExample`

A good way to learn about CKAN extensions is to have a look to the testing purpose MapReduce application distributed with tidoop-hadoop-ext. This can be found at `src/main/java/com/telefonica/iot/tidoop/utils/CKANMapReduceExample.java`. This application is in charge of counting the number of bytes among all the configured inputs.

Map and Reduce classes are the following ones, they are very simple:

```
/**
 * Mapper class. It receives a CKAN record pair (Object key, Text ckanRecord) and returns a (Text globalKey,
 * IntWritable recordLength) pair about a common global key and the length of the record.
 */
public static class RecordSizeGetter extends Mapper<Object, Text, Text, IntWritable> {
      
    private final Text globalKey = new Text("size");
    private final IntWritable recordLength = new IntWritable();

    @Override
    public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
        recordLength.set(value.getLength());
        context.write(globalKey, recordLength);
    } // map
        
} // RecordSizeGetter
```

```
/**
 * Reducer class. It receives a list of (Text globalKey, IntWritable length) pairs and computes the sum of all the
 * lengths, producing a final (Text globalKey, IntWritable totalLength).
 */
public static class RecordSizeAdder extends Reducer<Text, IntWritable, Text, IntWritable> {
        
    private final IntWritable totalLength = new IntWritable();

    @Override
    public void reduce(Text globalKey, Iterable<IntWritable> recordLengths, Context context)
        throws IOException, InterruptedException {
        int sum = 0;
            
        for (IntWritable val : recordLengths) {
            sum += val.get();
        } // for
            
        totalLength.set(sum);
        context.write(globalKey, totalLength);
    } // reduce
        
} // RecordSizeAdder
```

The relevant part of the code can be found within the `main` class, where the MapReduce job is defined, configured and finally started:

``` java
@Override
public int run(String[] args) throws Exception {
    // check the number of arguments, show the usage if it is wrong
    if (args.length != 7) {
        showUsage();
    } // if
    
    // get the arguments
    String ckanHost = args[0];
    String ckanPort = args[1];
    boolean sslEnabled = args[2].equals("true");
    String ckanAPIKey = args[3];
    String ckanInputs = args[4];
    String ckanOutput = args[5];
    String splitsLength = args[6];
        
    // create and configure a MapReduce job
    Configuration conf = this.getConf();
    Job job = Job.getInstance(conf, "CKAN MapReduce test");
    job.setJarByClass(CKANMapReduceExample.class);
    job.setMapperClass(RecordSizeGetter.class);
    job.setCombinerClass(RecordSizeAdder.class);
    job.setReducerClass(RecordSizeAdder.class);
    job.setOutputKeyClass(Text.class);
    job.setOutputValueClass(IntWritable.class);
    job.setInputFormatClass(CKANInputFormat.class);
    CKANInputFormat.setInput(job, ckanInputs);
    CKANInputFormat.setEnvironment(job, ckanHost, ckanPort, sslEnabled, ckanAPIKey);
    CKANInputFormat.setSplitsLength(job, splitsLength);
    job.setOutputFormatClass(CKANOutputFormat.class);
    CKANOutputFormat.setEnvironmnet(job, ckanHost, ckanPort, sslEnabled, ckanAPIKey);
    CKANOutputFormat.setOutputPkg(job, ckanOutput);
        
    // run the MapReduce job
    return job.waitForCompletion(true) ? 0 : 1;
} // main
```

As can be seen, everything is as usual in a MapReduce application... except for the input and output formats; as can be seen, in order to use the CKAN extensions the `CKANInputFormat` and `CKANOutputFormat` classes must be set.

[Top](#section0)

####<a name="section3.1.2"></a>`CKANInputFormat` and related classes

The `CKANInputFormat` class, as any other `InputFormat` class:

* When asked for the input splits definition, will create a bunch of `CKANInputSplit` objects.
* And when asked for a record reader for those input splits, it will create a specific `CKANRecordReader`.

A `CKANInputSlit` references the resource where the records can be found, in addition to the offset start and length within that resource. Thus, assuming a CKAN resource has 3580 records and the maximum length for a split is set to 1000 then 4 splits will be defined:

* split #1: offset start=0, length=1000 (1000 records are represented)
* split #2: offset start=1000, length=2000 (1000 records are represented)
* split #3: offset start=2000, length=3000 (1000 records are represented)
* split #4: offset start=3000, length=580 (580 records are represented)

The `CKANInputFormat` is configured by providing:

* The host where the CKAN server runs.
* The port used to connect to the CKAN server, usually `80` or `443`.
* If SSL is enabled (typically, this is equals to `true` if the `443` port is used).
* The CKAN API key necessary to authenticate against the CKAN server.
* The input data within CKAN that will be analyzed.
* The splits lenght.

Regarding the input data, worths mentioning this may be a CKAN <i>organization</i> name, a <i>package/dataset</i> name or a <i>resource</i> identifier. Both in the case of organizations and packages/datasets these are internally expanded until the resoure level. Thus for instance, by configuring a whole organization all the packages under it, and all the resources under all the packages will be processed. In addition, the method `setCKANInput` supports a list of comma-separated inputs of any type (e.g. you can combine a single organization with a subset of packages under any other organization, or selected resources from several packages related to several organizations).

[Top](#section0)

####<a name="section3.1.3"></a>`CKANOutputFormat` and related classes

The `CKANOutputFormat` class, as any other `OutputFormat` class, is in charge of:

* Checking the output specifications are correct. In this case, it is checked the output package/dataset exists in CKAN. If not, it is created (if and only if the provided CKAN API key allows to do that).
* Creating and output committer. In the case of CKAN, a dummy `CKANOutputCommitter` is created since no temporal, nor partial data is stored anywhere.
* Creating a record writer. A `CKANRecordWriter` is provided on request, implementing all the necessary to create a new resource within the given output CKAN package/dataset

The `CKANOutputFormat` is configured by providing:

* The host where the CKAN server runs.
* The port used to connect to the CKAN server, usually `80` or `443`.
* If SSL is enabled (typically, this is equals to `true` if the `443` port is used).
* The CKAN API key necessary to authenticate against the CKAN server.
* The output package/dataset within CKAN where the output will be written.

Regarding the output, this is always a package/dataset as above mentioned. An specific resource is not allowed since it is convenient the naming convention (the resource will be named as the concatenation of the running timestamp and the name of the job) and the format of the resource's data (a collection of (key, value) pairs, the same the reducers will be outputting) remains constant between several runs of the job.
 
[Top](#section0)

####<a name="section3.1.4"></a>Running `CKANMapReduceExample`

The application can be run as:

    $ hadoop jar \
        target/ckan-protocol-0.1-jar-with-dependencies.jar \
        es.tid.fiware.fiwareconnectors.ckanprotocol.utils.CKANMapReduceExample \
        -libjars target/ckan-protocol-0.1-jar-with-dependencies.jar \
        <ckan host> \
        <ckan port> \
        <ssl enabled=true|false> \
        <ckan API key> \
        <comma-separated list of ckan inputs> \
        <ckan output package> \
        <splits length>
        
An example of run (using a fake CKAN API key "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"):

```
$ hadoop jar /home/user1/fiware-tidoop/target/tidoop-0.0.0_SNAPSHOT-jar-with-dependencies.jar com.telefonica.iot.tidoop.utils.CKANMapReduceExample -libjars /home/user1/fiware-tidoop/target/tidoop-0.0.0_SNAPSHOT-jar-with-dependencies.jar data.lab.fiware.org 443 true xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx https://data.lab.fiware.org/dataset/logrono_cygnus/resource/ca73a799-9c71-4618-806e-7bd0ca1911f4 https://data.lab.fiware.org/dataset/logrono_cygnus 1000
15/02/25 17:29:17 INFO client.RMProxy: Connecting to ResourceManager at test-iot-hadoop3/10.0.0.112:8050
15/02/25 17:29:18 INFO hdfs.DFSClient: Created HDFS_DELEGATION_TOKEN token 126 for user1 on ha-hdfs:testiotcloud
15/02/25 17:29:18 INFO security.TokenCache: Got dt for hdfs://testiotcloud; Kind: HDFS_DELEGATION_TOKEN, Service: ha-hdfs:testiotcloud, Ident: (HDFS_DELEGATION_TOKEN token 126 for user1)
15/02/25 17:29:20 INFO ckan.CKANInputFormat: Getting splits, the backend is at https://data.lab.fiware.org:443 (API key=2d5bf021-ff9f-48e3-bb97-395b77581665)
15/02/25 17:29:20 INFO http.HttpClientFactory: Setting max total connections (500)
15/02/25 17:29:20 INFO http.HttpClientFactory: Settubg default max connections per route (100)
15/02/25 17:29:20 INFO ckan.CKANInputFormat: Getting splits for https://data.lab.fiware.org/dataset/logrono_cygnus/resource/ca73a799-9c71-4618-806e-7bd0ca1911f4, it is a resource
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=0, split length=1000)
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=1000, split length=1000)
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=2000, split length=1000)
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=3000, split length=1000)
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=4000, split length=1000)
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=5000, split length=1000)
15/02/25 17:29:26 INFO ckan.CKANInputSplit: Creating split (resId=ca73a799-9c71-4618-806e-7bd0ca1911f4, first record index=6000, split length=665)
15/02/25 17:29:26 INFO ckan.CKANInputFormat: Number of total splits=7
15/02/25 17:29:26 INFO mapreduce.JobSubmitter: number of splits:7
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.job.classpath.files is deprecated. Instead, use mapreduce.job.classpath.files
15/02/25 17:29:26 INFO Configuration.deprecation: user.name is deprecated. Instead, use mapreduce.job.user.name
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.jar is deprecated. Instead, use mapreduce.job.jar
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.cache.files.filesizes is deprecated. Instead, use mapreduce.job.cache.files.filesizes
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.cache.files is deprecated. Instead, use mapreduce.job.cache.files
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.output.value.class is deprecated. Instead, use mapreduce.job.output.value.class
15/02/25 17:29:26 INFO Configuration.deprecation: mapreduce.combine.class is deprecated. Instead, use mapreduce.job.combine.class
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.used.genericoptionsparser is deprecated. Instead, use mapreduce.client.genericoptionsparser.used
15/02/25 17:29:26 INFO Configuration.deprecation: mapreduce.map.class is deprecated. Instead, use mapreduce.job.map.class
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.job.name is deprecated. Instead, use mapreduce.job.name
15/02/25 17:29:26 INFO Configuration.deprecation: mapreduce.reduce.class is deprecated. Instead, use mapreduce.job.reduce.class
15/02/25 17:29:26 INFO Configuration.deprecation: mapreduce.inputformat.class is deprecated. Instead, use mapreduce.job.inputformat.class
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.output.dir is deprecated. Instead, use mapreduce.output.fileoutputformat.outputdir
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.map.tasks is deprecated. Instead, use mapreduce.job.maps
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.job.queue.name is deprecated. Instead, use mapreduce.job.queuename
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.cache.files.timestamps is deprecated. Instead, use mapreduce.job.cache.files.timestamps
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.output.key.class is deprecated. Instead, use mapreduce.job.output.key.class
15/02/25 17:29:26 INFO Configuration.deprecation: mapred.working.dir is deprecated. Instead, use mapreduce.job.working.dir
15/02/25 17:29:27 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1422009001045_0060
15/02/25 17:29:27 INFO mapreduce.JobSubmitter: Kind: HDFS_DELEGATION_TOKEN, Service: ha-hdfs:testiotcloud, Ident: (HDFS_DELEGATION_TOKEN token 126 for user1)
15/02/25 17:29:27 INFO impl.YarnClientImpl: Submitted application application_1422009001045_0060 to ResourceManager at test-iot-hadoop3/10.0.0.112:8050
15/02/25 17:29:27 INFO mapreduce.Job: The url to track the job: http://test-iot-hadoop3:8088/proxy/application_1422009001045_0060/
15/02/25 17:29:27 INFO mapreduce.Job: Running job: job_1422009001045_0060
15/02/25 17:29:38 INFO mapreduce.Job: Job job_1422009001045_0060 running in uber mode : false
15/02/25 17:29:38 INFO mapreduce.Job:  map 0% reduce 0%
15/02/25 17:29:48 INFO mapreduce.Job:  map 14% reduce 0%
15/02/25 17:29:50 INFO mapreduce.Job:  map 29% reduce 0%
15/02/25 17:29:51 INFO mapreduce.Job:  map 57% reduce 0%
15/02/25 17:29:54 INFO mapreduce.Job:  map 71% reduce 0%
15/02/25 17:29:55 INFO mapreduce.Job:  map 86% reduce 0%
15/02/25 17:29:56 INFO mapreduce.Job:  map 100% reduce 0%
15/02/25 17:29:58 INFO mapreduce.Job:  map 100% reduce 100%
15/02/25 17:29:58 INFO mapreduce.Job: Job job_1422009001045_0060 completed successfully
15/02/25 17:29:58 INFO mapreduce.Job: Counters: 43
	File System Counters
		FILE: Number of bytes read=83
		FILE: Number of bytes written=728904
		FILE: Number of read operations=0
		FILE: Number of large read operations=0
		FILE: Number of write operations=0
		HDFS: Number of bytes read=742
		HDFS: Number of bytes written=13
		HDFS: Number of read operations=17
		HDFS: Number of large read operations=0
		HDFS: Number of write operations=2
	Job Counters 
		Launched map tasks=7
		Launched reduce tasks=1
		Other local map tasks=7
		Total time spent by all maps in occupied slots (ms)=63794
		Total time spent by all reduces in occupied slots (ms)=4211
	Map-Reduce Framework
		Map input records=6665
		Map output records=6665
		Map output bytes=59985
		Map output materialized bytes=119
		Input split bytes=742
		Combine input records=6665
		Combine output records=7
		Reduce input groups=1
		Reduce shuffle bytes=119
		Reduce input records=7
		Reduce output records=1
		Spilled Records=14
		Shuffled Maps =7
		Failed Shuffles=0
		Merged Map outputs=7
		GC time elapsed (ms)=307
		CPU time spent (ms)=13390
		Physical memory (bytes) snapshot=2581950464
		Virtual memory (bytes) snapshot=9129463808
		Total committed heap usage (bytes)=2075787264
	Shuffle Errors
		BAD_ID=0
		CONNECTION=0
		IO_ERROR=0
		WRONG_LENGTH=0
		WRONG_MAP=0
		WRONG_REDUCE=0
	File Input Format Counters 
		Bytes Read=0
	File Output Format Counters 
		Bytes Written=0
```

As can be seen, the total size is computed and added as a (key, value) pair in a resource called `1428932653961_CKAN-MapReduce-test`.

![CKAN output](doc/images/ckan_output.png)

[Top](#section0)

####<a name="section3.1.5"></a>CKAN extensions in a hybrid scenario

As can be imagined, not always a pure CKAN scenario is considered, i.e. not always the input data is stored in CKAN and the resulting output is intended to be stored at CKAN as well. Some times, the input is stored in HDFS or any other storage, but the output is written in CKAN; or viceversa, the input data comes from CKAN and the MapReduce result is wanted to be put into HDFS. In those cases, simply use `CKANInputFormat` or `CKANOutputFormat` depending on your scenario in combination with other `OutputFormat` or other `InputFormat`, respectively.

[Top](#section0)

###<a name="section3.2"></a>NGSI extensions

To be released.

[Top](#section0)

##<a name="section4"></a>Reporting issues and contact information
There are several channels suited for reporting issues and asking for doubts in general. Each one depends on the nature of the question:

* Use [stackoverflow.com](http://stackoverflow.com) for specific questions about the software. Typically, these will be related to installation problems, errors and bugs. Development questions when forking the code are welcome as well. Use the `fiware-tidoop` tag.
* Use [fiware-tech-help@lists.fi-ware.org](mailto:fiware-tech-help@lists.fi-ware.org) for general questions about the software. Typically, these will be related to the conceptual usage of the component, e.g. wether it suites for your project or not. It is worth to mention the issues reported to [fiware-tech-help@lists.fi-ware.org](mailto:fiware-tech-help@lists.fi-ware.org) are tracked under [http://jira.fiware.org](http://jira.fiware.org); use this Jira to see the status of the issue, who has been assigneed to, the exchanged emails, etc, nevertheless the answers will be sent to you via email too.
* Personal email:
    * [francisco.romerobueno@telefonica.com](mailto:francisco.romerobueno@telefonica.com) **[Main contributor]**
    * [german.torodelvalle@telefonica.com](german.torodelvalle@telefonica.com) **[Contributor]**

**NOTE**: Please try to avoid personaly emailing the contributors unless they ask for it. In fact, if you send a private email you will probably receive an automatic response enforcing you to use [stackoverflow.com](stackoverflow.com) or [fiware-tech-help@lists.fi-ware.org](mailto:fiware-tech-help@lists.fi-ware.org). This is because using the mentioned methods will create a public database of knowledge that can be useful for future users; private email is just private and cannot be shared.

[Top](#section0)