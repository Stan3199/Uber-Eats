var connection = new require("./connections");

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    console.log(data);

    fname(data.data, function (err, res) {
      console.log("after handle" + res);
      console.log("after handle");
      if (err) console.error(err);
      if (res) console.log("after login reslt....>>>>>>>", res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];

      console.log("payloads", payloads);
      producer.send(payloads, function (err, data) {
        console.log(data);
        console.log("producer sent");
      });
      return;
    });
  });
}
module.exports = handleTopicRequest;
