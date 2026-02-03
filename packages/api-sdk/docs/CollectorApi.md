# CollectorApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**collectorControllerCollect**](#collectorcontrollercollect) | **POST** /api/public/collect | |

# **collectorControllerCollect**
> collectorControllerCollect(body)


### Example

```typescript
import {
    CollectorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CollectorApi(configuration);

let body: object; //

const { status, data } = await apiInstance.collectorControllerCollect(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

