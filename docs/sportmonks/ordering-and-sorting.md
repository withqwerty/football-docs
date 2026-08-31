---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.847Z
---
# Ordering and sorting

For paginated endpoints, the API supports ordering on a specific field. Read more on how to use ordering on this page.

{% hint style="info" %}
We would love your feedback on the sorting functionality! If you have suggestions for fields to apply sorting on, or have encountered any issues, please contact <support@sportmonks.com>
{% endhint %}

### Ordering

The `order` query parameter is used to specify the order in which paginated results should be returned. By default, results are returned in ascending order. However, you can use the `order` parameter to specify that results should be returned in descending order instead.

Using ordering allows for more convenient results to be returned, next to that it can potentially save you from making API calls as you don't have to propagate through redundant results.

#### **Parameters**

| Parameter | Required | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `order`   | No       | The order in which results should be returned (`asc` or `desc`). |

#### **Usage**

To use the `order` query parameter, simply include it in the request URL for paginated endpoints. For example:

```http
https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN&page=2&order=desc
```

In this example, the API will return page 2 of results for the `leagues` endpoint, in descending order.

{% hint style="info" %}
The field used for ordering differs per endpoint, you should consult the endpoints documentation page to see what field the ordering applies on.
{% endhint %}

### Custom sorting

You can use custom sorts on endpoints; this enables the sorting of base entities returned in the endpoint responses. This feature is designed to enhance flexibility and customisation for users interacting with the API.

#### Usage

This provides users with the ability to customise sorting of returned data through the use of the `sortBy` and `order` parameters. This functionality is particularly useful when retrieving lists of fixtures in football, as it allows users to organise the data based on specific criteria.

**Sorting Fixtures**

When querying fixtures, users can specify the field to sort by and the desired order using the following parameters:

* **sortBy**: Specifies the field by which the data will be sorted. Currently supported fields include `starting_at` and `name`.
* **order**: Determines the order in which the data will be sorted. Users can choose between ascending (`asc`) and descending (`desc`) orders.

{% hint style="warning" %}
**`sortBy` accepts a single field only.** Compound or multi-level sorting (for example, sorting by league first and then by date) is not currently supported. Passing more than one field to `sortBy` returns a 400 error.

If your application needs compound ordering, fetch the data using a single `sortBy` field and apply the secondary sort client-side.
{% endhint %}

#### Examples

**Sort by `starting_at`**: This option sorts the fixtures based on their starting date and time.

```http
https://api.sportmonks.com/v3/football/fixtures&sortBy=starting_at&order=desc
```

This URL sorts the fixtures in descending order of their starting date and time.

**Sort by `name`**: This option sorts the fixtures alphabetically based on their names.

```http
https://api.sportmonks.com/v3/football/fixtures&sortBy=name&order=asc
```

This URL sorts the fixtures alphabetically by their names in ascending order.

**Example error response**: passing more than one field to `sortBy` is rejected.

```http
https://api.sportmonks.com/v3/football/fixtures
?api_token=YOUR_TOKEN&sortBy=starting_at,name&order=desc
```

```json
{
  "message": "Only the usage of the field(s): name or starting_at; 
  is supported for custom sorting on the Fixture entity. 
  You may leave the sortBy parameter empty to use the default sort"
}
```

{% hint style="info" %}
Sorting on the `name` field currently works for all entities with a `"name"` field. For Fixtures, sorting also works on the `starting_at` field.
{% endhint %}

**Sortable fields by entity**

| Entity                             | Sortable fields       |
| ---------------------------------- | --------------------- |
| Fixture                            | `name`, `starting_at` |
| League                             | `name`                |
| Team                               | `name`                |
| Other entities with a `name` field | `name`                |

{% hint style="danger" %}
If an unsupported field is passed to sort on, an error is thrown, and the request returns a 400 Bad Request HTTP code.
{% endhint %}

We want to encourage users to provide feedback on the sorting functionality. If you have suggestions for new fields or have encountered any issues, please contact <support@sportmonks.com> to improve and enhance the API experience.

Feel free to reach out with any questions or suggestions!