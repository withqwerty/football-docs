---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-push-feeds
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.200Z
---
# Push Feeds

## Intro to Push

Push API feeds automatically send JSON payloads via a push service, and can dramatically reduce the number of calls you need to make to our RESTful API feeds. The structure of a Push feed is similar to the structure of a corresponding RESTful API feed.

Our Push services are based on an HTTP publish/subscribe model. When making a call to the Push feeds, you "subscribe" to various data feeds provided by our service. Whenever new content is available on a feed, the server pushes it out to your client. When no new information is available on the feed, a heartbeat message is sent every 5 seconds to keep the connection active.

If you want to filter the results of the feeds, there are several optional query string parameters that can be applied to a request. If left unfiltered, all data for the feed is displayed (i.e. all games, events, or statistics).

<br />

## Technical Requirements

For your applications to accept data from our Push feeds, ensure that your application can:

* Can follow a HTTP redirect or use the location provided in the feeds header within one minute of your initial request.
* Can accept HTTP data transfer encoded as chunked.

<br />

## Access

Push feeds are an add-on service, and unavailable in the self-issued trial within [your account](https://console.sportradar.com/login). Reach out to a [sales representative](mailto:sales@sportradar.com) for trial access.

Syntax for using our Push feeds and examples of the JSON payloads can be found on each endpoint page.

<br />

## Disconnections

Our Push service does not provide a "stateful session", there is no memory of what data has been sent previously.
Should you cease to receive heartbeat messages, or are disconnected from the Push service for any reason, re-connect using your same initial request.

<br />

## Samples

Each Push feed page includes code samples in Ruby, Java and Python which provide an example of feed consumption. Using these samples will output the feed content to STDOUT.

For Java, we have also provided a [Stream Client](https://api-docs.sportradar.us/push/stream-client.zip) to assist your integration.

*Note: In the provided Java sample, replace "URL GOES HERE" with the desired Push feed URL.*

```ruby
require 'httpclient'
module Sportradar
  module HTTP
    module Stream
      class Client
        attr_reader :url, :logger
        def initialize(url, api_key, logger)
          @url = url
          @logger = logger
          @api_key = api_key
          @client = ::HTTPClient.new(agent_name: 'SportsData/1.0')
        end
        def start
          @thread ||= Thread.new do
            logger.debug "Starting loop"
            headers = {
              'x-api-key' => @api_key
            }
            @client.get_content(url, header: headers, follow_redirect: true) do |chunk|
              @publisher.publish(::JSON.parse(chunk)) if @publisher
            end
            logger.debug "finished loop"
          end
        end
        def stop
          @thread.terminate if @thread
        end
      end
    end
  end
end
```
```java
package com.sportradar.http.stream.client;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
public class StreamClient {
    private Thread streamThread;
    private volatile boolean running = false;
    private String apiKey;
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    public void stream(String serviceUrl, Handler handler) {
        running = true;
        streamThread = new Thread(() -> {
            try {
                URL url = new URL(serviceUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("User-Agent", "SportsData/1.0");
                if (apiKey != null && !apiKey.isEmpty()) {
                    connection.setRequestProperty("x-api-key", apiKey);
                }
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                    String line;
                    while (running && (line = reader.readLine()) != null) {
                        if (!line.trim().isEmpty()) {
                            handler.handle(line);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        streamThread.start();
    }
    public void terminate() {
        running = false;
        if (streamThread != null) {
            streamThread.interrupt();
        }
    }
}
```
