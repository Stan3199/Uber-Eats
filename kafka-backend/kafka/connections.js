var kafka = require("kafka-node");

var s = (require("events").EventEmitter.prototype._maxListeners = 100);

function ConnectionProvider() {
  this.getConsumer = function(topic_name) {
    this.client = new kafka.KafkaClient({
     kafkaHost: "ec2-3-15-189-94.us-east-2.compute.amazonaws.com:9092",
     // kafkaHost: "localhost:9092",
    });
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 }
    ]);
    this.client.on("ready", function() {
      console.log("consumer connection");
      console.log("client ready!");
    });

    return this.kafkaConsumerConnection;
  };
  this.getProducer = function() {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.KafkaClient({
      kafkaHost: "ec2-3-15-189-94.us-east-2.compute.amazonaws.com:9092",
       //kafkaHost: "localhost:9092",
      });
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      console.log("producer ready in kafka backend");
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider();
