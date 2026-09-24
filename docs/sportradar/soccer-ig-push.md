---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-push
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.193Z
---
# Push Feeds

## Intro

With our RESTful endpoints, you'll make API requests when you want to receive new data. But our Push feeds allow you to open a connection with a single call to receive continuous live updates. Once this connection opens, it will remain open indefinitely.

Thus, Push feeds are an efficient option to retrieve live Soccer match data. You need not worry about API pull frequency, but need only to "listen" for game updates.

<br />

***

## RESTful & Push

Each Push update comes in the form of a **JSON or XML** payload, which will mimic the structure of a similar RESTful Soccer API endpoint. Payloads are delivered for **changes to events and statistics**, but **not match status updates**.

Below are the Push endpoints alongside their RESTful counterparts.

| Push Feed                                                                                       | RESTful Counterparts                                                                                                                                                                                     |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events)**         | -[Live Timelines](https://developer.sportradar.com/soccer/reference/soccer-live-timelines) <br /> -[Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) |
| **[Push Statistics](https://developer.sportradar.com/soccer/reference/soccer-push-statistics)** | -[Live Summaries](https://developer.sportradar.com/soccer/reference/soccer-live-summaries) <br /> -[Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary)   |

It's important to note that our Push service is not meant to replace our RESTful API, but to complement it. Push does not provide a "stateful session". There is no memory or method to access data sent previously. If you are disconnected from a Push session, use the corresponding RESTful API feed to catch up or recover from the disconnection. For example, if you experience a disconnection from a game while using **Push Events**, request the RESTful **Live Timelines**  or **Sport Event Timeline** endpoints to capture the plays missed during the disconnection.

Additionally, it is important to note that Push feeds correlate to RESTful endpoints, but are not necessarily a 1:1 parity for all Soccer data. For a complete Soccer experience, you will need to make use of RESTful endpoints.

<br />

***

## Access

Soccer Push feeds are an add-on service, and unavailable in the self-issued Soccer trial within [your account](https://console.sportradar.com/). Reach out to a [sales representative](mailto:sales@sportradar.com) for trial access.

  ### Soccer Push feeds are available for Sportradar _Realtime_ customers only

<br />

### Make a Request

Each Push feed starts with a URL request, as with our other RESTful API endpoints.

```shell Soccer Push Feed Syntax
curl -L -X GET 'https://api.sportradar.com/soccer/{access_level}/{version}/stream/events/subscribe' \
  -H 'x-api-key: {your_api_key}'
```

When constructed, the above call opens up an HTTP redirect connection, returning all Push data for the requested feed. To [filter](https://developer.sportradar.com/soccer/docs/soccer-ig-push#filtering) results to a smaller data set include an optional query string.

There are no restrictions on the number of connections you may have open. Feel free to filter requests to individual games and close the connections when games complete, or keep a single unfiltered connection open indefinitely.

Visit the feed [endpoints pages](https://developer.sportradar.com/soccer/reference/soccer-push-feeds) for complete syntax instructions.

<br />

### Filtering

By default, a Push feed will provide all data available. For example, a [Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events) connection would stream **all** Soccer matches in progress to your application. If needed, you can filter the data returned by including [query strings](https://developer.sportradar.com/soccer/reference/soccer-push-events#optional-query-string-parameters).

For example, let's say you want to restrict your connection to one Soccer match in progress. Construct your call as normal and add the unique match `id` to the query string.

Here's an example:

```shell Soccer Push Events Sample Request
curl -L -X GET 'https://api.sportradar.com/soccer/trial/v4/stream/events/subscribe?&format=json&sport_event_id=sr:sport_event:13468929' \
  -H 'x-api-key: {your_api_key}'
```

Visit the feed [endpoints pages](https://developer.sportradar.com/soccer/reference/soccer-push-events#optional-query-string-parameters) for complete query string syntax instructions.

<br />

### Technical Requirements

To accept data from our Push feeds, ensure that your application can:

* Follow an HTTP redirect, or use the location provided in the feeds header within one minute of your initial request.
* Accept HTTP data transfer encoded as chunked.

<br />

***

## Payloads

Our Push services are delivered by HTTP Streaming with chunked encoding, also commonly called [HTTP Chunked](https://en.wikipedia.org/wiki/Chunked_transfer_encoding). The streaming of data is based on long HTTP response. Chunked streaming allows you to act on the chunks immediately instead of waiting or requesting a full file.

When new feed content is available, the server pushes that information out to your client. When no new information is available on a feed, a heartbeat message is sent every 5 seconds to keep the connection active.

Messages are delivered in JSON format only.

```json Heartbeat Sample (Push Events)
{
   "heartbeat":{
      "from":1724956680,
      "interval":5,
      "to":1724956685,
      "type":"events",
      "package":"soccer-v4"
   }
}{
   "payload":{
      "sport_event_status":{
         "status":"live",
         "match_status":"1st_half",
         "home_score":0,
         "away_score":0,
         "period_scores":[
            {
               "home_score":0,
               "away_score":0,
               "type":"regular_period",
               "number":1
            }
         ],
         "ball_locations":[
            {
               "order":4,
               "x":48,
               "y":54,
               "qualifier":"away"
            },
            {
               "order":3,
               "x":95,
               "y":50,
               "qualifier":"away"
            },
            {
               "order":2,
               "x":73,
               "y":40,
               "qualifier":"home"
            },
            {
               "order":1,
               "x":35,
               "y":34,
               "qualifier":"home"
            }
         ],
         "match_situation":{
            "status":"attack",
            "qualifier":"away",
            "updated_at":"2024-08-29T18:38:00+00:00"
         }
      },
      "event":{
         "id":1830321677,
         "type":"yellow_card",
         "time":"2024-08-29T18:35:21+00:00",
         "match_time":36,
         "competitor":"home",
         "period":1,
         "period_type":"regular_period",
         "updated":true,
         "updated_time":"2024-08-29T18:38:01+00:00"
      }
   },
   "metadata":{
      "format":"json",
      "sport_event_id":"sr:sport_event_id:52633607",
      "event_id":"yellow_card",
      "channel":"soccer",
      "competition_id":"sr:competition:34480",
      "sport_id":"sr:sport:1",
      "season_id":"sr:season:119783"
   }
}{
   "payload":{
      "sport_event_status":{
         "status":"live",
         "match_status":"1st_half",
         "home_score":0,
         "away_score":2,
         "period_scores":[
            {
               "home_score":0,
               "away_score":2,
               "type":"regular_period",
               "number":1
            }
         ],
         "ball_locations":[
            {
               "order":4,
               "x":66,
               "y":37,
               "qualifier":"home"
            },
            {
               "order":3,
               "x":89,
               "y":44,
               "qualifier":"home"
            },
            {
               "order":2,
               "x":63,
               "y":63,
               "qualifier":"home"
            },
            {
               "order":1,
               "x":55,
               "y":67,
               "qualifier":"home"
            }
         ],
         "match_situation":{
            "status":"attack",
            "qualifier":"home",
            "updated_at":"2024-08-29T18:38:03+00:00"
         }
      },
      "event":{
         "id":1830309249,
         "type":"score_change",
         "time":"2024-08-29T18:16:29+00:00",
         "match_time":15,
         "competitor":"away",
         "players":[
            {
               "id":"sr:player:138601",
               "name":"Uryga, Alan",
               "type":"scorer"
            }
         ],
         "x":0,
         "y":0,
         "period":1,
         "period_type":"regular_period",
         "updated":true,
         "updated_time":"2024-08-29T18:38:04+00:00",
         "home_score":0,
         "away_score":1,
         "method":"header"
      }
   },
   "metadata":{
      "format":"json",
      "sport_event_id":"sr:sport_event_id:52633623",
      "event_id":"score_change",
      "channel":"soccer",
      "competition_id":"sr:competition:34480",
      "sport_id":"sr:sport:1",
      "season_id":"sr:season:119783"
   }
}{
   "payload":{
      "sport_event_status":{
         "status":"live",
         "match_status":"1st_half",
         "home_score":1,
         "away_score":0,
         "period_scores":[
            {
               "home_score":1,
               "away_score":0,
               "type":"regular_period",
               "number":1
            }
         ],
         "ball_locations":[
            {
               "order":4,
               "x":5,
               "y":50,
               "qualifier":"home"
            },
            {
               "order":3,
               "x":8,
               "y":47,
               "qualifier":"away"
            },
            {
               "order":2,
               "x":0,
               "y":100,
               "qualifier":"away"
            },
            {
               "order":1,
               "x":4,
               "y":51,
               "qualifier":"away"
            }
         ],
         "match_situation":{
            "status":"safe",
            "qualifier":"home",
            "updated_at":"2024-08-29T18:37:58+00:00"
         }
      },
      "event":{
         "id":1830323327,
         "type":"shot_off_target",
         "time":"2024-08-29T18:37:57+00:00",
         "match_time":36,
         "match_clock":"35:01",
         "competitor":"away",
         "players":[
            {
               "id":"sr:player:2200110",
               "name":"Pereira, Gabriel"
            }
         ],
         "x":8,
         "y":47,
         "period":1,
         "period_type":"regular_period",
         "updated":true,
         "updated_time":"2024-08-29T18:38:04+00:00",
         "outcome":"miss"
      }
   },
   "metadata":{
      "format":"json",
      "sport_event_id":"sr:sport_event_id:52633595",
      "event_id":"shot_off_target",
      "channel":"soccer",
      "competition_id":"sr:competition:34480",
      "sport_id":"sr:sport:1",
      "season_id":"sr:season:119783"
```

<br />

### Disconnections

Should you cease to receive heartbeat messages, or are disconnected from the Push service for any reason, re-connect using your same initial [request](https://developer.sportradar.com/soccer/docs/soccer-ig-push#make-a-request).

<br />

### Metadata

Each payload includes a metadata header message. The metadata includes information on the type of payload and possible filtering options, saving processing and integration time.

```json Metadata Sample (Push Events - Freekick)
      "event":{
         "id":1830323365,
         "type":"free_kick",
         "time":"2024-08-29T18:38:04+00:00",
         "match_time":37,
         "match_clock":"36:45",
         "competitor":"home",
         "x":65,
         "y":29,
         "period":1,
         "period_type":"regular_period"
```
```json Metadata Sample (Push Statistics - Shot on Target)
   "metadata":{
      "format":"json",
      "sport_event_id":"sr:sport_event_id:52633247",
      "event_id":"shot_on_target",
      "channel":"soccer",
      "competition_id":"sr:competition:679",
      "sport_id":"sr:sport:1",
      "season_id":"sr:season:119781"
```

Visit the [Endpoints](https://developer.sportradar.com/soccer/reference/soccer-push-feeds) documentation for each feed to view all available [data points](https://developer.sportradar.com/soccer/reference/soccer-push-events#data-points).

***

<br />

## Samples

<br />

### Code Samples

To best utilize Push feeds, see the below code samples in Ruby and Java. These provide an example of a method to consume the feeds. Using these samples will output the feeds content to STDOUT.

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

<br />

### Data Samples

See Push samples ([Events](https://api-docs.sportradar.us/soccer/Soccer_v4_Push_Events.json), [Statistics](https://api-docs.sportradar.us/soccer/Soccer_v4_Push_Statistics.json)) of a complete game.

<br />

***

## Endpoint Docs

Visit the links below for syntax structure, data samples, and data dictionaries for all Soccer Push feeds.

* [Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events) - Provides detailed, real-time information on every live match event.
* [Push Statistics](https://developer.sportradar.com/soccer/reference/soccer-push-statistics) - Provides detailed, real-time game stats at the team and player level for all live matches.

  ### Access

  Our Soccer Push feed is available exclusively for **Realtime plans**. Reach out to our sales team for more information.

<br />

***

## Simulations

Since Push feeds only deliver data during live matches, our Simulations tool is the best way to test your Push integration outside of live windows. Simulations let you replay recorded matches on demand against both REST and Push feeds, so you can validate how your application handles streaming events, statistics updates, heartbeats, and disconnections without waiting for a real match.

See the Simulations documentation for available recordings, supported endpoints, and session handling.

<br />
